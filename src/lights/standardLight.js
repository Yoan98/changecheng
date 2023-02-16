import { ObjectBase } from './ObjectBase'
import { Color } from '../math/Color.js'
class standardLight extends ObjectBase {
  constructor() {
    this.type = 'standerLight'

    this.color = new Color(0xffffff)
  }
}

export { standardLight }
