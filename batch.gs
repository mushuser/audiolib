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
      var msg = Utilities.formatString("batch():%s:%s:%d", name, id, size)   
      console.log(msg)
      single_work(id)
    } else {
      var msg = Utilities.formatString("done:%s:%s:%d:%s", name, id, size, desc)
      console.log(msg)
    }    
  }
  
  console.log("batch_works() finished")
}


function single_work(source_id) {
  if(update_occ_key()) {
    console.log("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    console.log("all keys not available")
    return  
  }

  var file = DriveApp.getFileById(source_id)
  var filename = file.getName()
  var size = file.getSize()
  if(size > OCC_MAX_SIZE) {
    console.log("file over size:%s:%d", source_id, size)
    return  
  }
  
  var work = send_work(source_id)
  var job_id = work.id
  console.log("send_work(): %s", job_id)

  var output = polling_occ_work(job_id)
  var occ_size = output.size
  
  if(occ_size > STT_MAX_SIZE) {
    console.log("OCC result over size: %d", occ_size)
    return
  }
  
  var uri = output.uri
  console.log("polling_occ_work(): %s", uri)
  
  try {
    var json = uri_to_gs(uri)
    var gs_filename = json.name
    var gs_uri = get_gs_uri(json)
    console.log("uri_to_gs(): %s", gs_uri)
    
    var name = sst_longrunningrecognize(gs_uri).name
    var results = polling_stt_work(name)
    var lines = get_lines(results)
    
    file.setDescription(lines)  
  } finally {
    remove_gs(gs_filename)
    
    console.log("%s:%s", filename, lines)  
  }
}
