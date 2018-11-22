var GS_BASE_URL = "https://www.googleapis.com/storage/v1"
var GS_UPLOAD_URL = "https://www.googleapis.com/upload/storage/v1"
var GST_BASE_URL = "https://storagetransfer.googleapis.com/v1"

var GS_TSV_NAME = "tsv.txt"
var GS_BUCKET_NAME = secret.gs_bucket_name
var GS_PROJECT_ID = secret.gs_project_id

var g_now = new Date()

function get_mime(filename) {
  var ext = filename.match(/([^\.]+$)/g)[0]
  
  return "audio/" + ext
}


function remove_gs(filename) {
  var gs_uri = GS_BASE_URL + "/b/" + GS_BUCKET_NAME + "/o/" + filename

  var headers = {
    "Content-Type": "application/json",
    "Authorization": authlib.get_g_bearerauth()
  }  

  var options = {
    "headers":headers,
    "method":"delete",
    "muteHttpExceptions": false 
  }

  var r = httplib.httpretry(gs_uri, options)
  
  if(r == "") {
    return true  
  } else {
    return false 
  }
}


function get_filename(uri) {
  var filename = uri.match(/([^\/]+$)/g)[0]
  validate_filename(filename)
  
  return filename  
}


function gs_upload_binary(body, filename, mime) {
  var parameters = "/o?uploadType=media&predefinedAcl=publicRead&name=" + filename
  var gs_uri = GS_UPLOAD_URL + "/b/" + GS_BUCKET_NAME + parameters

  var headers = {
    "Authorization":authlib.get_g_bearerauth()
  }  
  
  if(mime == undefined) {
    mime = get_mime(filename)
  }

  var options = {
    "payload":body,
    "headers":headers,
    "contentType":mime,
    "contentLength":body.length,
    "muteHttpExceptions": false    
  }

  var r = httplib.httpretry(gs_uri, options)
  var j = JSON.parse(r)
  
  return j  
}

function gs_upload(uri) {  
  var filename = get_filename(uri)
  
  var r = httplib.httpretry(uri)
  var bytes = r.getBlob().getBytes()
  
  // default to public read
  var j = gs_upload_binary(bytes, filename)
  return j
}


function get_gs_uri(bucket, name) {
  var gs_uri = "gs://" + bucket + "/" + name
  
  return gs_uri
}


function set_new_folder(new_folder_id, child_id) {
  var old_folder = DriveApp.getFolderById("root")
  var child = DriveApp.getFileById(child_id)
  old_folder.removeFile(child)
  
  var new_folder = DriveApp.getFolderById(new_folder_id)
  var folder = new_folder.addFile(child)
  
  return folder
}


function drive_upload(uri) {  
  var blob = UrlFetchApp.fetch(uri).getBlob();
  var file = DriveApp.createFile(blob)
  var filename = get_filename(uri)
  file.setName(filename)
  
  var id = file.getId()
  set_new_folder(secret.mp3_folder_id, id)

  return id
}

function drive_upload_blob(body) {
  var blob = Utilities.newBlob(body).setName("tsv_blob")
  var file = DriveApp.createFile(blob)

  var id = file.getId()
  set_new_folder(secret.mp3_folder_id, id)

  return "https://drive.google.com/uc?export=download&id=" + id
}

function get_md5(file_id) {
  var file = Drive.Files.get(file_id)
  
  return file.md5Checksum
}


function get_scheduled_time(delta_seconds) {
  var now = new Date()
  now.setHours(now.getHours() - 8)
  now.setSeconds(now.getSeconds() + delta_seconds)
  var hours = now.getHours()
  var minutes = now.getMinutes()
  var seconds = now.getSeconds()
  var nanos = 0
  
  var r = {
    hours:hours,
    minutes:minutes,
//    seconds:seconds,
//    nanos:nanos
  }
  
  return r
}


function get_scheduled_date() {
  var now = new Date()
  var year = now.getUTCFullYear()
  var month = now.getUTCMonth()+1
  var day = now.getUTCDate()
  
  var r = {
    year:year,
    month:month,
    day:day
  }
  
  return r 
}


