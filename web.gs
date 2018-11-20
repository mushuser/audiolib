var PAGE_SIZE = 10000

function doPost(e) {
  var action = e.parameter.action
  
  if(action == "set_starred") {
    var id = e.parameter.id
    var starred = e.parameter.starred
    set_starred(id, starred)
    return get_json({result:"ok"})
  } else if(action == "get") {
    var date = e.parameter.date
    var r = get_mp3s_by_date(date)
    return get_json(r)
  } else {
    var r = get_mp3s_by_date()
    return get_json(r)
  }
}


function get_json(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);     
}


function sort_mp3s(results) {
  var new_results = results.sort(function(a, b) {
    var nameA = a.filename.toUpperCase(); // ignore upper and lowercase
    var nameB = b.filename.toUpperCase(); // ignore upper and lowercase
    
    if (nameA > nameB) {
      return -1;
    }
    
    if (nameA < nameB) {
      return 1;
    }
    
    return 0;
  })

  return new_results
}


function get_datestr(filename) {
  return filename.match(/([^_]*)/)[0] 
}


function get_timestr(filename) {
  return filename.match(/_(.*)_/)[1] 
}


function get_seq(filename) {
  return filename.match(/([^_]*)\./)[1] 
}


function get_mp3s_by_date(datestr) {
  var r = get_mp3s()
  
  if(datestr == undefined) {
    return r
  }
  
  var files = r.files
  var dates = r.dates
  
  var return_files = []
  
  for(var i in files) {
    var file = files[i]
    var filename = file.filename
    var str = get_datestr(filename)
    if(str == datestr) {
      return_files.push(file)  
    }
  }
  
  var j = {
    files: return_files,
    dates: dates
  }
  
  return j
}


function set_starred(file_id, starred) {
  if(starred == "true") {
    starred = true
  } else if(starred == "false") {
    starred = false   
  }
  var file = DriveApp.getFileById(file_id)
  file.setStarred(starred)
  var name = file.getName()
  httplib.printc("set_starred(): name: %s, id: %s, starred: %s", name, file_id, starred)
}


function get_downloadurl(id) {
  var url = "https://drive.google.com/uc?export=download&id=" + id
  
  return url
}


function validate_filename(filename) {
  // 20180425_1920_0045.mp3
  var t = /\d{8}_\d{4}_\d{4}\.\w{3}/.test(filename)
  if(t == false) {
    throw "validate_filename() failed"    
  }
  
  return t
}


function get_mp3s() {
  var folder = DriveApp.getFolderById(secret.mp3_folder_id)
  var files = folder.getFiles()
  var results = []
  var dates = []
  
  while (files.hasNext()) {
    if(results.length == PAGE_SIZE) {
      return results  
    }
    
    var file = files.next()
    var filename = file.getName()
    validate_filename(filename)
    
    var ext = get_filename_ext(filename)
    if(ext != "mp3") {
      continue  
    }
    var desc = file.getDescription()
    var size = file.getSize()
    var id = file.getId()
    var url = file.getUrl()
    var starred = file.isStarred()
    var date = get_datestr(filename)
    dates.push(date)
    var time = get_timestr(filename)
    var seq = get_seq(filename)
    var download_url = get_downloadurl(id)
    
    var result = {
      desc: desc,
      url: url,
      download_url: download_url,
      size: size,
      filename: filename,
      id: id,
      starred: starred,
      date: date,
      time: time,
      seq: seq
    }
    
    results.push(result)
  }
  
  var sorted = sort_mp3s(results)
  dates = httplib.get_unique(dates)
  
  var r = {
    files: sorted,
    dates: dates.sort()
  }
  
  return r 
}