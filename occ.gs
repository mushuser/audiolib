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

  var total_minutes = 0
  
  for(var i in jobs) {
    var job = jobs[i]
    
    total_minutes = total_minutes + job.conversion_minutes
  }

  if(total_minutes >= MAX_DAILY) {
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
//  var j = JSON.parse(r)

  return r
}


function doGet(e) {
  var name = e.parameter.name
  var dir = e.parameter.dir
  var data = redditlib.get_parent(name)
  var age = redditlib.get_age(data.created_utc)
  var title = data.title.slice(0,15)
  var logged_user = e.parameter.logged_user

  var obj = {
    "name":name,
    "dir":dir,
    "age":age,
    "title":title,
    "voter":redditlib.voter_obj.voter,
    "logged_user":logged_user    
  }
  
  if(obj["logged_user"] == creds_main.username) {
    redditlib.set_arg_queue(obj)
    console.log("received:%s", obj)
    
    var ret_obj = obj
  } else {
    var msg = "not from main user, skipped:" + JSON.stringify(obj)
    console.log(msg)
    
    var ret_obj = {
      "result":msg
    }
  }
  
  var json_text = ContentService.createTextOutput(JSON.stringify(ret_obj)).setMimeType(ContentService.MimeType.JSON); 
  return json_text
}