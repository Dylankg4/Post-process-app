import { 
    TextureLoader,
    BoxGeometry,
    IcosahedronGeometry,
    PlaneGeometry,
    TetrahedronGeometry,
    MeshStandardMaterial,
    MeshPhongMaterial,
    Mesh,
    DoubleSide,
    ShaderMaterial,
    UniformsUtils,
    UniformsLib,
    Vector3,
} from "three"

import {ambientLight, spotLight} from "./lights.js"
import colors from "./textures/colors.png"

import vertexPars from "./shaders/vertex_pars.js"
import vertexMain from "./shaders/vertex_main.js"
import fragmentPars from "./shaders/fragment_pars.js"
import fragmentMain from "./shaders/fragment_main.js"

import { scene } from "./scene.js"


const vs = `
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 ambientColor;
uniform float ambientIntensity;
uniform float uTime;

varying float vMask;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec3 vLightDir;

float Hash21(vec2 p){
    p = fract(p * vec2(234.34,435.345));
    p += dot(p, p+34.23);
    return fract(p.x*p.y);
}

void main() {
    vec2 vUv = uv;

    vUv *= 10.;
    vUv.y += uTime;
    vec2 gv = fract(vUv)-.5;
    vec2 id = floor(vUv);

    float n = Hash21(id);
    float width = .25;
    if(n<.5) gv.x *= -1.;
    float d = abs(abs(gv.x + gv.y)-.5);
    vMask = abs(smoothstep(.01, -.01, d - width));

    float displacement = vMask *= .4;
    vec3 newPosition = position + normal * vMask;

    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize((modelViewMatrix * vec4(newPosition, 1.0)).xyz);
    vLightDir = normalize(lightPosition - (modelMatrix * vec4(newPosition, 1.0)).xyz);

    //output
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( newPosition, 1.0 );
}
`
const fs = `
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 ambientColor;
uniform float ambientIntensity;
uniform float uTime;

varying float vMask;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec3 vLightDir;

void main(){
    float s = sin(uTime);
    float c = cos(uTime);
    vec3 col = vec3(0., s * .2, c * .8);

    float diffuse = max(dot(vNormal, vLightDir), 0.);
    col += diffuse * lightColor * lightIntensity;
    col += ambientColor * ambientIntensity;

    col += vMask;

    gl_FragColor = vec4(col, 1.0);
}
`

// lights: true - requires manually adding of all uniforms to function. merging custom unforms and the new lights uniforms is the most pain free.
const lightPos = new Vector3(2,4,1)
const customUniforms = {
    uTime: {value: 0.0},
    lightPosition: { value: lightPos },
    lightColor: { value: spotLight.color },
    lightIntensity: {value: 0.5},
    ambientColor: {value: ambientLight.color },
    ambientIntensity: {value: 0.2 },
}
const mergedUniforms = UniformsUtils.merge([
    UniformsLib.lights,
    customUniforms,
])
const mat = new ShaderMaterial({
    uniforms: mergedUniforms, 

    vertexShader: vs,

    fragmentShader: fs,

    lights: true,

}) 

const customMaterial = new MeshStandardMaterial({
    onBeforeCompile: (shader) => {
        customMaterial.userData.shader = shader
        shader.uniforms.uTime = {value:0}
        
        const parseVetrexString = `#include <displacementmap_pars_vertex>`
        shader.vertexShader = shader.vertexShader.replace(parseVetrexString, parseVetrexString+ vertexPars)
        const mainVertexString = `#include <displacementmap_vertex>`
        shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + vertexMain)

        const parseFragmentString = `#include <color_pars_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(parseFragmentString, parseFragmentString + fragmentPars)
        const mainFragmentString = `#include <color_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + fragmentMain)
    }
})

/*const parseFragmentString = `#include <color_pars_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(parseFragmentString, parseFragmentString + fragmentPars)
        const mainFragmentString = `#include <color_fragment>`
        shader.fragmentShader = shader.fragmentShader.replace(mainFragmentString, mainFragmentString + fragmentMain)
        console.log(shader.fragmentShader)*/

const textureLoader = new TextureLoader()
const texture = textureLoader.load(colors)
const material1 = new MeshStandardMaterial({map: texture})
const material2 = new MeshPhongMaterial({ color: "skyblue", emissive: 0x143542, specular: 0xffffff, shininess: 5})

const cubeGeo = new BoxGeometry(1,1,1)
const sphereGeo = new IcosahedronGeometry(1, 100)
const sphere = new Mesh(sphereGeo, mat)

sphere.castShadow = true
sphere.position.x -=1.5
sphere.position.z -=1
sphere.position.y +=1

const planeGeo = new PlaneGeometry(10,10)
const plane = new Mesh(planeGeo, material1)

plane.matrixAutoUpdate = false
plane.receiveShadow = true
plane.position.z = -1
plane.position.y = -1.5
plane.rotation.set(-1.2,0,.1)
plane.updateMatrix()

const tetraGeo = new TetrahedronGeometry(1,0)
const tetra = new Mesh(tetraGeo, material2)

tetra.castShadow = true

tetra.position.x = 2
tetra.position.z = 1

scene.add(sphere, plane, tetra)

export {sphere, tetra, customMaterial, mat}