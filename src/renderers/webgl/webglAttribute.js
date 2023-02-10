class WebglAttribute {
  constructor(gl, program) {
    this._gl = gl

    this._program = program
  }

  /**
   *
   * @param {*} attributes
   * {gl_position:{
   * type: '',
   * size: 2,
   * normalized: false,
   * stride:0,
   * offset:0
   * }
   * }
   */
  setAttributesByPointer(attributes) {
    if (attributes === undefined) throw new Error('Attribute is undefined.')

    for (let attr in attributes) {
      // attr为着色器变量字符串

      const attrVal = attributes[attr]

      const glVarIndex = this._gl.getAttribLocation(this._program, attr)

      this._gl.vertexAttribPointer(
        glVarIndex,
        attrVal.size,
        attrVal.type,
        attrVal.normalized,
        attrVal.stride,
        attrVal.offset
      )

      this._gl.enableVertexAttribArray(glVarIndex)
    }
  }
}

export { WebglAttribute }
