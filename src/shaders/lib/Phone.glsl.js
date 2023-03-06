// 使用Blinn-Phone模型

export const vertex = `
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_MvpMatrixFromLight;

  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  attribute vec2 a_TexCoord;

  varying vec4 v_Position;
  varying vec4 v_Color;
  varying vec4 v_Normal;
  varying vec2 v_TexCoord;
  varying vec4 v_PositionFromLight;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;

    v_PositionFromLight = u_MvpMatrixFromLight * a_Position;
    v_Color = a_Color;
    v_Position = a_Position;
    v_Normal = a_Normal;
    v_TexCoord = a_TexCoord;
  }

`
export const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform sampler2D u_SamplerDiffuse;
  uniform sampler2D u_ShadowMap;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;

  uniform vec3 u_EyePosition;

  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;
  uniform vec3 u_AmbientLight;

  uniform vec3 u_SpecularColor;
  uniform float u_SpecularPlot;

  uniform float u_LightIntensity;

  varying vec4 v_Color;
  varying vec4 v_Position;
  varying vec4 v_Normal;
  varying vec2 v_TexCoord;
  varying vec4 v_PositionFromLight;

  float unpackDepth(const in vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
    float depth = dot(rgbaDepth, bitShift);
    return depth;
  }

  void main() {

    #include <diffuse_color>

    vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
    float depth = unpackDepth(rgbaDepth);
    float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;

    vec3 halfVec = u_EyePosition + u_LightPosition;

    vec3 normalNor = normalize(vec3(u_NormalMatrix * v_Normal));
    vec3 lightNor = normalize(u_LightPosition);
    vec3 halfVecNor = normalize(halfVec);

    float nDotL = max(dot(lightNor, normalNor), 0.0);
    float nDotH = max(dot(halfVecNor, normalNor), 0.0);

    float lightR = distance(normalize(vec3(u_ModelMatrix * v_Position)), lightNor);

    float lightIntensByPos = u_LightIntensity / (lightR * lightR);

    vec3 diffuse = diffuse_color.rgb * u_LightColor * lightIntensByPos * nDotL;

    vec3 specular = u_SpecularColor * lightIntensByPos * pow(nDotH,u_SpecularPlot);

    vec3 ambient = u_AmbientLight * diffuse_color.rgb;

    vec3 fragColor = diffuse + specular + ambient;

    gl_FragColor = vec4(fragColor * visibility, diffuse_color.a);
  }

  `
