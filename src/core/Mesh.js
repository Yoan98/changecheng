import { ObjectBase } from './ObjectBase.js'

class Mesh extends ObjectBase {
  constructor() {
    super()

    this.geometry = {}
    this.material = {}
  }

  setGeometryBuffer(
    bufferInfo = {
      indices: [],
      vertices: [],
      normals: [],
      uvs: [],
    }
  ) {
    for (let key in bufferInfo[key]) {
      bufferInfo[key] = new Float32Array(bufferInfo[key])
    }

    this.geometry = bufferInfo
  }
}

export { Mesh }
