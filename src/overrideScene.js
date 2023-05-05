import { MeshNormalMaterial } from "three";

export function overrideScene(scene, renderer, camera){
    //Overide and get NORMAL output
    //Not currently used
    scene.overrideMaterial = new MeshNormalMaterial()
    renderer.render(scene, camera)
    scene.overrideMaterial = null
}