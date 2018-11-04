var STT_BASE_URL = "https://speech.googleapis.com/"

function xx() {
  var mp3_id = "1EkcXAa_iTcsV7L2MiQBM2g7m5qF3I6F1"
  var r = longrunningrecognize(mp3_id)
  
  Logger.log(r)
}

function longrunningrecognize(mp3_id) {
  var uri = "https://drive.google.com/uc?export=download&id=" + mp3_id
  
  var headers = {
    "Content-Type": "application/json",
  }

  var payload = {
    "audio": {
      "uri": uri
    },
    "config": {
      "enableAutomaticPunctuation": true,
      "encoding": "LINEAR16",
      "languageCode": "cmn-Hant-TW",
      "model": "default"
    }
  }  
  
  var options = {
    "payload":JSON.stringify(payload),
    "headers":headers,
    "muteHttpExceptions": false    
  }
  
  var url = STT_BASE_URL + "/v1/speech:longrunningrecognize?key=" + secret.google_api_key
      
  var r = httplib.httpretry(url, options)
  Logger.log(r)
  var j = JSON.parse(r)
  Logger.log(j)
  return j
  
}