function get_tsv_fr_output(outputs) {
  var lines = []
  var header = "TsvHttpData-1.0"
  lines.push(header)
  
  for(var i in outputs) {
    var output = outputs[i]
    var uri = output.uri
    var size = output.size
    var md5 = output.checksum
    var line = get_tsv(uri, size, md5)
    lines.push(line)
  }
  
  var body = lines.join("\n")
  
  return body
}


function hex_to_bytes(hex) {
  var bytes = []
  for(var i=0; i< hex.length-1; i+=2){
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }  
  
  return bytes
}

function md5hex_to_b64(md5hex) {
  var bytes = hex_to_bytes(md5hex)
  var b64 = [];
  
  for (var i = 0; i < bytes.length; i++) {
    b64.push(bytes[i]<128?bytes[i]:bytes[i]-256)
  }
  return Utilities.base64Encode(b64)
}


function get_tsv(uri, size, md5) {
  if(md5[md5.length-1] != "=") {
    var b64_md5 = md5hex_to_b64(md5)
  } else {
    var b64_md5 = md5    
  }
  
  var line = uri + "\t" + size + "\t" + b64_md5
    
  return line
}


function gst_works(outputs) {  
  var gst = send_gst_works(outputs)
  httplib.printc("send_gst_works(): %s", JSON.stringify(gst))
  var name = gst.name
  var polling = polling_gst_work(name)
  httplib.printc("polling_gst_work(): %s", JSON.stringify(polling))
  gs_move_files_root()
  
  return polling
}


function gs_clean_folder() {
    
}


function is_occ_file(filename) {
  var test = /www.*\/.*flac/.test(filename)  
  return test
}


function gs_move_files_root() {
  var url = Utilities.formatString("%s/b/%s/o", GS_BASE_URL, GS_BUCKET_NAME)
  var t = httplib.httpretry(url, get_gs_options("GET"))
  var items = JSON.parse(t).items

  for(var i in items) {
    var item = items[i]
    var name = item.name
    if(is_occ_file(name)) {
      gs_copy_to_root(name)
      gs_delete(name)
      var filename = get_filename(name)
      httplib.printc("moved to root: %s", filename)
    }   
  }
}


function gs_delete(name) {
  var url = Utilities.formatString("https://www.googleapis.com/storage/v1/b/%s/o/%s", 
                                   GS_BUCKET_NAME,
                                   encodeURIComponent(name))

  var t = httplib.httpretry(url, get_gs_options("DELETE"))
  if(t == "") {
    return true  
  } else {
    return false 
  }
}


function get_gs_options(method, payload) {
  var headers = {
    "Content-Type": "application/json",
    "Authorization": get_serviceaccount_bearer()
  }    

  
  var options = {
    "headers":headers,
    "muteHttpExceptions": false,
    "method":method
  }
  
  if(payload) {
    options.payload = JSON.stringify(payload)
  }
  
  return options
}


function gs_copy_to_root(src) {
  var dest = get_filename(src)
  var url = Utilities.formatString("https://www.googleapis.com/storage/v1/b/%s/o/%s/copyTo/b/%s/o/%s", 
                                   GS_BUCKET_NAME,
                                   encodeURIComponent(src),
                                   GS_BUCKET_NAME,
                                   dest)
  


  var t = httplib.httpretry(url, get_gs_options("POST"))
  var j = JSON.parse(t)
  
  return j
}


