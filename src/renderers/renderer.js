import { WebglProgram } from './webgl/WebglProgram'
import { WebglShader } from './webgl/WebglShader'
import { WebglBindState } from './webgl/WebglBindState'

import { SHADER_MAP } from './shader/ShaderMap'
class Renderer {
  constructor(canvas) {
    this.gl = this.getContext(canvas)

    this.curRenderLights = []
    this.curRenderObjects = []
    this.curCamera = {}

    this.initGlContext(this.gl)
  }

  initGlContext(gl) {
    this._program = new WebglProgram(gl)

    this._bindState = new WebglBindState(gl)
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

    const { vertex, fragment } = SHADER_MAP[material.shaderId]

    meshObject.shader = {
      vertex,
      fragment,
    }
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

      // console.log( 'THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:', name, i );

      attributes[name] = {
        type: info.type,
        location: gl.getAttribLocation(program, name),
        locationSize: locationSize,
      }
    }

    return attributes
  }

  setAttributeSetting(attributes, meshObject, lights) {
    const transformColorBuffer = (color) => {
      // todo
      return new Float32Array([])
    }

    const getValueByType = (name) => {
      const value = {
        vertexAttribPointer: {
          size: 3,
          type: gl.FLOAT,
          normalized: false,
          stride: 0,
          offset: 0,
        },
        uniform3f: {
          x: 0,
          y: 0,
          z: 0,
        },
        bufferData: new Float32Array([]),
      }
      if (name === 'a_Position') {
        value[bufferData] = meshObject.geometry.vertices
      } else if (name === 'a_Normal') {
        value[bufferData] = meshObject.geometry.normals
      } else if (name === 'a_Color') {
        value[bufferData] = transformColorBuffer(meshObject.material.color)
      } else if (name === 'u_LightColor') {
        value[bufferData] = transformColorBuffer(lights[0].color)
      }
    }

    for (let name in attributes) {
      attributes[name].value = getValueByType(name)
    }
  }

  render(scene, camera) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

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
    })

    // 注：一个对象对应一个program 一个shader 一个buffer 一次渲染

    this.curRenderObjects.forEach((meshObject) => {
      // 生成顶点与片元着色器字符串
      this.generateShader(meshObject)

      const shader = new WebglShader(
        this.gl,
        meshObject.vertex,
        meshObject.fragment
      )

      // 传递shader对象，应用到program中
      const glProgram = this._program.getProgram(shader)

      // 调用gl.getProgramParameter，获取该项目中所有shader变量，生成一个对象attribute(包含buffer数据)
      const attributes = this.fetchAttributeLocations(this.gl, glProgram)

      // 将顶点灯光等数据以及数据应用方式对应到attribute中
      setAttributeSetting(attributes, meshObject, this.curRenderLights)

      // 将数据写入缓冲区，同时应用到shader变量中
      this._bindState.writeDataToShader(attributes)

      if (meshObject.geometry.indices.length) {
        // 设置索引
        this._bindState.writeIndicesBufferData(meshObject.geometry.indices)
      }

      // 渲染
      // this.gl.drawArrays(this.gl.TRIANGLES, 0, points.length / 2);
      // this.gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    })
  }
}

export { Renderer }
