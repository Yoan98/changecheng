import {
  SHADOW_VSHADER_SOURCE,
  SHADOW_FSHADER_SOURCE,
} from '../../shaders/lib/Shadow.glsl'
class WebglShader {
  // 7号贴图专门用于阴影贴图
  constructor(gl) {
    this._gl = gl

    // shader缓存，保证每个渲染对象一个shader
    this.shaderWeakMap = new WeakMap()

    // 阴影shader
    this.shadowShader = null
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

  getShadowShader() {
    let glShader = this.shadowShader

    if (glShader) {
      return glShader
    }

    const vertexShader = this._createShader(
      SHADOW_VSHADER_SOURCE,
      this._gl.VERTEX_SHADER
    )
    const fragmentShader = this._createShader(
      SHADOW_FSHADER_SOURCE,
      this._gl.FRAGMENT_SHADER
    )

    glShader = {
      vertexShader,
      fragmentShader,
    }

    this.shadowShader = glShader

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
