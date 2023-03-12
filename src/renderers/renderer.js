import { WebglProgram } from './webgl/WebglProgram'
import { WebglShader } from './webgl/WebglShader'
import { WebglFrameBuffer } from './webgl/WebglFrameBuffer'
import { WebglBindState } from './webgl/WebglBindState'
import { WebglTexture } from './webgl/WebglTexture'
import { Matrix4 } from '../math/Matrix4.js'
import { Matrix4 as Matrix4t } from '../lib/cuon-matrix'
import { SHADER_MAP } from '../shaders/map'
class Renderer {
  constructor(canvas, config) {
    this._config = {
      OFFSCREEN_WIDTH: 2048,
      OFFSCREEN_HEIGHT: 2048,
      ...config,
    }

    this.canvas = canvas

    this.gl = this.getContext(canvas, {
      // antialias: true,
    })

    if (this.gl === null) {
      throw new Error('Get gl context error')
    }

    this.curRenderLights = []
    this.curRenderObjects = []
    this.curCamera = {}

    this.initGlContext(this.gl)
  }

  initGlContext(gl) {
    this._programMana = new WebglProgram(gl)

    this._bindState = new WebglBindState(gl)

    this._shaderMana = new WebglShader(gl, this._config)

    this._textureMana = new WebglTexture(gl)

    this._frameBufferMana = new WebglFrameBuffer(gl, this._config)

    this.gl.enable(gl.DEPTH_TEST)

    this.gl.clearColor(0, 0, 0, 1)

    // this.gl.enable(gl.CULL_FACE)
  }

  getContext(canvas, contextAttributes = {}) {
    const contextNames = ['webgl2', 'webgl', 'experimental-webgl']

    for (let i = 0; i < contextNames.length; i++) {
      const contextName = contextNames[i]
      const context = canvas.getContext(contextName, contextAttributes)
      if (context !== null) return context
    }

    return null
  }

  generateShader(meshObject) {
    const { material } = meshObject

    let { vertex, fragment } = SHADER_MAP[material.shaderId]

    // 替换着色器内的变量字符
    const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm

    const replaceMap = {
      diffuse_color: {
        mapColor: `vec4 diffuse_color = texture2D(u_SamplerDiffuse, v_TexCoord);`,
        veterColor: `vec4 diffuse_color = v_Color;`,
      },
    }

    // 替换贴图变量字符
    if (meshObject.material.map) {
      fragment = fragment.replace(includePattern, (str, word) => {
        return replaceMap[word].mapColor
      })
    } else {
      fragment = fragment.replace(includePattern, (str, word) => {
        return replaceMap[word].veterColor
      })
    }

    meshObject.shader.vertex = vertex
    meshObject.shader.fragment = fragment
  }
  fetchAttributeLocations(gl, program) {
    const attributes = {}

    const n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (let i = 0; i < n; i++) {
      const info = gl.getActiveAttrib(program, i)
      const name = info.name

      let locationSize = 1
      if (info.type === gl.FLOAT_MAT2) locationSize = 2
      if (info.type === gl.FLOAT_MAT3) locationSize = 3
      if (info.type === gl.FLOAT_MAT4) locationSize = 4

      attributes[name] = {
        type: info.type,
        location: gl.getAttribLocation(program, name),
        locationSize: locationSize,
      }
    }

    return attributes
  }

  fetchUniformLocations(gl, program) {
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    const uniforms = {}

    for (let i = 0; i < n; ++i) {
      const info = gl.getActiveUniform(program, i)
      const name = info.name

      uniforms[name] = {
        type: info.type,
        location: gl.getUniformLocation(program, info.name),
      }
    }

    return uniforms
  }

  // 后期优化多灯光问题
  attributeSetting(attributes, meshObject, lights) {
    const transformColorBuffer = (color, length) => {
      let colorArr = []
      for (let i = 0; i < length; i++) {
        const rgbArr = color.toArray([])

        colorArr = colorArr.concat(rgbArr)
      }
      return new Float32Array(colorArr)
    }

    const getValueByType = (name) => {
      const value = {
        vertexAttribPointer: {
          size: 3,
          type: this.gl.FLOAT,
          normalized: false,
          stride: 0,
          offset: 0,
        },
        bufferData: new Float32Array([]),
      }
      if (name === 'a_Position') {
        value.bufferData = meshObject.geometry.vertices
      } else if (name === 'a_Normal') {
        value.bufferData = meshObject.geometry.normals
      } else if (name === 'a_Color') {
        value.bufferData = transformColorBuffer(
          meshObject.material.color,
          meshObject.geometry.vertices.length / 3
        )
      } else if (name === 'a_TexCoord') {
        value.bufferData = meshObject.geometry.uvs
        value.vertexAttribPointer.size = 2
      }

      return value
    }

    for (let name in attributes) {
      attributes[name].value = getValueByType(name)
    }
  }

