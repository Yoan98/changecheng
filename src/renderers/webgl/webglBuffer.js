class WebglBuffer {
  constructor(gl) {
    this._gl = gl
  }

  // 创建数据缓冲区对象
  writeArrayBufferData(data) {
    const bufferId = this._gl.createBuffer() // 创建缓冲区对象

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, bufferId)
    this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW)

    return bufferId
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

export { WebglBuffer }
