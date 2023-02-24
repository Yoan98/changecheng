import { Color } from '../math/Color'

class PhoneMaterial {
  constructor() {
    this.shaderId = 'stander'

    // 漫反射系数
    this.color = new Color(1, 0, 0)
    // 高光系数
    this.specular = new Color(0x111111)
    // 高光指数(数值越大，高光越小越亮)
    this.specularPlot = 30
  }
}

export { PhoneMaterial }
