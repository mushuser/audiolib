function batch_works() {
  var folder = DriveApp.getFolderById(secret.source_folder_id)
  var files = folder.getFiles()
  
  while (files.hasNext()) {
    var file = files.next()
    var id = file.getId()
    var name = file.getName() 
    var size = file.getSize()    
    var desc = file.getDescription()
    
    if(desc == null) {
      var msg = Utilities.formatString("batch(): %s: %s: %d", name, id, size)   
      httplib.printc(msg)
      var r = single_work(id)
      if(r == st_single_work.OK) {
        move_completed(id)  
      }
    } else {
      var msg = Utilities.formatString("already: %s: %s: %d: %s", name, id, size, desc)
      httplib.printc(msg)
    }  
  }
  
  httplib.printc("batch_works() finished")
}


var batch_numbers = 10

//
function get_batch_files() {
  var folder = DriveApp.getFolderById(secret.source_folder_id)
  var files = folder.getFiles()
  var result_files = []
  
  while (files.hasNext()) {
    if(result_files.length == batch_numbers) {
      return result_files  
    }
    
    var file = files.next()
    var desc = file.getDescription()
    var size = file.getSize()
    
    if(size > OCC_MAX_SIZE) {
      move_oversized(file)
      continue
    }
    
    if((desc == null) || (desc == undefined)) {
      result_files.push(file)
    } else {
      if(desc.length > 0) {
        move_completed(file)
      } else {
        result_files.push(file)
      }
    }
  }

  return result_files
}


function get_batch_ids(files) {
  var ids = []
  
  for(var i in files) {
    ids.push(files[i].getId())
  }
  
  return ids
}


function multi_works() {
  var am = get_keys_status()
  httplib.printc("before available minutes: %d", am)
  
  if(update_occ_key()) {
    httplib.printc("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    httplib.printc("all keys not available")
    return st_single_work.NO_KEY_AVAILABLE
  }
  
  var files = get_batch_files()
  
  var ids = get_batch_ids(files)
  httplib.printc(ids)
  
  var occ_outputs = occ_works(ids, files)
  httplib.printc(occ_outputs)
  
  var lines = stt_works(occ_outputs, files)
  httplib.printc(lines)

  var am = get_keys_status()
  httplib.printc("after available minutes: %d", am)
}


function clean_works(files, lines) {
  for(var i in files) {
    var file = files[i]
    var line = lines[i]
    
    if(line != undefined) {
      file.setDescription(line)
      move_completed(file)
    }
  }  
}

var st_single_work = {
  "OK":0,
  "OCC_OVERSIZE":1,
  "STT_OVERSIZE":2,
  "UNKNOWN":3,
  "NO_KEY_AVAILABLE":4
}

// true oversized
function check_occ_size(files) {
  var size = file.getSize()
  var id = file.getId()
  
  if(size >= OCC_MAX_SIZE) {
    httplib.printc("OCC over size: %s: %d", id, size)
    move_oversized(id)
    return true
  } else {
    return false 
  }
}


function single_work(source_id) {
  if(update_occ_key()) {
    httplib.printc("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    httplib.printc("all keys not available")
    return st_single_work.NO_KEY_AVAILABLE
  }

  var file = DriveApp.getFileById(source_id)
  var filename = file.getName()
  var size = file.getSize()
  httplib.printc("%s:%d", filename, size)
  
  if(size > OCC_MAX_SIZE) {
    httplib.printc("OCC over size: %s: %d", source_id, size)
    move_oversized(source_id)
    return st_single_work.OCC_OVERSIZE
  }
  
  var work = send_work([source_id])
  httplib.printc(work)
  var job_id = work.id
//  httplib.printc("send_work(): %s", job_id)

  var output = polling_occ_work(job_id)
  httplib.printc(output)
  var occ_size_b = output.size
  var occ_size_m = Math.round(occ_size_b/1024/1024)
  
  if(occ_size_b > STT_MAX_SIZE) {
    httplib.printc("STT over size: %d", occ_size_m)
    move_oversized(source_id)
    return st_single_work.STT_OVERSIZE
  }
  
  var uri = output.uri
//  httplib.printc("polling_occ_work(): %s", uri)
  
  var status = st_single_work.OK
  
  try {
    var json = uri_to_gs(uri)
    var gs_filename = json.name
    var gs_uri = get_gs_uri(json)
//    httplib.printc("uri_to_gs(): %s", gs_uri)    
    var name = sst_longrunningrecognize(gs_uri).name
    var results = polling_stt_work(name)
    httplib.printc(results)
    var lines = get_lines(results)
    
    file.setDescription(lines)  
  } catch(e) {
    httplib.printc("UNKNOWN: %s", e)  
    status = st_single_work.UNKNOWN   
  } finally {
    remove_gs(gs_filename)
    httplib.printc("%s: %s", filename, lines)  
  }
  
  return status
}


function move_completed(file_or_id) {
  if(typeof(file_or_id) == "object") {
    var file = file_or_id
  } else {
    var file = DriveApp.getFileById(file_or_id)  
  }
  
  var old_folder = DriveApp.getFolderById(secret.source_folder_id)
  var new_folder = DriveApp.getFolderById(secret.completed_folder_id)  
  
  new_folder.addFile(file)
  old_folder.removeFile(file)
}


function move_oversized(file_or_id) {
  if(typeof(file_or_id) == "object") {
    var file = file_or_id
  } else {
    var file = DriveApp.getFileById(file_or_id)  
  }
  
  var old_folder = DriveApp.getFolderById(secret.source_folder_id)
  var new_folder = DriveApp.getFolderById(secret.oversized_folder_id)  
  
  new_folder.addFile(file)
  old_folder.removeFile(file)
}
// sort by file size 
// set input array


function gg() {
  var file = DriveApp.getFileById("1caHq2cUiSWrgEy0l5X75aWLyW9rtR0Zw")
  
  Logger.log(typeof(file) == "object")
  return
  update_occ_key()
  var output = polling_occ_work("1f740df8-9e0e-4587-a2db-12452f5bec53")
  httplib.printl(output)
//  var url_zip = "https://www5.online-convert.com/dl/web1/download-file/74b0d93c-8531-47b6-a6a9-0249998bc1d2/converted-file-8c1588.zip"
//  var zip = UrlFetchApp.fetch(url_zip).getAs("application/zip")
//  
//  var unzips = Utilities.unzip(zip)
//  
//  Logger.log(unzips)
//  unzips[0].
  
  
  
}