//note: keys reborn at 8am
var MAX_DAILY = 30
var OCC_BASE_URL = "https://api2.online-convert.com"
var DEFAULT_TARGETS = ["flac", "mp3"]
var DEFAULT_FREQ = 44100
var OCC_MAX_SIZE = 100*1024*1024 // 100M


var headers = {
  "Content-Type": "application/json",
  "X-Oc-Api-Key": undefined,
  "Cache-Control": "no-cache"
}  




function upload_mp3s(outputs) {
  for(var i in outputs) {
    var output = outputs[i]
    var type = output.output_type
    
    if(type.indexOf("mp3") > -1) {
      var uri = output.output_uri
      drive_upload(uri)
    }    
  }
}


function get_id_fr_files(files) {
  var ids = []

  for(var i in files) {
    ids.push(files[i].getId())  
  }
  
  return ids
}


function get_id_fr_inputs(input_id, inputs) {
  for(var i in inputs) {
    var input = inputs[i]
    
    if(input.id == input_id) {
      var source_id = input.source.match(/id=(.*)/)[1]
      
      return source_id
    }
  }
}


function get_mp3_drive_id(input_id, id_to_mp3s) {
  for(var i in id_to_mp3s) {
    var id = id_to_mp3s[i].id
    if(id == input_id) {
      return id_to_mp3s[i].mp3_drive_id
    }
  } 
  
  return undefined
}


function inject_mp3_drive_id(return_outputs, id_to_mp3s) {
  for(var i in return_outputs) {
    var input_id = return_outputs[i].source.input[0]
    return_outputs[i].mp3_drive_id = get_mp3_drive_id(input_id, id_to_mp3s)
  }
  
  return return_outputs
}


function polling_occ_work(job_id) {
  while(true) {
    Utilities.sleep(1*1000) 

    var raw_output = query_occ_work(job_id) 
    var code = raw_output.status.code
    
    if(code == "completed") {
      var return_outputs = []
      var outputs = raw_output.output
      var id_to_mp3s = []
      
      for(var i in outputs) {
        var output = outputs[i]
        var filename = get_filename(output.uri)
        var type = output.content_type
        
        if(type.indexOf("mp3") > -1) {
          var id_to_mp3 = {
            "id":undefined,
            "mp3_drive_id":undefined
          }
          var mp3_drive_id = drive_upload(output.uri)
          id_to_mp3.id = output.source.input[0]
          id_to_mp3.mp3_drive_id = mp3_drive_id
          id_to_mp3s.push(id_to_mp3)
          
          httplib.printc("[%s] uploaded: %s", filename, mp3_drive_id)
        } else if(type.indexOf("flac") > -1) {
          var input_id = output.source.input[0]
          var inputs = raw_output.input
          var wma_drive_id = get_id_fr_inputs(input_id, inputs)

          // only one input: oversized wma, just do stt
          if((output.size >= STT_MEMORY_SIZE) && (inputs.length > 1)) {
            httplib.printc("[%s] size over: %d", filename, output.size)      
            move_oversized(wma_drive_id)
//            return_outputs.push(undefined)          
          } else {
            output.wma_drive_id = wma_drive_id
            return_outputs.push(output)          
          }
        }
      }
      
      return_outputs = inject_mp3_drive_id(return_outputs, id_to_mp3s)
        
      return return_outputs
    } else {
      httplib.printc("polling_occ_work(): %s", code)
    }
  }  
}


function query_occ_work(job_id) {
  var url = OCC_BASE_URL + "/jobs/" + job_id
  var options = {
    "headers":headers
  }
  
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}


function get_conversions(targets) {
  var conversions = []
  
  for(var i in targets) {
    var conversion = {
      "target": targets[i],
      "options": {
        "channels": "mono",
        "allow_multiple_outputs":true,
      }
    }
    
    conversions.push(conversion)
  }
    
  return conversions
}


function get_config_payload(source_ids, targets) {
  var inputs = []
  
  for(var i in source_ids) {
    var source = "https://drive.google.com/uc?export=download&id=" + source_ids[i]
    var input = {
      "type": "remote",
      "source": source}
    
    inputs.push(input)
  }
  
  var payload = {
    "input": inputs,
    "conversion": get_conversions(targets)
  }

  return payload
}


function occ_works(source_ids) {
  if(source_ids.length > 0) {
    var work = send_occ_work(source_ids)
//    httplib.printc("%s", JSON.stringify(work))
    var id = work.id
    var outputs = polling_occ_work(id)
    
    return outputs
  }
}


function send_occ_work(source_ids) {
  var payload = get_config_payload(source_ids, DEFAULT_TARGETS)  

  var options = {
    "payload": JSON.stringify(payload),
    "headers": headers
  }
  
  var url = OCC_BASE_URL + "/jobs"
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
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


function reached_daily_max(key) {
  var key_minutes = get_key_status(key)
  var one_batch_minutes = 5
  
  if((key_minutes + one_batch_minutes) >= MAX_DAILY) {
    return true  
  } else {
    return false  
  }
}


function get_minutes(output) {
  if(output == "") {
    return 0
  }
  
  var jobs = JSON.parse(output)  
  
  var key_minutes = 0
  
  for(var i2 in jobs) {
    var job = jobs[i2]
    key_minutes = key_minutes + parseInt(job.conversion_minutes) * parseInt(job.completed_jobs)
  }
  
  return key_minutes
}


function get_key_status(key) {
  var date_str = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd")
  var url = OCC_BASE_URL + "/stats/day/" + date_str + "/single"
  
  headers["X-Oc-Api-Key"] = key
  var options = {
    "headers":headers
  }
   
  var r = httplib.httpretry(url, options)

  return get_minutes(r)
}


function get_available_minutes() {
  var total_minutes = 0
  
  for(var i in secret.occ_keys) {
    var key = secret.occ_keys[i]

    var key_minutes = get_key_status(key)

    total_minutes = total_minutes + key_minutes
    httplib.printc("[%02d-%02d-%02d] %s", (parseInt(i) + 1), key_minutes, ((30-key_minutes)<0)?0:(30-key_minutes), key)
  }
  
  var available_minutes = secret.occ_keys.length * 30 - total_minutes
  httplib.printc("quota: %d, available: %d", (secret.occ_keys.length * 30), available_minutes)
  
  return available_minutes
}  