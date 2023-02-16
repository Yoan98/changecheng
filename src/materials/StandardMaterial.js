import { Color } from '../math/Color.js'

class StandardMaterial {
  constructor() {
    this.shaderId = 'stander'

    this.color = new Color(0xffffff)
  }
}

export { StandardMaterial }
