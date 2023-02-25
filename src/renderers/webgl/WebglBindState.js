class WebglBindState {
  constructor(gl) {
    this._gl = gl
  }

  // 将顶点的所有数据写入缓冲区，并关联到着色器中的变量
  writeDataToShader(attributes, uniforms) {
    if (attributes === undefined) throw new Error('Attribute is undefined.')
    if (uniforms === undefined) throw new Error('Uniforms is undefined.')

    for (let name in attributes) {
      // attr为着色器变量字符串

      const info = attributes[name]

      const { type, location, locationSize, value } = info

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

    for (let name in uniforms) {
      // attr为着色器变量字符串

      const info = uniforms[name]

      const { type, location, value } = info

      if (type === this._gl.FLOAT_MAT4) {
        this._gl.uniformMatrix4fv(location, false, value.uniformMatrix4fv)
      } else if (type === this._gl.FLOAT_VEC3 || type === this._gl.INT_VEC3) {
        this._gl.uniform3fv(location, value.uniform3fv)
      } else if (type === this._gl.FLOAT || type === this._gl.INT) {
        this._gl.uniform1f(location, value.uniform1f)
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
