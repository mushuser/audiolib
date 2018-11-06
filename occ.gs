var MAX_DAILY = 30
var OCC_BASE_URL = "https://api2.online-convert.com"
var CONVERSION_TARGET = "flac"
var OCC_MAX_SIZE = 100*1024*1024 // 100M


var headers = {
  "Content-Type": "application/json",
  "X-Oc-Api-Key": undefined,
  "Cache-Control": "no-cache"
}  


function update_occ_key() {
  for(var i in secret.occ_keys) {
    var key = secret.occ_keys[i]
    
    if(reached_daily_max(key) == false) {
      return key  
    }
  }
  
  return undefined
}


function polling_occ_work(job_id) {
  while(true) {
    Utilities.sleep(1*1000) 
    var r = query_work(job_id)
    var code = r.status.code
    
    if(code == "completed") {
      var output = r.output[0]
      return output
    } else {
      console.log("polling_occ_work() status: %s", code)
    }
  }  
}


function query_work(job_id) {
  var url = OCC_BASE_URL + "/jobs/" + job_id
  var options = {
    "headers":headers
  }
  
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}


function send_work(source_id) {
  var source = "https://drive.google.com/uc?export=download&id=" + source_id
  
  var input = [{
    "type": "remote",
    "source": source}]    
  
  var conversion = [{
    "target": CONVERSION_TARGET,
    "options": {
      "channels": "mono"  
    }
  }]
  
  var payload = {
    "input": (input),
    "conversion": (conversion)
  }
  
  var options = {
    "payload": JSON.stringify(payload),
    "headers": headers
  }
  
  var url = OCC_BASE_URL + "/jobs"
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}


function set_new_folder(new_folder_id, child_id) {
  var old_folder = DriveApp.getFolderById("root")
  var child = DriveApp.getFileById(child_id)
  old_folder.removeFile(child)
  
  var new_folder = DriveApp.getFolderById(new_folder_id)
  var folder = new_folder.addFile(child)
  
  return folder
}


function drive_upload(uri, filename) {  
  var blob = UrlFetchApp.fetch(uri).getBlob();
  var file = DriveApp.createFile(blob)
  file.setName(filename)
  
  var id = file.getId()
  set_new_folder(secret.mp3_folder_id, id)

  return id
}


function reached_daily_max(key) {
  var t = get_api_status(key)
  
  if(t == "") {
    return false
  } else {
    var jobs = JSON.parse(t)  
  }

  var key_minutes = 0
  
  for(var i in jobs) {
    var job = jobs[i]
    
    key_minutes = key_minutes + job.conversion_minutes
  }

  if(key_minutes >= MAX_DAILY) {
    return true  
  } else {
    return false  
  }
}


function get_api_status(key) {
  var date_str = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd")
  var url = OCC_BASE_URL + "/stats/day/" + date_str + "/single"
  
  headers["X-Oc-Api-Key"] = key
  var options = {
    "headers":headers
  }
   
  var r = httplib.httpretry(url, options)

  return r
}


function all_api_status() {
  var total_minutes = 0
  
  for(var i in secret.occ_keys) {
    var key = secret.occ_keys[i]

    var t = get_api_status(key)
    var key_minutes = 0
    
    if(t == "") {
      key_minutes = 0
    } else {
      var jobs = JSON.parse(t)  
      
      for(var i2 in jobs) {
        var job = jobs[i2]
        key_minutes = key_minutes + parseInt(job.conversion_minutes)
      }    
    } 
    total_minutes = total_minutes + key_minutes
    console.log("%d:%s:%d:%d", parseInt(i) + 1, key, key_minutes, 30-key_minutes) 
  }
  
  console.log("%d keys, available minutes: %d", secret.occ_keys.length, secret.occ_keys.length * 30 - total_minutes) 
}  