  // 后期优化多灯光问题
  uniformSetting(uniforms, meshObject, lights, camera) {
    const getValueByType = (name) => {
      const value = {
        uniform3fv: [],
        uniformMatrix4fv: [],
        uniform1f: null,
        uniform1i: null,
      }

      if (name === 'u_LightColor' && lights.length) {
        // 灯光颜色
        value.uniform3fv = new Float32Array(lights[0].color.toArray())
      } else if (name === 'u_AmbientLight') {
        // 环境光的计算待后面优化
        value.uniform3fv = new Float32Array(
          meshObject.material.envColor.toArray()
        )
      } else if (name === 'u_LightPosition' && lights.length) {
        const u_LightPosition = lights[0].position.toArray()
        value.uniform3fv = new Float32Array(u_LightPosition)
      } else if (name === 'u_LightIntensity' && lights.length) {
        const u_LightIntensity = lights[0].intensity

        value.uniform1f = u_LightIntensity
      } else if (name === 'u_ModelMatrix') {
        value.uniformMatrix4fv = new Float32Array(
          meshObject.modelMatrix.elements
        )
      } else if (name === 'u_MvpMatrix') {
        // 计算投影矩阵
        const mvpMatrix = new Matrix4()
        const lookAtMatrix = new Matrix4().setLookAt(
          camera.position,
          camera.target,
          camera.up
        )

        mvpMatrix.set(...camera.projectionMatrix.elements)
        mvpMatrix.multiply(lookAtMatrix)
        mvpMatrix.multiply(meshObject.modelMatrix)

        value.uniformMatrix4fv = new Float32Array(mvpMatrix.elements)
      } else if (name === 'u_MvpMatrixFromLight') {
        // 计算灯光视角的投影矩阵
        const mvpMatrix = new Matrix4()
        const lookAtMatrix = new Matrix4().setLookAt(
          lights[0].position,
          lights[0].target,
          lights[0].up
        )

        const perspectiveMatrix = new Matrix4().setPerspective(
          80.0,
          this._config.OFFSCREEN_WIDTH / this._config.OFFSCREEN_HEIGHT,
          1.0,
          1000
        )

        mvpMatrix.set(...perspectiveMatrix.elements)
        mvpMatrix.multiply(lookAtMatrix)
        mvpMatrix.multiply(meshObject.modelMatrix)

        value.uniformMatrix4fv = new Float32Array(mvpMatrix.elements)
      } else if (name === 'u_NormalMatrix') {
        // 计算法线矩阵，用于物体移动后，法线的变动。先求逆再转置
        const normalMatrix = new Matrix4()
        normalMatrix.multiply(meshObject.modelMatrix).invert().transpose()

        value.uniformMatrix4fv = new Float32Array(normalMatrix.elements)
      } else if (name === 'u_EyePosition') {
        value.uniform3fv = new Float32Array(camera.position.toArray())
      } else if (name === 'u_SpecularColor') {
        value.uniform3fv = new Float32Array(
          meshObject.material.specular.toArray()
        )
      } else if (name === 'u_SpecularPlot') {
        value.uniform1i = Number(meshObject.material.specularPlot)
      } else if (name === 'u_SamplerDiffuse') {
        // 设置漫反射贴图变量
        value.uniform1i = Number(0)
      } else if (name === 'u_ShadowMap') {
        // 设置阴影贴图变量
        value.uniform1i = Number(7)
      }

      return value
    }

    for (let name in uniforms) {
      uniforms[name].value = getValueByType(name)
    }
  }
  // 帧缓冲区跑阴影渲染
  renderShadowMap(camera) {
    const glShader = this._shaderMana.getShadowShader()

    const glProgram = this._programMana.getShadowProgram(glShader)

    const glFramebuffer = this._frameBufferMana.getFramebuffer()

    // 设置当前使用7号贴图，且为阴影贴图（目前该帧缓冲区只用于阴影贴图）
    this.gl.activeTexture(this.gl.TEXTURE7)
    this.gl.bindTexture(this.gl.TEXTURE_2D, glFramebuffer.texture)

    // 切换当前渲染使用帧缓冲区渲染（不会渲染到页面上）
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, glFramebuffer)
    this.gl.viewport(
      0,
      0,
      this._config.OFFSCREEN_WIDTH,
      this._config.OFFSCREEN_HEIGHT
    )
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.gl.useProgram(glProgram)

