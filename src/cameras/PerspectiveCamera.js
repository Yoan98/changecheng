import { ObjectBase } from '../core/ObjectBase'
import { Matrix4 } from '../math/Matrix4.js'
import * as MathUtils from '../math/MathUtils.js'
import { Vector3 } from '../math/Vector3.js'
class PerspectiveCamera extends ObjectBase {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super()

    this.type = 'camera'

    this.fov = fov
    this.zoom = 1

    this.near = near
    this.far = far

    this.aspect = aspect

    // 计算视图矩阵的观察目标点位与向上朝向
    this.target = new Vector3(0, 0, 0)
    this.up = new Vector3(0, 1, 0)

    this.projectionMatrix = new Matrix4()

    this.updateProjectionMatrix()
  }

  updateProjectionMatrix() {
    const near = this.near
    let top = (near * Math.tan(MathUtils.DEG2RAD * 0.5 * this.fov)) / this.zoom
    let height = 2 * top
    let width = this.aspect * height
    let left = -0.5 * width

    this.projectionMatrix.makePerspective(
      left,
      left + width,
      top,
      top - height,
      near,
      this.far
    )
  }
}

export { PerspectiveCamera }
