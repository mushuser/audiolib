var STT_BASE_URL = "https://speech.googleapis.com/"
var STT_MAX_SIZE = 51000*60*60 // flac 51000bytes/second, 60minutes for 175M


function polling_stt_work(name) { 
  while(true) {
    Utilities.sleep(15*1000) 
    
    var status = get_status(name)
    var done = status.done
    if(done) {
      var results = status.response.results
      
      return results
    } 
  }  
}


function sst_longrunningrecognize(uri) {
  var access_token = authlib.g_get_accesstoken()
  var bearauth = authlib.get_bearerauth(access_token)
  
  var headers = {
    "Content-Type": "application/json",
    "Authorization": bearauth,
  }

  var payload = {
    "audio": {
      "uri": uri
    },
    "config": {
      "enableAutomaticPunctuation": false,
      "encoding": CONVERSION_TARGET.toUpperCase(),
      //      "sampleRateHertz":44100, //wma:22050
      "languageCode": "cmn-Hant-TW",
      "model": "default"
    }
  }  
  
  var options = {
    "payload":JSON.stringify(payload),
    "headers":headers,
    "muteHttpExceptions": false    
  }
  
  var url = STT_BASE_URL + "/v1/speech:longrunningrecognize"    
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j  
}


function get_status(name) {
  var url = "https://speech.googleapis.com/v1/operations/" + name

  var access_token = authlib.g_get_accesstoken()
  var bearauth = authlib.get_bearerauth(access_token)
  
  var headers = {
    "Content-Type": "application/json",
    "Authorization": bearauth
  }

  var options = {
    "headers":headers,
    "muteHttpExceptions": false    
  }
  
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}


function get_lines(results) {
  var lines = ""
  
  for(var i in results) {
    var result = results[i]
    var alternatives = result.alternatives
    if(alternatives) {
      var transcript = alternatives[0].transcript  
      var lines = lines + transcript + "\n"
    }
  }
  
  if(lines.length == 0) {
    lines = "(無STT內容)"  
  }
  
  return lines
}