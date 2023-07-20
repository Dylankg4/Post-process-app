export default `
uniform float uTime;
varying vec2 vUv;
varying float mask;

float Hash21(vec2 p){
    p = fract(p * vec2(234.34,435.345));
    p += dot(p, p+34.23);
    return fract(p.x*p.y);
}`