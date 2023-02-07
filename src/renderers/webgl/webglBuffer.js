class WebglBuffer {

  constructor(gl){
    this._gl = gl

    this.bufferId = gl.createBuffer(); // 创建缓冲区对象

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId); // 将缓冲区对象绑定到目标
  }

  writeBufferData(arr){
    this._gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)
  }

}

export {WebglBuffer}