class WebglBuffer {

  constructor(gl){
    this._gl = gl

  }


  // 创建数据缓冲区对象
  writeArrayBufferData(data){
    const bufferId = gl.createBuffer(); // 创建缓冲区对象

    this._gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    this._gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    return bufferId
  }

  // 创建索引缓冲区对象
  writeIndicesBufferData(indices){
    const bufferId = gl.createBuffer();

    this._gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferId);
    this._gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return bufferId
  }

}

export {WebglBuffer}