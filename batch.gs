var batch_numbers = 5


function get_filename_ext(filename) {
  var match = filename.match(/\.([^\.]*$)/)
  if(match) {
    var ext = match[1]  
    return ext.toLowerCase()
  } else {
    return undefined    
  }
}


function get_mainname_fr_mp3s() {
  var folder = DriveApp.getFolderById(secret.mp3_folder_id)
  var files = folder.getFiles()
  var mainnames = []
  
  while (files.hasNext()) {
    var file = files.next()
    var filename = file.getName()
    var ext = get_filename_ext(filename)
    
    if(ext == "mp3") {
       var mainname = get_mainname(file.getName())
       mainnames.push(mainname)
    }
  }
  
  return mainnames  
}


function get_mainname(filename) {
  var match = filename.match(/(.*)\./)[1]
  
  return match
}


function has_desc(desc) {
  if((desc == null) || (desc == undefined)) {    
    return false  
  } else {
    if(desc.length > 0) {
      return true  
    } else {
      return false
    }
  }
}

//
function get_batch_files(folder_id, max) {
  var folder = DriveApp.getFolderById(folder_id)
  var files = folder.getFiles()
  var result_files = []
  var mp3_mainnames = get_mainname_fr_mp3s()
  
  while (files.hasNext()) {
    if(result_files.length >= max) {
      return result_files  
    }
    
    var file = files.next()
    var desc = file.getDescription()
    var size = file.getSize()
    var filename = file.getName()
    var ext = get_filename_ext(filename)
    
    if(ext != "wma") {
      continue  
    }
    
    var mainname = get_mainname(filename)
    
    if(size > OCC_MAX_SIZE) {
      move_oversized(file)
      continue
    }
    
    // if done
    if((mp3_mainnames.indexOf(mainname) > -1) && has_desc(desc)) {
      if(folder_id != secret.completed_folder_id) { 
        move_completed(file)
      }
      continue
    }
    
    // if not done, goes here

    // oversized    
    if(folder_id == secret.oversized_folder_id) {
      if(file.isStarred() == false) {
        file.setStarred(true)
        result_files.push(file)
      }
      continue
    }
    
    result_files.push(file)
  }

  return result_files
}


// for those wma in completed folder, but not in mp3 folder
function batch_works_halfdone() {
  var files = get_batch_files(secret.completed_folder_id, batch_numbers)
  httplib.printc("batch_works_halfdone()")
  batch_works(files)  
}


function batch_works_oversized() {
  var files = get_batch_files(secret.oversized_folder_id, 1)
  httplib.printc("batch_works_oversized()")
  batch_works(files)  
}

// run by trigger
// {"year":2018,"month":11,"day-of-month":14,"day-of-week":3,"week-of-year":46,"hour":1,"minute":3,"second":33,"timezone":"UTC","authMode":{},"triggerUid":"65417"}
function batch_works(files) {
  if((files == undefined) || files.hasOwnProperty("year")) {
    var files = get_batch_files(secret.source_folder_id, batch_numbers)
  }
  
  if(files.length < 1) {
    httplib.printc("batch_works(): no files to do")    
    return
  }

  var key = undefined
  if(key = get_available_key(files.length)) {
    httplib.printc("batch_works(): key: %s", key)
  } else {
    httplib.printc("batch_works(): all keys not available")
    return
  }  
  
  for(var i in files) {
    var file = files[i]
    var id = file.getId()
    var name = file.getName()
    httplib.printc("Processing: %s, %s", name, id)
  }
  
  var ids = get_id_fr_files(files)
  
  try {
    var occ_outputs = occ_works(ids)
    //  httplib.printc("%s", JSON.stringify(occ_outputs))
    
    var lines = stt_works(occ_outputs)
    //  httplib.printc(lines)
  } finally {
    remove_mp3s_no_desc()
  }
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