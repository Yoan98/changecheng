class WebglShader {
  constructor(gl, vertex, fragment) {
    this._gl = gl

    this.vertexShader = this._createShader(vertex, gl.VERTEX_SHADER)
    this.fragmentShader = this._createShader(fragment, gl.FRAGMENT_SHADER)
  }

  _createShader(shaderData, glShaderType) {
    const shader = this._gl.createShader(glShaderType)

    this._gl.shaderSource(shader, shaderData)
    this._gl.compileShader(shader)

    return shader
  }
}

export { WebglShader }
