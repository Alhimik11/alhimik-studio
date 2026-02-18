uniform vec3 uColorGold;
uniform vec3 uColorViolet;

varying float vMix;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);

  float core = smoothstep(0.45, 0.0, dist);
  float halo = smoothstep(0.65, 0.1, dist) * 0.55;
  float alpha = (core + halo) * vAlpha;

  if (alpha <= 0.01) {
    discard;
  }

  vec3 color = mix(uColorGold, uColorViolet, vMix);
  color += mix(vec3(0.28, 0.18, 0.1), vec3(0.15, 0.1, 0.28), vMix) * halo;
  gl_FragColor = vec4(color, alpha);
}
