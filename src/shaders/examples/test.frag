#ifdef GL_ES
precision mediump float;
#endif

vec3 u_LightPosition = vec3(0.5,.8,.1);

vec3 u_LightColor = vec3(1.0);
vec3 u_SpecularColor = vec3(1.0);
vec3 diffuse_color = vec3(0.5,0,0);
vec3 u_AmbientLight = vec3(0);

float u_LightIntensity = 1.0;
float u_SpecularPlot = 30.0;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec3 u_camera;

varying vec4 v_position;
varying vec4 v_normal;

vec3 halfVec = u_camera + u_LightPosition;

vec3 halfVecNor = normalize(halfVec);
vec3 lightNor = normalize(u_LightPosition);

void main() {

  vec3 normalNor = normalize(vec3(u_normalMatrix * v_normal));

  float nDotL = max(dot(lightNor, normalNor), 0.0);
  float nDotH = max(dot(halfVecNor, normalNor), 0.0);

  float lightR = distance(normalize(vec3(u_modelViewMatrix * v_position)), lightNor);

  float lightIntensByPos = u_LightIntensity / (lightR * lightR);

  vec3 diffuse = diffuse_color.rgb * u_LightColor * lightIntensByPos * nDotL;

  vec3 specular = u_SpecularColor * lightIntensByPos * pow(nDotH,u_SpecularPlot);

  vec3 ambient = u_AmbientLight * diffuse_color.rgb;

	gl_FragColor = vec4(diffuse + specular + ambient,1.0);
}
