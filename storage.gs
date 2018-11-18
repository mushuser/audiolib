var GS_BASE_URL = "https://www.googleapis.com/storage/v1"
var GS_UPLOAD_URL = "https://www.googleapis.com/upload/storage/v1"
var GST_BASE_URL = "https://storagetransfer.googleapis.com/v1"

var BUCKET_NAME = "audiolib-cs"


function get_mime(filename) {
  var ext = filename.match(/([^\.]+$)/g)[0]
  
  return "audio/" + ext
}


function remove_gs(filename) {
  var gs_uri = GS_BASE_URL + "/b/" + BUCKET_NAME + "/o/" + filename

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
  return filename  
}

function gs_upload(uri) {  
  var filename = get_filename(uri)
  var r = httplib.httpretry(uri)
  var bytes = r.getBlob().getBytes()  
  var gs_uri = GS_UPLOAD_URL + "/b/" + BUCKET_NAME + "/o?uploadType=media&name=" + filename

  var headers = {
    "Authorization":authlib.get_g_bearerauth()
  }  

  var options = {
    "payload":bytes,
    "headers":headers,
    "contentType":get_mime(filename),
    "contentLength":bytes.length,
    "muteHttpExceptions": false    
  }

  var r = httplib.httpretry(gs_uri, options)
  var j = JSON.parse(r)
  
  return j
}


function get_gs_uri(json) {
  var gs_uri = "gs://" + json.bucket + "/" + json.name
  
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

  return get_downloadurl(file)
}

function get_md5(file_id) {
  var file = Drive.Files.get(file_id)
  
  return file.md5Checksum
}


function get_tsv(ids) {
  var header = "TsvHttpData-1.0"
  
  var body = header + "\n"
  
  for(var i in ids) {
    var id = ids[i]
    var file = DriveApp.getFileById(id)
    var url = get_downloadurl(file)
    var length = file.getSize()
    var md5 = get_md5(id)
    
    var line = url + "\t" + length + "\t" + md5 + "\n"
    
    body = body + line
  }
  
  return body
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
  var year = now.getFullYear()
  var month = now.getMonth()+1
  var day = now.getDate()
  
  var r = {
    year:year,
    month:month,
    day:day
  }
  
  return r 
}


function gst_works(ids) {
  ids = ["1RSmMxbL5kQAX_irkmA2SRD4s9-CBZAu-", "1H-pQ0kCo84W2G1wwASqUnoSAONkGkUPC"]
  var body = get_tsv(ids)
  var listUrl = drive_upload_blob(body)
  var listUrl = "https://storage.googleapis.com/audiolib-cs/tsv_blob.txt"
  var url = GST_BASE_URL + "/" + "transferJobs"// + "?key=" + "AIzaSyA7KZ08H9GXv1jPvcHPt1kVdqkKwDSnss8" 
  
  var headers = {
    "Content-Type": "application/json",
    "Authorization": get_serviceaccount_bearer()
  }  
  
  var transferSpec = {
    "objectConditions": {
      "minTimeElapsedSinceLastModification":"0s",
      "maxTimeElapsedSinceLastModification":"604800s"
    },    
    "transferOptions":{
      "overwriteObjectsAlreadyExistingInSink":true,
      "deleteObjectsFromSourceAfterTransfer":false
    },
    "httpDataSource":{
      "listUrl":listUrl
    },
    "gcsDataSink":{
      "bucketName":BUCKET_NAME
    }
  }
  
  var current_date = get_scheduled_date()
  
  var schedule = {
    "scheduleStartDate":current_date,
    "scheduleEndDate":current_date,
    "startTimeOfDay":get_scheduled_time(30)
  }
  
  
  var payload = {
    "projectId":"project-id-8464513615628612722",
    "description":ids.join(","),
    "status":"ENABLED",
    "transferSpec":transferSpec,
    "schedule":schedule
  }

  
  Logger.log(headers)
  Logger.log(payload)
 
  var options = {
    "payload":JSON.stringify(payload),
    "headers":(headers),
    "method":"POST",
    "muteHttpExceptions": false 
  }

  var r = httplib.httpretry(url, options)
  

  Logger.log(r)
}


function get_jwt() {
//  var header = {"alg":"RS256","typ":"JWT","kid":secret.audiolib_serviceaccount.kid}
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