//note: keys reborn at 8am
var MAX_DAILY = 30
var OCC_BASE_URL = "https://api2.online-convert.com"
var DEFAULT_TARGET = "flac"
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


function polling_occ_work(job_id, files) {
  while(true) {
    Utilities.sleep(1*1000) 
    var r = query_work(job_id)
    var code = r.status.code
    
    if(code == "completed") {
      var outputs = []
      for(var i in r.output) {
        var output = r.output[i]
        var filename = files[i].getName()
        httplib.printc("[%s] %s", filename, JSON.stringify(output))
        
        var size = output.size
        
        if(size >= STT_MEMORY_SIZE) {
          var file = files[i]
          var filename = get_filename_gs(output.uri)
          httplib.printc("polling_occ_work(): size over: %d, %s", size, filename)
          move_oversized(file)
          
          outputs.push(undefined)          
        } else {
          outputs.push(output)          
        }
      }
      return outputs
    } else {
      httplib.printc("polling_occ_work() status: %s", code)
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


function get_config_payload(source_ids, target) {
  var inputs = []

  var conversion = {
    "target": (target == undefined)?DEFAULT_TARGET:target,
    "options": {
      "channels": "mono",
      "allow_multiple_outputs":true
    }
  }
  
  for(var i in source_ids) {
    var source = "https://drive.google.com/uc?export=download&id=" + source_ids[i]
    var input = {
      "type": "remote",
      "source": source}
    
    inputs.push(input)
  }
  
  var payload = {
    "input": (inputs),
    "conversion": ([conversion])
  }

  return payload
}


function occ_works(source_ids, files) {
  if(source_ids.length > 0) {
    var work = send_occ_work(source_ids)
    var id = work.id
    var outputs = polling_occ_work(id, files)
    
    return outputs
  }
}


function send_occ_work(source_ids) {
  var payload = get_config_payload(source_ids)  

  var options = {
    "payload": JSON.stringify(payload),
    "headers": headers
  }
  
  var url = OCC_BASE_URL + "/jobs"
  var r = httplib.httpretry(url, options)
  var j = JSON.parse(r)
  
  return j
}

// unknown bug here
function reached_daily_max(key) {
  var t = get_key_status(key)
  
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


function get_key_status(key) {
  var date_str = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd")
  var url = OCC_BASE_URL + "/stats/day/" + date_str + "/single"
  
  headers["X-Oc-Api-Key"] = key
  var options = {
    "headers":headers
  }
   
  var r = httplib.httpretry(url, options)

  return r
}


function get_available_minutes() {
  var total_minutes = 0
  
  for(var i in secret.occ_keys) {
    var key = secret.occ_keys[i]

    var t = get_key_status(key)
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
    httplib.printc("[%02d-%02d-%02d] %s", (parseInt(i) + 1), key_minutes, (30-key_minutes), key)
  }
  var available_minutes = secret.occ_keys.length * 30 - total_minutes
  httplib.printc("quota: %d, available: %d", (secret.occ_keys.length * 30), available_minutes)
  
  return available_minutes
}  