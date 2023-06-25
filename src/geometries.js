import { 
    TextureLoader,
    BoxGeometry,
    PlaneGeometry,
    TetrahedronGeometry,
    MeshStandardMaterial,
    MeshPhongMaterial,
    Mesh,
    DoubleSide,
    ShaderMaterial,
} from "three"

import { scene } from "./scene.js"

const vs = `
varying vec2 vUV;

void main() {
    vec2 vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fs = `
uniform float time;
varying vec2 vUV;

void main(){
    float st = sin(time);
    float ct = cos(time);
    float ast = min(ct, st);
    vec3 col = vec3(st, ct, st);
    float pulse = smoothstep(.28, .3, vUV.y);
    col += pulse;
    gl_FragColor = vec4(col, 1.0);
}
`

const customMaterial = new ShaderMaterial({
    uniforms: {
        time: {value: 0.0}
    },

    vertexShader:  vs,

    fragmentShader: fs

})

const textureLoader = new TextureLoader()
const texture = textureLoader.load('../textures/colors.png')
const texture2 = textureLoader.load('../textures/crate.png')

const material3 = new MeshPhongMaterial({ color: "skyblue", emissive: 0x143542, specular: 0xffffff, shininess: 5})

const cubeGeo = new BoxGeometry(1,1,1)
const material1 = new MeshStandardMaterial({ map: texture2})
const cube = new Mesh(cubeGeo, customMaterial)

cube.castShadow = true
cube.position.x -=1
cube.position.z -=1

const planeGeo = new PlaneGeometry(10,10)
const material2 = new MeshStandardMaterial({map: texture})
const plane = new Mesh(planeGeo, material2)

plane.matrixAutoUpdate = false
plane.receiveShadow = true
plane.position.z = -1
plane.position.y = -1.5
plane.rotation.set(-1.2,0,.1)
plane.updateMatrix()

const tetraGeo = new TetrahedronGeometry(1,0)
const tetra = new Mesh(tetraGeo, material3)

tetra.castShadow = true

tetra.position.x = 2
tetra.position.z = 1.5

scene.add(cube, plane, tetra)

export {cube, tetra, customMaterial}