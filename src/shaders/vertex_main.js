export default `
vUv = uv;
vUv *= 10.;
vUv.y += uTime;
vec2 gv = fract(vUv)-.5;
vec2 id = floor(vUv);

float n = Hash21(id);
float width = .25;
if(n<.5) gv.x *= -1.;
float d = abs(abs(gv.x + gv.y)-.5);
float mask = abs(smoothstep(.01, -.01, d - width));

float displacement = mask * .4;
transformed += normalize( objectNormal ) * displacement;
`