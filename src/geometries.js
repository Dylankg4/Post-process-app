import { 
    TextureLoader,
    BoxGeometry,
    PlaneGeometry,
    TetrahedronGeometry,
    MeshStandardMaterial,
    MeshPhongMaterial,
    Mesh,
    DoubleSide,
} from "three"

const textureLoader = new TextureLoader()
const texture = textureLoader.load('../textures/colors.png')
const texture2 = textureLoader.load('../textures/crate.png')

const material3 = new MeshPhongMaterial({ color: "skyblue", emissive: 0x143542, specular: 0xffffff, shininess: 5})

const cubeGeo = new BoxGeometry(1,1,1)
const material1 = new MeshStandardMaterial({ map: texture2})
const cube = new Mesh(cubeGeo, material1)

cube.castShadow = true
cube.position.x -=1
cube.position.z -=1

const planeGeo = new PlaneGeometry(10,10)
const material2 = new MeshStandardMaterial({map: texture, side: DoubleSide})
const plane = new Mesh(planeGeo, material2)

plane.receiveShadow = true
plane.position.z = -1
plane.position.y = -1.5
plane.rotation.set(-1.2,0,.1)

const tetraGeo = new TetrahedronGeometry(1,0)
const tetra = new Mesh(tetraGeo, material3)

tetra.castShadow = true

tetra.position.x = 2
tetra.position.z = 1.5

export {cube, plane, tetra}