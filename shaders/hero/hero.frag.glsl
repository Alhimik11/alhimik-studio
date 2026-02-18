varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;

#pragma glslify: snoise = require('glsl-noise/simplex/3d')

void main() {
  float waveA = snoise(vec3(vUv * 4.2, uTime * 0.1));
  float waveB = snoise(vec3(vUv * 9.1, uTime * 0.18));
  float distToMouse = distance(vUv, uMouse);

  float ripple = sin((distToMouse * 38.0) - (uTime * 7.2)) * 0.5 + 0.5;
  float liquid = smoothstep(-0.65, 0.85, waveA + waveB * 0.45 + ripple * 0.28);

  vec3 deep = vec3(0.02, 0.06, 0.11);
  vec3 cyan = vec3(0.0, 0.78, 1.0);
  vec3 copper = vec3(0.95, 0.56, 0.18);

  vec3 color = mix(deep, cyan, liquid);
  color = mix(color, copper, smoothstep(0.6, 1.0, ripple) * 0.46);

  float vignette = smoothstep(0.95, 0.2, distance(vUv, vec2(0.5)));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
