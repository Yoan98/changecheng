class WebglProgram {
  constructor(gl) {
    this._gl = gl
  }

  getProgram(webglShader) {
    const glProgram = this._gl.createProgram()

    this._gl.attachShader(glProgram, webglShader.vertexShader)
    this._gl.attachShader(glProgram, webglShader.fragmentShader)

    this._gl.linkProgram(glProgram)

    // Check the result of linking
    const linked = this._gl.getProgramParameter(glProgram, this._gl.LINK_STATUS)
    if (!linked) {
      var error = this._gl.getProgramInfoLog(glProgram)
      console.log('Failed to link program: ' + error)
      this._gl.deleteProgram(glProgram)
      this._gl.deleteShader(webglShader.vertexShader)
      this._gl.deleteShader(webglShader.fragmentShader)

      return null
    }
    this._gl.useProgram(glProgram)

    return glProgram
  }
}

export { WebglProgram }
