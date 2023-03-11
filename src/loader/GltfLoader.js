class GltfLoader {
  constructor() {}

  load(fileUrl) {
    var request = new XMLHttpRequest()
    request.responseType = 'arraybuffer'

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status !== 404) {
        console.log(request)
        this.parse(request.response)
      }
    }
    request.open('GET', fileUrl, true) // Create a request to acquire the file
    request.send()
  }

  parse(arrayBuffer) {
    const GLTF_HEADER_BYTE = 12
    const textDecoder = new TextDecoder()

    const magicAB = arrayBuffer.slice(0, 4)
    const versionAB = arrayBuffer.slice(4, 8)
    const lengthAB = arrayBuffer.slice(12, 16)

    console.log(textDecoder.decode(lengthAB))

    // console.log(view)
    // console.log(buffer)
    // console.log(magic)
  }
}

export { GltfLoader }
