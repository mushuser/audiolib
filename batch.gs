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
      single_work(id)
      break
    } else {
      var msg = Utilities.formatString("already: %s: %s: %d: %s", name, id, size, desc)
      httplib.printc(msg)
    }  
  }
  
  httplib.printc("batch_works() finished")
}


function multi_works(source_ids) {

}


function single_work(source_id) {
  if(update_occ_key()) {
    httplib.printc("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    httplib.printc("all keys not available")
    return  
  }

  var file = DriveApp.getFileById(source_id)
  var filename = file.getName()
  var size = file.getSize()
  httplib.printc("%s:%d", filename, size)
  
  if(size > OCC_MAX_SIZE) {
    httplib.printc("OCC over size: %s: %d", source_id, size)
    move_oversized(source_id)
    return  
  }
  
  var work = send_work(source_id)
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
    return
  }
  
  var uri = output.uri
//  httplib.printc("polling_occ_work(): %s", uri)
  
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
  } finally {
    remove_gs(gs_filename)
    
    httplib.printc("%s: %s", filename, lines)  
  }
}


function move_oversized(source_id) {
  var child =  DriveApp.getFileById(source_id)
  var old_folder = DriveApp.getFolderById(secret.source_folder_id)
  var new_folder = DriveApp.getFolderById(secret.oversized_folder_id)  
  
  new_folder.addFile(child)
  old_folder.removeFile(child)
}
// sort by file size 
// set input array