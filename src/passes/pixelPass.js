import{ RenderPixelatedPass } from "three/examples/jsm/postprocessing/RenderPixelatedPass.js"

import  orthographicCamera  from "../cameras/orthographicCamera" 
import { scene } from "../scene"

let pixelPass = new RenderPixelatedPass(3, scene, orthographicCamera)
pixelPass.normalEdgeStrength = .1
pixelPass.depthEdgeStrength = .1

const pixelController = {
normalEdgeStrength: pixelPass.normalEdgeStrength,
depthEdgeStrength: pixelPass.depthEdgeStrength,
pixelSize: pixelPass.pixelSize,
}

function pixelGui() {
    pixelPass.normalEdgeStrength = pixelController.normalEdgeStrength
    pixelPass.depthEdgeStrength = pixelController.depthEdgeStrength
    pixelPass.setPixelSize(pixelController.pixelSize)
}

export { pixelPass, pixelGui, pixelController }