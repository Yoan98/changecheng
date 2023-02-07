import {WebglBuffer} from './webgl/webglBuffer'
import {WebglProgram} from './webgl/webglProgram'


class Renderer {
  constructor(canvas){

    this.gl = this.getContext(canvas)

    this.initGlContext(gl)
  }

  initGlContext(gl){
    this._glBuffer = new WebglBuffer(gl)

    this._glProgram = new WebglProgram(gl)

    this._glAttribute = new WebglAttribute(gl.this._glProgram)
  }


   getContext(canvas, contextAttributes = {} ) {
    const contextNames = [ 'webgl2', 'webgl', 'experimental-webgl' ];

		for ( let i = 0; i < contextNames.length; i ++ ) {

			const contextName = contextNames[ i ];
			const context = canvas.getContext( contextName, contextAttributes );
			if ( context !== null ) return context;

		}

		return null;

	}
  render(scene,camera){
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // 处理场景中的所有对象
    // 获取顶点与片元着色器字符串
    // 获取顶点以及片元着色器内相关的变量数据
    // 获取顶点的所有数据以及顶点数量
    // 注：一个对象对应一个program 一个shader 一个buffer 一次渲染

    // 下面的操作要遍历对象执行
    // 将顶点的所有数据写入缓冲区
    // this._glBuffer.writeBufferData(dataArr)

    // 将顶点片元字符串，导入到shader中
    // this.shader = new WebglShader(this.gl,vertex,fragment)

    // 传递shader对象，应用到program中
    // this._glProgram.useProgram(this.shader)

    // 将缓冲区的数据关联到着色器中的变量
    // this._glAttribute.setAttributesByPointer(attributes)

    // 渲染
    // this.gl.drawArrays(this.gl.TRIANGLES, 0, points.length / 2);

  }
}

export { Renderer };