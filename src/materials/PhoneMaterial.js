import { Color } from '../math/Color'

class PhoneMaterial {
  constructor(param) {
    this.shaderId = 'phone'

    // 漫反射系数
    this.color = new Color(1, 1, 1)
    // 高光系数
    this.specular = new Color(0x111111)
    // 高光指数(数值越大，高光越小越亮)
    this.specularPlot = 30
    // 环境光颜色
    this.envColor = new Color(0, 0, 0)

    // 漫反射贴图
    this.map = null

    this.initParm(param)
  }

  initParm(param) {
    if (!param) return

    for (let key in param) {
      this[key] = param[key]
    }
  }
}

export { PhoneMaterial }
