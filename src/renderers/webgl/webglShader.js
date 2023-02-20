class WebglShader {
  constructor(gl, vertex, fragment) {
    this._gl = gl

    this.vertexShader = this._createShader(vertex, gl.VERTEX_SHADER)
    this.fragmentShader = this._createShader(fragment, gl.FRAGMENT_SHADER)
  }

  _createShader(shaderData, glShaderType) {
    const shader = this._gl.createShader(glShaderType)
    if (shader == null) {
      console.error('unable to create shader')
      return null
    }

    this._gl.shaderSource(shader, shaderData)
    this._gl.compileShader(shader)

    // Check the result of compilation
    var compiled = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)
    if (!compiled) {
      var error = this._gl.getShaderInfoLog(shader)
      console.error('Failed to compile shader: ' + error)
      this._gl.deleteShader(shader)
      return null
    }

    return shader
  }
}

export { WebglShader }
