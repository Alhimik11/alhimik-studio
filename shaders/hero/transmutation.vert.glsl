attribute float aIndex;
attribute float aSeed;

uniform float uTime;
uniform float uProgress;
uniform float uCount;

varying float vMix;
varying float vAlpha;

const float TAU = 6.28318530718;

vec3 lissajous(float t, float seed, float amount) {
  float spiral = 0.5 + amount * 1.55;
  float x = sin(t * 2.4 + seed * 3.2) * spiral;
  float y = sin(t * 3.6 + seed * 2.1 + 1.2) * spiral * 0.74;
  float z = cos(t * 2.1 + seed * 4.1) * (0.45 + amount * 0.9);
  return vec3(x, y, z);
}

vec3 phiSymbol(float indexNorm) {
  if (indexNorm < 0.64) {
    float a = (indexNorm / 0.64) * TAU;
    return vec3(cos(a) * 1.1, sin(a) * 1.1, 0.0);
  }

  float lineN = (indexNorm - 0.64) / 0.36;
  return vec3(0.0, mix(-1.35, 1.35, lineN), 0.0);
}

void main() {
  float progress = clamp(uProgress, 0.0, 1.0);
  float indexNorm = aIndex / max(1.0, uCount - 1.0);
  float phase = uTime * 0.85 + indexNorm * TAU * 2.0 + aSeed * 5.0;

  float activeMix = smoothstep(0.7, 0.9, progress);
  vec3 startPos = lissajous(phase, aSeed, activeMix);
  vec3 spin = vec3(
    cos(phase + aSeed) * 0.25,
    sin(phase * 0.8 + aSeed) * 0.2,
    sin(phase + indexNorm * 1.7) * 0.22
  );

  vec3 orbitPos = startPos + spin * activeMix;
  vec3 phiPos = phiSymbol(indexNorm);
  float phiMix = smoothstep(0.95, 1.0, progress);
  vec3 finalPos = mix(orbitPos, phiPos, phiMix);

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pointSize = mix(8.0, 12.0, fract(indexNorm * 13.17 + aSeed));
  gl_PointSize = pointSize * (1.35 / max(0.8, -mvPosition.z));

  vMix = smoothstep(0.7, 1.0, progress);
  vAlpha = smoothstep(0.68, 0.74, progress);
}
