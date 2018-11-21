var STT_VERSION = "v1p1beta1" // v1p1beta1 or v1
var STT_BASE_URL = "https://speech.googleapis.com/" + STT_VERSION
var STT_MAX_SIZE = 51000*60*60 // flac 51000bytes/second, 60minutes for 175M
var STT_MEMORY_SIZE = 10 * 1024 * 1024

function remove_mp3s_no_desc() {
  var folder = DriveApp.getFolderById(secret.mp3_folder_id)
  var files = folder.getFiles()
  var rm_files = []
  
  while (files.hasNext()) {
    var file = files.next()
    var desc = file.getDescription()
    var name = file.getName()
    var ext = get_filename_ext(name)
    
    if(ext != "mp3") {
      continue  
    }      
    
    if(desc == null) {
      file.setTrashed(true)
      rm_files.push(name)
    } else {
      if(desc.length < 1) {
        file.setTrashed(true)   
        rm_files.push(name)
      }
    }
  }  
  
  if(rm_files.length > 0) {
    httplib.printc("removed files: %s", rm_files)
  } else {
    httplib.printc("no no-desc mp3 removed")
  }
  return rm_files
}

// obsoleted
function stt_works(occ_outputs) {
  var result_lines = []
  
  httplib.printc("STT_VERSION: %s", STT_VERSION)
  
  for(var i in occ_outputs) {
    var occ_output = occ_outputs[i]
    
    var uri = occ_output.uri
    var gs = gs_upload(uri)
    var gs_filename = gs.name
        
    var gs_uri = get_gs_uri(gs.bucket, gs.name)    
//    httplib.printc("uri_to_gs(): %s", gs_uri)    

    var name = sst_longrunningrecognize(gs_uri).name
    var stt = polling_stt_work(name)
    if(stt == undefined) {
      httplib.printc("polling_stt_work(): reached max compute time")    
      return undefined
    }
    
    var line = get_line(stt)
    result_lines.push(line)
    httplib.printc("[%s] %s", gs_filename, line)

    if(line.length > 0) {
      remove_gs(gs_filename)  
    
      var wma_drive_id = occ_output.wma_drive_id
      var wma_file = DriveApp.getFileById(wma_drive_id)
      wma_file.setDescription(line)
      move_completed(wma_file)    
      
      var mp3_drive_id = occ_output.mp3_drive_id
      var mp3_file = DriveApp.getFileById(mp3_drive_id)
      mp3_file.setDescription(line)
    }
  }
  
  return result_lines
}


function stt_works_gst(occ_outputs) {
  var result_lines = []
  
  httplib.printc("stt_works_gst(): %s", STT_VERSION)
  
  for(var i in occ_outputs) {
    var occ_output = occ_outputs[i]
    
    // file uploaded in gst_works()
    var uri = occ_output.uri
    var gs_filename = get_filename(uri)
    
    if(check_file_exist(gs_filename) == false) {
      httplib.printc("%s: not exists", gs_filename)
      continue  
    }
    
    var gs_uri = get_gs_uri(GS_BUCKET_NAME, gs_filename)       
    httplib.printc("stt_works_gst(): %s", gs_uri)    

    var name = sst_longrunningrecognize(gs_uri).name
    var stt = polling_stt_work(name)
//    httplib.printc("stt_works(): %s", JSON.stringify(stt))    
    
    var line = get_line(stt)
    result_lines.push(line)
    httplib.printc("[%s] %s", gs_filename, line)

    if(line.length > 0) {
      remove_gs(gs_filename)  
    
      var wma_drive_id = occ_output.wma_drive_id
      var wma_file = DriveApp.getFileById(wma_drive_id)
      wma_file.setDescription(line)
      if(wma_file.isStarred() == true) {
        wma_file.setStarred(false) // for oversized
      }
      move_completed(wma_file)    
      
      var mp3_drive_id = occ_output.mp3_drive_id
      var mp3_file = DriveApp.getFileById(mp3_drive_id)
      mp3_file.setDescription(line)
    }
  }
  
  return result_lines
}


function polling_stt_work(name) { 
  var start_time = new Date()
  
  while(true) {
    Utilities.sleep(2*1000) 
    
    var status = get_status(name)
    var done = status.done
    if(done) {
      var results = status.response.results
      
      return results
    }
    
    var duration_s = Math.round((new Date() - g_now)/1000)
    
    if((duration_s % 20) == 0) {
      httplib.printc("polling_stt_work(): waiting")
    }
    
    if(duration_s > MAX_COMPUTE_TIME) {
      return undefined  
    }
  }  
}


function get_encoding(uri) {
  var ext = uri.match(/([^\.]+$)/g)[0]
  
  return ext.toUpperCase()
}


function sst_longrunningrecognize(uri) {
  var access_token = authlib.g_get_accesstoken()
  var bearauth = authlib.get_bearerauth(access_token)
  
  var headers = {
    "Content-Type": "application/json",
    "Authorization": bearauth,
  }

  var payload = {
    "audio": {
      "uri": uri
    },
    "config": {
      "enableAutomaticPunctuation": false,
      "encoding": get_encoding(uri),
      "languageCode": "cmn-Hant-TW",
      "model": "default",
      "speechContexts": [{
        "phrases":secret.phrases
      }]
    }
  }  
  
  var options = {
    "payload":JSON.stringify(payload),
    "headers":headers,
    "muteHttpExceptions": false    
  }
  
  var url = STT_BASE_URL + "/speech:longrunningrecognize"    
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j  
}


function get_status(name) {
  var url = STT_BASE_URL + "/operations/" + name

  var access_token = authlib.g_get_accesstoken()
  var bearauth = authlib.get_bearerauth(access_token)
  
  var headers = {
    "Content-Type": "application/json",
    "Authorization": bearauth
  }

  var options = {
    "headers":headers,
    "muteHttpExceptions": false    
  }
  
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}


function get_line(results) {
  var lines = ""
  
  for(var i in results) {
    var result = results[i]
    var alternatives = result.alternatives
    if(alternatives) {
      var transcript = alternatives[0].transcript  
      var lines = lines + transcript + "\n"
    }
  }
  
  if(lines.length == 0) {
    lines = "(無STT內容)"  
  }
  
  return lines
}