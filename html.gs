function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

var PAGE_SIZE = 10000

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
  
  return results
}