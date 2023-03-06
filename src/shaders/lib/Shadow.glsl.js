const SHADOW_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MvpMatrixFromLight;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrixFromLight * a_Position;\n' +
  '}\n'

// Fragment shader program for generating a shadow map
const SHADOW_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'void main() {\n' +
  '  const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n' +
  '  const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);\n' +
  '  vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);\n' + // Calculate the value stored into each byte
  '  rgbaDepth -= rgbaDepth.gbaa * bitMask;\n' + // Cut off the value which do not fit in 8 bits
  '  gl_FragColor = rgbaDepth;\n' +
  '}\n'

export { SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE }
