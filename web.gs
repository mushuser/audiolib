var g_params = {
  datestr: undefined  
}


function doGet(e) {
  if(e.parameter == undefined) {
    g_params.datestr = undefined
  } else {
    g_params.datestr = e.parameter.date
  }
  return HtmlService.createTemplateFromFile('index').evaluate();
}


function doPost() {
  
  
}


var PAGE_SIZE = 10000

function sort_mp3s(results) {
  var new_results = results.sort(function(a, b) {
    var nameA = a.filename.toUpperCase(); // ignore upper and lowercase
    var nameB = b.filename.toUpperCase(); // ignore upper and lowercase
    
    if (nameA < nameB) {
      return -1;
    }
    
    if (nameA > nameB) {
      return 1;
    }
    
    return 0;
  })

  return new_results
}


function get_datestr(filename) {
  return filename.match(/([^_]*)/)[0] 
}


function get_mp3s_by_date() {
  var datestr = g_params.datestr
  var files = get_mp3s()

  
  if(datestr == undefined) {
    return files
  } else {
    var lookfor = datestr
  }
  
  var return_files = []
  
  for(var i in files) {
    var file = files[i]
    var filename = file.filename
    var str = get_datestr(filename)
    if(str == lookfor) {
      return_files.push(file)  
    }
  }
  
  return return_files
}


function set_starred(file_id, starred) {
  var file = DriveApp.getFileById(file_id)
  file.setStarred(starred)
}


function get_mp3s() {
  var folder = DriveApp.getFolderById(secret.mp3_folder_id)
  var files = folder.getFiles()
  var results = []
  
  while (files.hasNext()) {
    if(results.length == PAGE_SIZE) {
      return results  
    }
    
    var file = files.next()
    var desc = file.getDescription()
    var size = file.getSize()
    var filename = file.getName()
    var id = file.getId()
    var url = file.getUrl()
    var starred = file.isStarred()
    var download_url = file.getDownloadUrl().replace("&gd=true","")
    
    var result = {
      desc: desc,
      url: url,
      download_url: download_url,
      size: size,
      filename: filename,
      id: id,
      starred: starred
    }
    
    results.push(result)
  }
  
  return sort_mp3s(results)
}