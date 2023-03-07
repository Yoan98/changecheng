const SHADOW_VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_MvpMatrixFromLight;
  void main() {
    gl_Position = u_MvpMatrixFromLight * a_Position;
  }`

// Fragment shader program for generating a shadow map
const SHADOW_FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
    const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
    rgbaDepth -= rgbaDepth.gbaa * bitMask;
    gl_FragColor = rgbaDepth;
  }`

export { SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE }
