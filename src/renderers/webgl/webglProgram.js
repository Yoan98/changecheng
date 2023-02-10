class WebglProgram {
  constructor(gl) {
    this._gl = gl

    this.program = gl.createProgram()
  }

  useProgram(webglShader) {
    this._gl.attachShader(this.program, webglShader.vertexShader)
    this._gl.attachShader(this.program, webglShader.fragmentShader)

    this._gl.linkProgram(this.program)

    this._gl.useProgram(this.program)
  }
}

export { WebglProgram }
