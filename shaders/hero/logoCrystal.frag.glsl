varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);

  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
  float shimmer = sin((vWorldPosition.y + vWorldPosition.x) * 11.0 + uTime * 2.6) * 0.5 + 0.5;

  vec3 baseColor = mix(uColorA, uColorB, shimmer * 0.65);

  float dispersionR = fresnel * 0.34;
  float dispersionB = fresnel * 0.52;
  vec3 dispersed = vec3(
    baseColor.r + dispersionR,
    baseColor.g + fresnel * 0.23,
    baseColor.b + dispersionB
  );

  float alpha = 0.48 + fresnel * 0.42;
  gl_FragColor = vec4(dispersed, alpha);
}
