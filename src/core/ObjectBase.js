import { Vector3 } from '../math/Vector3.js'
import { Matrix4 } from '../math/Matrix4.js'
import { Quaternion } from '../math/Quaternion.js'
class ObjectBase {
  constructor() {
    this.children = []

    // 通过改变这三个属性移动物体，再调用updateMatrix更新成矩阵
    this.position = new Vector3(0, 0, 0)
    this.quaternion = new Quaternion()
    this.scale = new Vector3(1, 1, 1)

    this.modelMatrix = new Matrix4()

    this.updateMatrix()
  }

  add(object) {
    this.children.push(object)
  }

  updateMatrix() {
    this.modelMatrix.compose(this.position, this.quaternion, this.scale)
  }
}

export { ObjectBase }
