import { GUI } from "dat.gui";

import { halftoneController, halftoneGui } from "./passes/halftonePass";
import { pixelController, pixelGui } from "./passes/pixelPass";

const state = {
    mode: 'No-process',
}

const gui = new GUI()

let pixelFolder = gui.addFolder("Pixelated")
pixelFolder.close()
pixelFolder.domElement.style.pointerEvents = 'none';


pixelFolder.add(pixelController, 'pixelSize', 1, 16, 1).name("Pixel Size").onChange(pixelGui)
pixelFolder.add(pixelController, 'normalEdgeStrength', .1, 1, .05).name("Normal").onChange(pixelGui)
pixelFolder.add(pixelController, 'depthEdgeStrength', .1, 2, .05).name("Depth").onChange(pixelGui)

let halftoneFolder = gui.addFolder("Halftone")
halftoneFolder.close()
halftoneFolder.domElement.style.pointerEvents = 'none'

halftoneFolder.add(halftoneController, 'shape', {'Dot': 1, 'Ellipse': 2, 'Line': 3, 'Square': 4}).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'radius', 1, 25).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'rotateR', 0, 90).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'rotateG', 0, 90).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'rotateB', 0, 90).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'greyscale').onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'blending', 0, 1, .01).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'blendingMode', { 'Linear': 1, 'Multiply': 2, 'Add': 3, 'Lighter': 4, 'Darker':5}).onChange( halftoneGui )
halftoneFolder.add(halftoneController, 'disable').onChange( halftoneGui )

let folders = [pixelFolder, halftoneFolder]

export { gui, folders, state }