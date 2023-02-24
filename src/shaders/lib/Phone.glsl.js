// 使用Blinn-Phone模型

export const vertex = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;

  uniform mat4 u_MvpMatrix;

  varying vec4 v_Color;
  varying vec4 v_Position;
  varying vec4 v_Normal;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;

    v_Color = a_Color;
    v_Position = a_Position;
    v_Normal = a_Normal;
  }

`
export const fragment = `
  #ifdef GL_ES
  precision mediump float;
  #endif

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

  void main() {

    vec3 halfVec = u_EyePosition + u_LightPosition;

    vec3 normalNor = normalize(vec3(u_NormalMatrix * v_Normal));
    vec3 lightNor = normalize(u_LightPosition);
    vec3 halfVecNor = normalize(halfVec);

    float nDotL = max(dot(lightNor, normalNor), 0.0);
    float nDotH = max(dot(halfVecNor, normalNor), 0.0);

    float lightR = distance(normalize(vec3(u_ModelMatrix * v_Position)), lightNor);

    float lightIntensByPos = u_LightIntensity / (lightR * lightR);

    vec3 diffuse = v_Color.rgb * u_LightColor * lightIntensByPos * nDotL;

    vec3 specular = u_SpecularColor * lightIntensByPos * pow(nDotH,u_SpecularPlot);

    vec3 ambient = u_AmbientLight * v_Color.rgb;

    gl_FragColor = vec4(diffuse + specular + ambient, v_Color.a);
  }

  `
