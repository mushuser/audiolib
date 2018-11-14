var batch_numbers = 5

//
function get_batch_files(folder_id, max) {
  var folder = DriveApp.getFolderById(folder_id)
  var files = folder.getFiles()
  var result_files = []
  
  while (files.hasNext()) {
    if(result_files.length >= max) {
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


function batch_works_oversized() {
  var files = get_batch_files(secret.oversized_folder_id, 1)
  httplib.printc("%s", "batch_works_oversized()")
  batch_works(files)  
}


function batch_works(files) {
  if(files == undefined) {
    var files = get_batch_files(secret.source_folder_id, batch_numbers)
  }
  
  if(files.length < 1) {    
    return
  }

  if(update_occ_key()) {
    httplib.printc("OCC key: %s", headers["X-Oc-Api-Key"])
  } else {
    httplib.printc("all keys not available")
    return st_single_work.NO_KEY_AVAILABLE
  }  

  var ids = get_id_fr_files(files)
  httplib.printc("drive IDs: %s", ids)

  var occ_outputs = occ_works(ids)
//  httplib.printc("%s", JSON.stringify(occ_outputs))

  var lines = stt_works(occ_outputs)
//  httplib.printc(lines)
  remove_mp3s_no_desc()
}


var st_single_work = {
  "OK":0,
  "OCC_OVERSIZE":1,
  "STT_OVERSIZE":2,
  "UNKNOWN":3,
  "NO_KEY_AVAILABLE":4
}


function clean_folders(file, keep_folder_id) {
  var parents = file.getParents()
  
  while (parents.hasNext()) {
    var folder = parents.next();
    var folder_id = folder.getId()
    
    if(folder_id != keep_folder_id) {
      folder.removeFile(file)
    }
  }
}


function move_completed(file_or_id) {
  if(typeof(file_or_id) == "object") {
    var file = file_or_id
  } else {
    var file = DriveApp.getFileById(file_or_id)  
  }
  var new_folder = DriveApp.getFolderById(secret.completed_folder_id)  
  
  new_folder.addFile(file)  
  clean_folders(file, secret.completed_folder_id)
}


function move_oversized(file_or_id) {
  if(typeof(file_or_id) == "object") {
    var file = file_or_id
  } else {
    var file = DriveApp.getFileById(file_or_id)  
  }
  
  var new_folder = DriveApp.getFolderById(secret.oversized_folder_id)  
  
  new_folder.addFile(file)  
  clean_folders(file, secret.oversized_folder_id)
}