var STT_BASE_URL = "https://speech.googleapis.com/"
var STT_MAX_SIZE = 51000*60*60 // flac 51000bytes/second, 60minutes for 175M


function stt_works(occ_outputs, files) {
  var result_lines = []
  
  for(var i in occ_outputs) {
    var occ_output = occ_outputs[i]
    if(occ_output == undefined) {
      lines.push(undefined)
      continue  
    }
    
    var uri = occ_output.uri
    var gs = gs_upload(uri)
    var gs_filename = gs.name
        
    var gs_uri = get_gs_uri(gs)    
//    httplib.printc("uri_to_gs(): %s", gs_uri)    

    var name = sst_longrunningrecognize(gs_uri).name
    var stt = polling_stt_work(name)
    remove_gs(gs_filename)

    var line = get_line(stt)
    result_lines.push(line)
    
    httplib.printc("[%s] %s", gs_filename, line) 

    var file = files[i]
    file.setDescription(line)
    move_completed(file)    
  }
  
  return result_lines
}


function polling_stt_work(name) { 
  while(true) {
    Utilities.sleep(2*1000) 
    
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


function get_line(results) {
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