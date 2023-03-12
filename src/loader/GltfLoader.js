import { Mesh } from '../core/Mesh'
class GltfLoader {
  constructor() {}

  load(fileUrl) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.responseType = 'arraybuffer'

      request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status !== 404) {
          const meshs = this.parse(request.response)

          resolve(meshs)
        }
      }
      request.open('GET', fileUrl, true) // Create a request to acquire the file
      request.send()
    })
  }

  // 还差贴图读取与转换
  parse(arrayBuffer) {
    const { body: buffer, content } = new GLTFBinaryParse(arrayBuffer)

    const json = JSON.parse(content)

    console.log(json)

    const meshs = json.meshes.map((mesh) => {
      const positionIndex = mesh.primitives[0].attributes.POSITION
      const normalIndex = mesh.primitives[0].attributes.NORMAL
      const indicesIndex = mesh.primitives[0].indices

      const positionAccessors = json.accessors[positionIndex]
      const normalAccessors = json.accessors[normalIndex]
      const indicesAccessors = json.accessors[indicesIndex]

      const positionBufferInfo = json.bufferViews[positionAccessors.bufferView]
      const normalBufferInfo = json.bufferViews[normalAccessors.bufferView]
      const indicesBufferInfo = json.bufferViews[indicesAccessors.bufferView]

      const positionBuffer = buffer.slice(
        positionBufferInfo.byteOffset,
        positionBufferInfo.byteOffset + positionBufferInfo.byteLength
      )
      const normalBuffer = buffer.slice(
        normalBufferInfo.byteOffset,
        normalBufferInfo.byteOffset + normalBufferInfo.byteLength
      )
      const indicesBuffer = buffer.slice(
        indicesBufferInfo.byteOffset,
        indicesBufferInfo.byteOffset + indicesBufferInfo.byteLength
      )

      console.log(positionBufferInfo)

      const selfMesh = new Mesh({
        indices: indicesBuffer,
        vertices: positionBuffer,
        normals: normalBuffer,
        uvs: [],
      })

      return selfMesh
    })
    return meshs
  }
}

const BINARY_EXTENSION_HEADER_MAGIC = 'glTF'
const BINARY_EXTENSION_HEADER_LENGTH = 12
const BINARY_EXTENSION_CHUNK_TYPES = {
  JSON: 0x4e4f534a,
  BIN: 0x004e4942,
}

class GLTFBinaryParse {
  constructor(data) {
    this.textDecoder = new TextDecoder()
    this.content = null
    this.body = null
    const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH)
    this.header = {
      magic: this.textDecoder.decode(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true),
    }

    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error('Unsupported glTF-Binary header.')
    } else if (this.header.version < 2.0) {
      throw new Error('Legacy binary file detected.')
    }

    const chunkContentsLength =
      this.header.length - BINARY_EXTENSION_HEADER_LENGTH
    const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH)
    let chunkIndex = 0

    while (chunkIndex < chunkContentsLength) {
      const chunkLength = chunkView.getUint32(chunkIndex, true)
      chunkIndex += 4
      const chunkType = chunkView.getUint32(chunkIndex, true)
      chunkIndex += 4

      if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        const contentArray = new Uint8Array(
          data,
          BINARY_EXTENSION_HEADER_LENGTH + chunkIndex,
          chunkLength
        )
        this.content = this.textDecoder.decode(contentArray)
      } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex
        this.body = data.slice(byteOffset, byteOffset + chunkLength)
      } // Clients must ignore chunks with unknown types.

      chunkIndex += chunkLength
    }

    if (this.content === null) {
      throw new Error('GLTFLoader: JSON content not found.')
    }
  }
}
export { GltfLoader }
