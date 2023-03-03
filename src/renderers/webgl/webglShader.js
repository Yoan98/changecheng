class WebglShader {
  constructor(gl) {
    this._gl = gl

    // shader缓存，保证每个渲染对象一个shader
    this.shaderWeakMap = new WeakMap()
  }

  getShader(meshObject) {
    const { vertex, fragment } = meshObject.shader

    // 不能以shaderid来缓存，shader字符是动态的
    let glShader = this.shaderWeakMap.get(meshObject)

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

    this.shaderWeakMap.set(meshObject, glShader)

    return glShader
  }

  getShadowShader() {}
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
