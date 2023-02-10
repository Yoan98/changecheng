import { WebglBuffer } from './webgl/WebglBuffer'
import { WebglProgram } from './webgl/WebglProgram'
import { WebglAttribute } from './webgl/WebglAttribute'

class Renderer {
  constructor(canvas) {
    this.gl = this.getContext(canvas)

    this.initGlContext(this.gl)
  }

  initGlContext(gl) {
    this._glBuffer = new WebglBuffer(gl)

    this._glProgram = new WebglProgram(gl)

    this._glAttribute = new WebglAttribute(gl.this._glProgram)
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

  // 将灯光，材质，相机数据，融合成shader字符串
  generateShader() {
    // 根据材质获取shader字符（相当于不同材质，不同的公式，用于计算最终的像素颜色）
    // 将灯光，材质颜色，相机数据融入shader字符串
    // const vertexGlsl = versionString + prefixVertex + vertexShader
    // const fragmentGlsl = versionString + prefixFragment + fragmentShader
  }
  render(scene, camera) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    // 处理场景中的所有对象
    // 获取顶点与片元着色器字符串(需要根据灯光与材质融合计算)

    // 获取顶点以及片元着色器内相关的变量数据
    // 获取顶点的所有数据
    // 注：一个对象对应一个program 一个shader 一个buffer 一次渲染

    // 下面的操作要遍历对象执行

    // 将顶点片元字符串，导入到shader中
    // this.shader = new WebglShader(this.gl,vertex,fragment)

    // 传递shader对象，应用到program中
    // this._glProgram.useProgram(this.shader)

    // 将顶点的所有数据写入缓冲区，并关联到着色器中的变量
    // this._glBuffer.writeBufferData(dataArr)

    // 渲染
    // this.gl.drawArrays(this.gl.TRIANGLES, 0, points.length / 2);
    // this.gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  }
}

export { Renderer }