    this.curRenderObjects.forEach((meshObject) => {
      const attributes = this.fetchAttributeLocations(this.gl, glProgram)

      const uniforms = this.fetchUniformLocations(this.gl, glProgram)

      // 配置attributes数据，方便后续应用变量到shader
      this.attributeSetting(attributes, meshObject, this.curRenderLights)

      // 配置uniforms数据，方便后续应用变量到shader
      this.uniformSetting(uniforms, meshObject, this.curRenderLights, camera)

      // console.log(uniforms)
      // console.log(attributes)
      // 将数据写入缓冲区，同时应用到shader变量中
      this._bindState.writeDataToShader(attributes, uniforms)

      this.draw(meshObject)
    })

    // 切换回颜色缓冲区渲染（会渲染到页面上）
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  renderObjects(camera) {
    this.curRenderObjects.forEach((meshObject) => {
      if (meshObject.material.map && !meshObject.material.map.complete) {
        // 如果该渲染对象存在贴图 且图片未加载好 则不渲染
        return
      }
      // 生成顶点与片元着色器字符串
      this.generateShader(meshObject)

      const glShader = this._shaderMana.getShader(meshObject)

      // console.log(meshObject)

      // 传递shader对象，应用到program中
      const glProgram = this._programMana.getProgram(meshObject, glShader)
      this.gl.useProgram(glProgram)

      if (glProgram === null) {
        console.error('Create program error')
        return
      }

      // 调用gl.getProgramParameter，获取该项目中所有attribute shader变量，生成一个对象attribute(包含buffer数据)
      const attributes = this.fetchAttributeLocations(this.gl, glProgram)

      // 调用gl.getProgramParameter，获取该项目中所有uniform shader变量，生成一个对象attribute
      const uniforms = this.fetchUniformLocations(this.gl, glProgram)

      // 配置attributes数据，方便后续应用变量到shader
      this.attributeSetting(attributes, meshObject, this.curRenderLights)

      // 配置uniforms数据，方便后续应用变量到shader
      this.uniformSetting(uniforms, meshObject, this.curRenderLights, camera)

      console.log(attributes)
      // console.log(uniforms)

      // 将数据写入缓冲区，同时应用到shader变量中
      this._bindState.writeDataToShader(attributes, uniforms)

      if (meshObject.material.map) {
        // 如果存在贴图
        // 则需要先加载贴图再渲染
        this._textureMana.loadTexture(meshObject)
      }

      this.draw(meshObject)
    })
  }
  render(scene, camera) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.curRenderObjects = []
    this.curRenderLights = []

    // 用帧缓冲区渲染一遍所有对象得出阴影贴图
    // 再切换回颜色缓冲区正常的渲染一遍所有对象

    // 处理场景中的所有对象,进行相应的初始化，便于后面操作
    // 后期优化过滤一些不需要显示的对象
    scene.children.forEach((child) => {
      if (child.type === 'mesh') {
        this.curRenderObjects.push(child)
      } else if (child.type === 'light') {
        this.curRenderLights.push(child)
      } else if (child.type === 'camera') {
        this.curCamera = child
      }

      child.updateMatrix()
    })

    camera.updateMatrix()

    // 绘制阴影贴图
    this.renderShadowMap(camera)

    // 注：一个对象对应一个program 一个shader 一个buffer 一次渲染
    // 正常物体在颜色缓冲区渲染
    this.renderObjects(camera)
  }

  draw(meshObject) {
    if (meshObject.geometry.indices.length) {
      // 设置索引
      this._bindState.writeIndicesBufferData(meshObject.geometry.indices)

      // 渲染
      this.gl.drawElements(
        this.gl.TRIANGLES,
        meshObject.geometry.indices.length,
        this.gl.UNSIGNED_BYTE,
        0
      )
      return
    }

    // 渲染
    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0,
      meshObject.geometry.vertices.length / 3
    )
  }

  renderLoop(callBack) {
    function animate() {
      requestAnimationFrame(animate)

      callBack()
    }
    animate()
  }
}

export { Renderer }
