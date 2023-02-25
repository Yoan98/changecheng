class WebglShader {
  constructor(gl) {
    this._gl = gl

    // shader缓存，保证每种材质只生成一次
    this.shaderMap = {}
  }

  getShader(meshObject) {
    const { vertex, fragment } = meshObject.shader

    const shaderId = meshObject.material.shaderId
    let glShader = this.shaderMap[shaderId]

    if (glShader) {
      // 有缓存
      return glShader
    }

    const vertexShader = this._createShader(vertex, this._gl.VERTEX_SHADER)
    const fragmentShader = this._createShader(
      fragment,
      this._gl.FRAGMENT_SHADER
    )

    glShader = {
      vertexShader,
      fragmentShader,
    }

    this.shaderMap[shaderId] = glShader

    return glShader
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
