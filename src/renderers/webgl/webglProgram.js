import {WebglShader} from './webglShader'

class WebglProgram {

  constructor(gl){
    this._gl = gl

    this.program =  gl.createProgram();
  }

  useProgram(webglShader){
    gl.attachShader(this.program, webglShader.vertexShader);
    gl.attachShader(this.program, webglShader.fragmentShader);

    this._gl.linkProgram(this.program)

    this._gl.useProgram(this.program)
  }

}

export {WebglProgram}