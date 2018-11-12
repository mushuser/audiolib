var batch_numbers = 5

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


function batch_works() { 
  var files = get_batch_files()
  
  if(files.length < 1) {    
    return
  }

  if(update_occ_key()) {
    httplib.printc("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    httplib.printc("all keys not available")
    return st_single_work.NO_KEY_AVAILABLE
  }  
  
  var ids = get_id_fr_files(files)
  httplib.printc("ids: %s", ids)

  var occ_outputs = occ_works(ids)
//  httplib.printc("%s", JSON.stringify(occ_outputs))

  var lines = stt_works(occ_outputs)
//  httplib.printc(lines)
}


var st_single_work = {
  "OK":0,
  "OCC_OVERSIZE":1,
  "STT_OVERSIZE":2,
  "UNKNOWN":3,
  "NO_KEY_AVAILABLE":4
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

function xx() {
  update_occ_key() 
  var ids = ["1mqM2TgLgxxHzoEUJsOWZbjEo7hSIB64G", "1Nq2CizPuWRLboyNdN1c-GSljMYwdXya3"]
  var j = send_occ_work(ids)  
//  Logger.log(j)  
  var j2 = polling_occ_work(j.id)
  Logger.log(j2)
}


function kk() {
  var uri = "https://www29.online-convert.com/dl/web2/download-file/5f967a0f-92eb-48b3-a7c7-bd1249b7115c/sample.mp3"
  var j = gs_upload(uri)
  var gs_uri = get_gs_uri(j)
  
  Logger.log(gs_uri)
}


function ll() {
  var gs_uri = "gs://audiolib-storage/sample.mp3"
  var name = sst_longrunningrecognize(gs_uri).name
  var stt = polling_stt_work(name)
  Logger.log(stt)
  
  var line = get_line(stt)  
}