//import Stats from "stats.js";
import Stats from "three/examples/jsm/libs/stats.module.js"
import { WebGLRenderer, Clock } from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { gui, folders, state } from "./gui.js";
import { scene } from "./scene.js";
import  { pixelPass } from "./passes/pixelPass.js"
import { halftonePass } from "./passes/halftonePass.js";
import orthographicCamera from "./cameras/orthographicCamera.js"
import perspectiveCamera  from "./cameras/perspectiveCamera.js";
import addLights from "./lights.js";
import { cube, tetra, customMaterial } from "./geometries";


let amount, moved;

const stats = new Stats()
stats.showPanel( 0 )
document.body.appendChild(stats.dom)

const clock = new Clock()

const pixelObj = {
    camera : orthographicCamera,
    pass : pixelPass,
    folder: folders[0],
}

const halftoneObj = {
    camera: perspectiveCamera,
    pass: halftonePass,
    folder: folders[1],
}

const renderPass = new RenderPass(scene, perspectiveCamera)

const renderer = new WebGLRenderer()
renderer.useLegacyLights = false
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true

const container = document.getElementById('scene-container')
container.append(renderer.domElement)

gui.add(state, 'mode', ['Pixel', 'Halftone', 'No-process']).name('Render').onChange((mode)=>{
    changeState(mode)
})

addLights()

//Orbit controls.****
const controls = new OrbitControls(perspectiveCamera, renderer.domElement)
//Composer.****
const composer =  new EffectComposer(renderer)
composer.addPass(renderPass)

/* Not currently being used
const depthTexture = new DepthTexture()
const renderTarget = new WebGL3DRenderTarget( window.innerWidth, window.innerHeight, {
    depthTexture: depthTexture,
    depthBuffer: true,
}
) */

function changeState(mode) {
    state.mode = `${mode}`
    switch(state.mode){
        case 'Pixel':
            halftoneObj.folder.close()
            halftoneObj.folder.domElement.style.pointerEvents = 'none'
            pixelObj.folder.open()
            pixelObj.folder.domElement.style.pointerEvents = 'auto';

            composer.removePass(composer.passes[1])
            controls.object = pixelObj.camera
            composer.addPass(pixelObj.pass)
            break
        case 'Halftone':
            pixelObj.folder.close()
            pixelObj.folder.domElement.style.pointerEvents = 'none';
            halftoneObj.folder.open()
            halftoneObj.folder.domElement.style.pointerEvents = 'auto';
            
            composer.removePass(composer.passes[1])
            controls.object = halftoneObj.camera
            composer.addPass(halftoneObj.pass)
            break
        case 'No-process':
            halftoneObj.folder.close()
            halftoneObj.folder.domElement.style.pointerEvents = 'none'
            pixelObj.folder.close()
            pixelObj.folder.domElement.style.pointerEvents = 'none';

            composer.removePass(composer.passes[1])
            controls.object = halftoneObj.camera
            break
    }
}

changeState(state.mode)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})

amount = 0
moved = false

//List of things that will update during animation
function updateables(delta){
    customMaterial.uniforms.time.value = clock.getElapsedTime()

    const move = delta * .5
    cube.rotateZ(move)
    cube.rotateY(move)
    cube.rotateX(move)
    tetra.rotateY(move)
    if(moved){
        tetra.position.y -= move
        amount -= .5 * delta
    } else {
        amount += .5 * delta
        tetra.position.y += move
        
    }
    if(amount <= -1.5) moved = false
    if(amount >= 1.5) moved = true
}

function animate(){
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    updateables(delta)
    composer.render()
    stats.update()
}

animate()
