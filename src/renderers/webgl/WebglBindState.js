class WebglBindState {
  constructor(gl, program) {
    this._gl = gl

    this._program = program
  }

  // 将顶点的所有数据写入缓冲区，并关联到着色器中的变量
  writeDataToShader(attributes) {
    if (attributes === undefined) throw new Error('Attribute is undefined.')

    for (let attr in attributes) {
      // attr为着色器变量字符串

      const attrVal = attributes[attr]

      const { shaderVarType, value, data } = attrVal

      if (shaderVarType === 'Uniform') {
        this._gl.uniform3f(attr, value.x, value.y, value.z)
      } else if (shaderVarType === 'AttribPointer') {
        const bufferId = this._gl.createBuffer()

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bufferId)
        this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW)

        const glVarIndex = this._gl.getAttribLocation(this._program, attr)

        this._gl.vertexAttribPointer(
          glVarIndex,
          value.size,
          value.type,
          value.normalized,
          value.stride,
          value.offset
        )

        this._gl.enableVertexAttribArray(glVarIndex)
      }
    }
  }

  // 创建索引缓冲区对象
  writeIndicesBufferData(indices) {
    const bufferId = this._gl.createBuffer()

    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, bufferId)
    this._gl.bufferData(
      this._gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this._gl.STATIC_DRAW
    )

    return bufferId
  }
}

export { WebglBindState }
