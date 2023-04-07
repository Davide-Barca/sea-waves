uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying float v_fogDepth;
varying vec2 vUv;

void main(){
    float mixStrength = vElevation * uColorMultiplier + uColorOffset;
    vec3 colorMixed = mix(uDepthColor,uSurfaceColor, mixStrength);

    // float fogAmount = smoothstep(1.0, 0.0, 2.0);

    // float strength = length(vUv - 0.5);
    float fogDistance = (distance(vUv, vec2(0.5)) - 0.25) * 3.0;
    
    vec4 color = vec4(colorMixed, 1.0);
    gl_FragColor = mix(color, vec4(vec3(0.0), 0.5), fogDistance); // mix(color, fogColor, fogDistance)
}