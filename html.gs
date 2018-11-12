function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
  // serve json objs, github.io host js files
  // get or post, get: this html, post: api for github.io
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
    var download_url = file.getDownloadUrl().replace("&gd=true","")
    
    var result = {
      desc: desc,
      url: url,
      download_url: download_url,
      size: size,
      filename: filename,
      id: id
    }
    
    results.push(result)
  }
  
  return sort_mp3s(results)
}