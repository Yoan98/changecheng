export const vertex = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;

  uniform mat4 u_MvpMatrix;

  varying vec4 v_Color;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;


    v_Color = a_Color;
  }

`
export const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec4 v_Color;

  void main() {
    gl_FragColor = v_Color;
  }

  `
