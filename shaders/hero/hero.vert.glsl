varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;

#pragma glslify: snoise = require('glsl-noise/simplex/3d')

void main() {
  vUv = uv;

  vec3 pos = position;
  float noiseWave = snoise(vec3(position.xy * 1.35, uTime * 0.22));

  float mouseMask = 1.0 - smoothstep(
    0.0,
    0.65,
    distance(vUv, uMouse)
  );

  pos += normal * (noiseWave * 0.28 + mouseMask * 0.24);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
