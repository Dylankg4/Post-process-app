import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass.js"

const params = {shape: 1,
    radius: 5,
    rotateR: Math.PI / 12,
    rotateB: Math.PI / 12*2,
    rotateG: Math.PI / 12*3,
    scatter: 0,
    blending: 1,
    blendingMode: 1,
    greyscale: false,
    disable: false
}

const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params)

const halftoneController = {
    shape: halftonePass.uniforms['shape'].value,
    radius: halftonePass.uniforms[ 'radius' ].value,
    rotateR: halftonePass.uniforms[ 'rotateR' ].value / ( Math.PI / 180 ),
    rotateG: halftonePass.uniforms[ 'rotateG' ].value / ( Math.PI / 180 ),
    rotateB: halftonePass.uniforms[ 'rotateB' ].value / ( Math.PI / 180 ),
    scatter: halftonePass.uniforms[ 'scatter' ].value,
    greyscale: halftonePass.uniforms[ 'greyscale' ].value,
    blending: halftonePass.uniforms[ 'blending' ].value,
    blendingMode: halftonePass.uniforms[ 'blendingMode' ].value,
    disable: halftonePass.uniforms[ 'disable' ].value,
}

function halftoneGui(){
    halftonePass.uniforms[ 'shape' ].value = halftoneController.shape
    halftonePass.uniforms[ 'radius' ].value = halftoneController.radius
    halftonePass.uniforms[ 'rotateR' ].value = halftoneController.rotateR * ( Math.PI / 180 )
    halftonePass.uniforms[ 'rotateG' ].value = halftoneController.rotateG * ( Math.PI / 180 )
    halftonePass.uniforms[ 'rotateB' ].value = halftoneController.rotateB * ( Math.PI / 180 )
    halftonePass.uniforms[ 'scatter' ].value = halftoneController.scatter
    halftonePass.uniforms[ 'greyscale' ].value = halftoneController.greyscale
    halftonePass.uniforms[ 'blending' ].value = halftoneController.blending
    halftonePass.uniforms[ 'blendingMode' ].value = halftoneController.blendingMode
    halftonePass.uniforms[ 'disable' ].value = halftoneController.disable
}

console.log(halftonePass, halftoneGui, halftoneController)
export {halftonePass, halftoneController, halftoneGui}