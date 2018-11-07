var GS_BASE_URL = "https://www.googleapis.com/storage/v1"
var GS_UPLOAD_URL = "https://www.googleapis.com/upload/storage/v1"

var MIME_FLAC = "audio/flac"
var BUCKET_NAME = "audiolib-storage"


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


function gs_upload(uri) {  
  var filename = uri.match(/([^\/]+$)/g)[0]
  var r = httplib.httpretry(uri)
  var bytes = r.getBlob().getBytes()  
  var gs_uri = GS_UPLOAD_URL + "/b/" + BUCKET_NAME + "/o?uploadType=media&name=" + filename

  var headers = {
    "Authorization":authlib.get_g_bearerauth()
  }  

  var options = {
    "payload":bytes,
    "headers":headers,
    "contentType":MIME_FLAC,
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