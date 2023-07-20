import { AmbientLight, SpotLight } from "three";
import { scene } from "./scene.js";

const ambientLight = new AmbientLight(0x404040, 20)

const spotLight = new SpotLight('orange', 40, 0, 1.1, 1, 1.5)
spotLight.position.set(2,4,1)
spotLight.castShadow = true
spotLight.autoUpdate = false

scene.add( ambientLight, spotLight )

export  {
    ambientLight,
    spotLight,
}