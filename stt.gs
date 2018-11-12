var STT_BASE_URL = "https://speech.googleapis.com/"
var STT_MAX_SIZE = 51000*60*60 // flac 51000bytes/second, 60minutes for 175M
var STT_MEMORY_SIZE = 10 * 1024 * 1024


function remove_mp3s_no_desc() {
  var folder = DriveApp.getFolderById(secret.mp3_folder_id)
  var files = folder.getFiles()

  while (files.hasNext()) {
    var file = files.next()
    var desc = file.getDescription()
      
    if(desc == null) {
      file.setTrashed(true) 
    } else {
      if(desc.length < 1) {
        file.setTrashed(true)   
      }
    }
  }  
}


function stt_works(occ_outputs) {
  var result_lines = []
  
  for(var i in occ_outputs) {
    var occ_output = occ_outputs[i]
    
    var uri = occ_output.uri
    var gs = gs_upload(uri)
    var gs_filename = gs.name
        
    var gs_uri = get_gs_uri(gs)    
//    httplib.printc("uri_to_gs(): %s", gs_uri)    

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
      move_completed(wma_file)    
      
      var mp3_drive_id = occ_output.mp3_drive_id
      var mp3_file = DriveApp.getFileById(mp3_drive_id)
      mp3_file.setDescription(line)
    }
  }
  
  return result_lines
}


function polling_stt_work(name) { 
  while(true) {
    Utilities.sleep(2*1000) 
    
    var status = get_status(name)
    var done = status.done
    if(done) {
      var results = status.response.results
      
      return results
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
  
  var url = STT_BASE_URL + "/v1/speech:longrunningrecognize"    
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j  
}


function get_status(name) {
  var url = "https://speech.googleapis.com/v1/operations/" + name

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