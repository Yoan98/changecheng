import { ObjectBase } from './ObjectBase'
import { Color } from '../math/Color.js'
class StandardLight extends ObjectBase {
  constructor() {
    super()

    this.type = 'standerLight'

    this.color = new Color(0xffffff)
  }
}

export { StandardLight }
