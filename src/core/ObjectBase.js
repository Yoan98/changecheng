import { Vector3 } from '../math/Vector3.js'
import { Matrix4 } from '../math/Matrix4.js'
import { Quaternion } from '../math/Quaternion.js'

const _q1 = new Quaternion()

const _xAxis = new Vector3(1, 0, 0)
const _yAxis = new Vector3(0, 1, 0)
const _zAxis = new Vector3(0, 0, 1)
class ObjectBase {
  constructor() {
    this.children = []

    // 通过改变这三个属性移动物体，再调用updateMatrix更新成矩阵
    this.position = new Vector3(0, 0, 0)
    this.quaternion = new Quaternion()
    this.scale = new Vector3(1, 1, 1)

    // 计算视图矩阵的观察目标点位与向上朝向
    this.target = new Vector3(0, 0, 0)
    this.up = new Vector3(0, 1, 0)

    this.modelMatrix = new Matrix4()
  }

  add(object) {
    this.children.push(object)
  }

  updateMatrix() {
    this.modelMatrix.compose(this.position, this.quaternion, this.scale)
  }

  rotateOnAxis(axis, angle, isReset = true) {
    // rotate object on axis in object space
    // axis is assumed to be normalized

    _q1.setFromAxisAngle(axis, angle)

    if (isReset) {
      this.quaternion.copy(_q1)
    } else {
      this.quaternion.multiply(_q1)
    }

    return this
  }

  rotateX(angle) {
    return this.rotateOnAxis(_xAxis, angle)
  }

  rotateY(angle) {
    return this.rotateOnAxis(_yAxis, angle)
  }

  rotateZ(angle) {
    return this.rotateOnAxis(_zAxis, angle)
  }
}

export { ObjectBase }
