var GS_BASE_URL = "https://www.googleapis.com/upload/storage/v1"
var MIME_MP3 = "audio/mp3"

function xxg() {
  var a = get_accesstoken(secret.audiolib_client_id, secret.audiolib_client_secret, secret.audiolib_refresh_token)
  Logger.log(a)
  return 
  var file_id = "1yh8uDEGzeZus-YBal2pWBYSQSRXcbR6M"
  var bucket_name = "audiolib-production"
  drive_to_gs(file_id, bucket_name)
}

function drive_to_gs(file_id, bucket_name) {  
  var file = DriveApp.getFileById(file_id)
  var filename = file.getName()
  var bytes = file.getBlob().getBytes()
  
  var uri = GS_BASE_URL + "/b/" + bucket_name + "/o?uploadType=media&name=" + filename + "&key=" + secret.google_api_key
  
  var headers = {
    "x-goog-project-id": "58736245657"
  }

  var payload = {
  }  
  
  var options = {
    "payload":bytes,
//    "headers":headers,
    "contentType":MIME_MP3,
    "contentLength":bytes.length,
    "muteHttpExceptions": false    
  }

  var r = httplib.httpretry(uri, options)
  var j = JSON.parse(r)
  
  Logger.log(j)  
}


function get_accesstoken(client_id, client_secret, refresh_token) {
  var url = "https://www.googleapis.com/oauth2/v4/token"

  var payload = {
    "client_id":client_id,
    "client_secret":client_secret,
    "refresh_token":refresh_token,
    "grant_type": refresh_token
  }
  
  var options = {
    "payload":payload  
  }

  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  Logger.log(j)
  
  return j
}