class WebglBindState {
  constructor(gl, program) {
    this._gl = gl

    this._program = program
  }

  // 将顶点的所有数据写入缓冲区，并关联到着色器中的变量
  writeDataToShader(attributes) {
    if (attributes === undefined) throw new Error('Attribute is undefined.')

    for (let name in attributes) {
      // attr为着色器变量字符串

      const info = attributes[name]

      const { type, location, locationSize, value } = info

      if (type === 'Uniform') {
        this._gl.uniform3f(
          name,
          value.uniform3f.x,
          value.uniform3f.y,
          value.uniform3f.z
        )
      } else if (type === 'AttribPointer') {
        const bufferId = this._gl.createBuffer()

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bufferId)
        this._gl.bufferData(
          this._gl.ARRAY_BUFFER,
          value.bufferData,
          this._gl.STATIC_DRAW
        )

        this._gl.vertexAttribPointer(
          location,
          value.vertexAttribPointer.size,
          value.vertexAttribPointer.type,
          value.vertexAttribPointer.normalized,
          value.vertexAttribPointer.stride,
          value.vertexAttribPointer.offset
        )

        this._gl.enableVertexAttribArray(location)
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
