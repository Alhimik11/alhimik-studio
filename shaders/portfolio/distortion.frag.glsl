varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float uHover;

void main() {
  vec2 disp = texture2D(uDisplacement, vUv).rg * 2.0 - 1.0;
  vec2 uv = vUv + disp * 0.085 * uHover;

  float chroma = 0.008 * uHover;
  vec4 r = texture2D(uTexture, uv + vec2(chroma, 0.0));
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - vec2(chroma, 0.0));

  vec3 color = vec3(r.r, g.g, b.b);
  color = mix(color, vec3(0.95, 0.6, 0.22), uHover * 0.11);

  gl_FragColor = vec4(color, 1.0);
}