function send_gst_works(outputs) {
  var tsv = get_tsv_fr_output(outputs)
  httplib.printc("%s", tsv)
  
  var gs = gs_upload_binary(tsv, GS_TSV_NAME, "text/plain")
  var listUrl = get_gs_uri(gs.bucket, gs.name)
  var url = GST_BASE_URL + "/" + "transferJobs"
    
  var transferSpec = {
//    "objectConditions": {
//      "minTimeElapsedSinceLastModification":"0s",
//      "maxTimeElapsedSinceLastModification":"604800s"
//    },    
    "transferOptions":{
      "overwriteObjectsAlreadyExistingInSink":true,
      "deleteObjectsFromSourceAfterTransfer":false
    },
    "httpDataSource":{
      "listUrl":listUrl
    },
    "gcsDataSink":{
      "bucketName":GS_BUCKET_NAME
    }
  }
  
  var current_date = get_scheduled_date()
  
  var schedule = {
    "scheduleStartDate":current_date,
    "scheduleEndDate":current_date,
//    "startTimeOfDay":get_scheduled_time(30)
  }

  var description = Utilities.formatDate(new Date(), "GMT+8", "HH:mm:ss")
  var payload = {
    "projectId":GS_PROJECT_ID,
    "description":description,
    "status":"ENABLED",
    "transferSpec":transferSpec,
    "schedule":schedule
  }

  var t = httplib.httpretry(url, get_gs_options("POST", payload))
  var j = JSON.parse(t)

  return j
}


var MAX_COMPUTE_TIME = 6 * 60 - 30

function polling_gst_work(name) {
  var filter = {"job_names":[name], "project_id":GS_PROJECT_ID}
  var filter_encoded = encodeURIComponent(JSON.stringify(filter))
  var url = Utilities.formatString("%s/transferOperations?filter=%s", GST_BASE_URL, filter_encoded)
  var start_time = new Date()
    
  while(true) {
    var t = httplib.httpretry(url, get_gs_options("GET"))
    var j = JSON.parse(t)
    
    if(j.hasOwnProperty("operations")) {      
      var done = j.operations[0].done  
      if(done) {
        remove_gs(GS_TSV_NAME)
        return j
      }
    }
    
    Utilities.sleep(2*1000) 
    var duration_s = Math.round((new Date() - g_now)/1000)
    
    if((duration_s % 10) == 0) {
      httplib.printc("polling_gst_work(): waiting")
    }
    
    if(duration_s > MAX_COMPUTE_TIME) {
      return undefined  
    }    
  }
}


function get_jwt() {
  var header = {"alg":"RS256","typ":"JWT"}
  var b64_header = Utilities.base64EncodeWebSafe(JSON.stringify(header))
  
  var iss = secret.audiolib_serviceaccount.iss
  var scope = "https://www.googleapis.com/auth/cloud-platform"
  var aud = "https://www.googleapis.com/oauth2/v4/token"
  var iat = Math.round((new Date).getTime()/1000)
  var exp = new Date()
  exp.setMinutes(exp.getMinutes() + 60)
  exp = Math.round((exp.getTime()/1000))
  
  var claim = { 
    "iss":iss,
    "sub":iss,
    "scope":scope,
    "aud":aud,
    "exp":exp,
    "iat":iat
  }
  
  var b64_claim = Utilities.base64EncodeWebSafe(JSON.stringify(claim))  
  var signature_input = b64_header + "." + b64_claim
  var key = secret.audiolib_serviceaccount.key
  
  var signature = Utilities.computeRsaSha256Signature(signature_input, key)
  var b64_signature = Utilities.base64EncodeWebSafe(signature)
  var jwt = signature_input + "." + b64_signature

  return jwt  
}


function get_serviceaccount_bearer() {
  return "Bearer " + get_serviceaccount_accesstoken()
}


function get_serviceaccount_accesstoken() {
  var payload = {
    "grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer",
    "assertion":get_jwt(),    
  }
  
  var options = {
    "method":"post",
    "payload":payload
  }
  
  var url = "https://www.googleapis.com/oauth2/v4/token"
  
  var r = httplib.httpretry(url, options)
  
  var j = JSON.parse(r)
  
  return j.access_token
}


function check_file_exist(name) {
  var url = Utilities.formatString("%s/b/%s/o/%s", GS_BASE_URL, GS_BUCKET_NAME, name)

  var t = httplib.httpretry(url, get_gs_options("GET"), false)
  var j = JSON.parse(t)
  
  if(j.hasOwnProperty("error")) {
    return false
  } else {
    return true 
  }
}