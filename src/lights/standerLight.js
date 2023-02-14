import { ObjectBase } from './ObjectBase'
class standerLight extends ObjectBase {
  constructor() {
    this.type = 'standerLight'

    this.color = new Color(0xffffff)
  }
}

export { standerLight }
