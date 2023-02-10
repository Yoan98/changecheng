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

    // 获取顶点与片元着色器字符串
    this.curRenderObjects.forEach((meshObject) => {
      this.generateShader(meshObject)

      // 将顶点片元字符串，导入到shader中
      this.shader = new WebglShader(
        this.gl,
        meshObject.vertex,
        meshObject.fragment
      )

      // 传递shader对象，应用到program中
      const glProgram = this._program.getProgram(this.shader)

      // 调用gl.getProgramParameter，获取该项目中所有shader变量，生成一个对象attribute(包含buffer数据)

      // 将数据写入缓冲区，同时应用到shader变量中
      // this._bindState.writeDataToShader(attribute)

      // 渲染
      // this.gl.drawArrays(this.gl.TRIANGLES, 0, points.length / 2);
      // this.gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    })
  }
}

export { Renderer }
