import { Color } from '../math/Color'

class StandardMaterial {
  constructor() {
    this.shaderId = 'stander'

    this.color = new Color(1,1,1)
  }
}

export { StandardMaterial }
