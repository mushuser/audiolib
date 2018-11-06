function get_source_ids() {
  var folder = DriveApp.getFolderById(secret.source_folder_id)
  var files = folder.getFiles()
  
  while (files.hasNext()) {
    var file = files.next();
    var desc = file.getDescription()
    
  }   
}


function batch_work(source_id) {
  if(update_occ_key()) {
    console.log("api key: %s", headers["X-Oc-Api-Key"])
  } else {
    console.log("all keys not available")
    return  
  }

  var size = DriveApp.getFileById(source_id).getSize()
  if(size > OCC_MAX_SIZE) {
    console.log("file over size:%s:%d", source_id, size)
    return  
  }
  
  var work = send_work(source_id)
  var job_id = work.id
  console.log("send_work() return job id: %s", job_id)

  var output = polling_occ_work(job_id)
  var size = output.size
  
  if(size > STT_MAX_SIZE) {
    console.log("OCC result over size: %d", size)
    return
  }
  
  var uri = output.uri
  console.log("polling_occ_work() return uri: %s", uri)
  
  var json = uri_to_gs(uri)
  var gs_uri = get_gs_uri(json)
  console.log("uri_to_gs() return gs: %s", gs_uri)
  
  var name = sst_longrunningrecognize(gs_uri).name
  var results = polling_stt_work(name)
  console.log(results)
  var lines = get_lines(results)
  console.log(lines)  
}
