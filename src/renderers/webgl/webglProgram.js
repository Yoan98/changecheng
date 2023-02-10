class WebglProgram {
  constructor(gl) {
    this._gl = gl
  }

  getProgram(webglShader) {
    const glProgram = gl.createProgram()

    this._gl.attachShader(glProgram, webglShader.vertexShader)
    this._gl.attachShader(glProgram, webglShader.fragmentShader)

    this._gl.linkProgram(glProgram)

    this._gl.useProgram(glProgram)
  }
}

export { WebglProgram }
