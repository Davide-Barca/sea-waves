uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogIntensity;

varying float vElevation;
varying float v_fogDepth;
varying vec2 vUv;

void main(){
    float mixStrength = vElevation * uColorMultiplier + uColorOffset;
    vec3 colorMixed = mix(uDepthColor,uSurfaceColor, mixStrength);

    // float fogAmount = smoothstep(1.0, 0.0, 2.0);

    // float fogDistance = (length(vUv - 0.5) - 0.25) * uFogIntensity;
    // float fogDistance = (distance(vUv, vec2(0.5)) - 0.25) * uFogIntensity;
    float fogDistance = (max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)) * 0.5) * uFogIntensity;
    
    vec4 color = vec4(colorMixed, 1.0);
    vec4 fogColor = vec4(uFogColor, 0.5);
    gl_FragColor = mix(color, fogColor, fogDistance); // mix(color, fogColor, fogDistance)
}