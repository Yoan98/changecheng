class GltfLoader {
  constructor() {}

  load(fileUrl) {
    var request = new XMLHttpRequest()

    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status !== 404) {
        console.log(request.responseText)
      }
    }
    request.open('GET', fileUrl, true) // Create a request to acquire the file
    request.send()
  }
}

export { GltfLoader }
