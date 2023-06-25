import { PerspectiveCamera } from "three"

//Perspective camera used for the halftone and no process passes
let perspectiveCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 30)
//perspectiveCamera.antialias = true
perspectiveCamera.position.set(0,0,15)
perspectiveCamera.updateProjectionMatrix()

export default perspectiveCamera 