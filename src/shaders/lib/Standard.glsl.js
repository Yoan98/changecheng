export const vertex = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;

  uniform mat4 u_MvpMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;

  uniform vec3 u_LightColor;
  uniform vec3 u_LightDirection;
  uniform vec3 u_AmbientLight;
  uniform float u_LightIntensity;

  varying vec4 v_Color;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;

    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    vec3 lightDirectionNor = normalize(u_LightDirection);
    float nDotL = max(dot(lightDirectionNor, normal), 0.0);

    float lightR = distance(vec3(u_ModelMatrix * a_Position), u_LightDirection);

    float lightIntensByPos = u_LightIntensity / (lightR * lightR);

    vec3 diffuse = a_Color.rgb * u_LightColor * lightIntensByPos  * nDotL;

    vec3 ambient = u_AmbientLight * a_Color.rgb;

    v_Color = vec4(diffuse + ambient, a_Color.a);
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
