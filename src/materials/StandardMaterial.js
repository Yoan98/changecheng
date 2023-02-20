import { Color } from '../math/Color'

class StandardMaterial {
  constructor() {
    this.shaderId = 'stander'

    this.color = new Color(0xffffff)
  }
}

export { StandardMaterial }
