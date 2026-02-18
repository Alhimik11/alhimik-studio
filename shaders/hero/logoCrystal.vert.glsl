varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform float uTime;

void main() {
  vec3 displaced = position;
  float wobble = sin(position.y * 4.0 + uTime * 1.35) * 0.01;
  displaced += normal * wobble;

  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
