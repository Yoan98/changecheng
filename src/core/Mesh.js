import { ObjectBase } from './ObjectBase.js'

class Mesh extends ObjectBase {
  constructor(geometryInfo) {
    super()

    this.geometry = {}
    this.material = {}

    this.type = 'mesh'

    this.shader = {
      vertex: '',
      fragment: '',
    }

    this.setGeometryBuffer(geometryInfo)
  }

  setGeometryBuffer(
    geometryInfo = {
      indices: [],
      vertices: [],
      normals: [],
      uvs: [],
    }
  ) {
    for (let key in geometryInfo) {
      if (key === 'indices') {
        geometryInfo[key] = new Uint8Array(geometryInfo[key])
      } else {
        geometryInfo[key] = new Float32Array(geometryInfo[key])
      }
    }

    this.geometry = geometryInfo
  }
}

export { Mesh }
