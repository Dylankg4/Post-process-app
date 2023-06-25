import { OrthographicCamera } from "three"

//Orthographic camera used for pixel pass
const aspect = window.innerWidth / window.innerHeight

let orthographicCamera = new OrthographicCamera(-aspect, aspect, 1, -1, 1, 30)
orthographicCamera.position.set(0,0,15)
orthographicCamera.zoom = .2
orthographicCamera.updateProjectionMatrix()

export default orthographicCamera