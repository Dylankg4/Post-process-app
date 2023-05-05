import { 
    WebGLRenderer,
    PerspectiveCamera,
    OrthographicCamera,
    Scene,
    AmbientLight,
    SpotLight,
    Clock,
    DepthTexture,
    WebGL3DRenderTarget,
    ShaderMaterial,
    Color
    } from "three";

    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
    import{ RenderPixelatedPass } from "three/examples/jsm/postprocessing/RenderPixelatedPass.js"
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
    
    import { GUI } from "dat.gui";

    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

    import { cube, plane, tetra } from "./geometries";

    //Setup Functions
    const clock = new Clock()
    const scene = new Scene()
    scene.background = new Color(0x151729)
    //const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 200)
    const aspect = window.innerWidth / window.innerHeight
    const camera = new OrthographicCamera(-aspect, aspect, 1, -1, .1, 100)

    const gui = new GUI()

    /* Not currently being used
    const depthTexture = new DepthTexture()
    const renderTarget = new WebGL3DRenderTarget( window.innerWidth, window.innerHeight, {
        depthTexture: depthTexture,
        depthBuffer: true,
    }
    ) */
    

    //Renderer ***
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.physicallyCorrectLights = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    //Post processing
    const composer =  new EffectComposer(renderer)

    const renderPass = new RenderPixelatedPass(3, scene, camera )
    renderPass.normalEdgeStrength = .1
    renderPass.depthEdgeStrength = .1
    //Normal non pixelated renderpass
    //const renderPass = new RenderPass( scene, camera )

    composer.addPass(renderPass)


    //Orbit controls. Once initilaized it is not necessary to use elsewhere in code.
    const controls = new OrbitControls(camera, renderer.domElement)

    const container = document.getElementById('scene-container')
    container.append(renderer.domElement)
    
    // Lights ******
    const directionalLight = new AmbientLight(0x404040, 5)

    const spotLight = new SpotLight('yellow', 20)
    spotLight.position.set(2,3,1)
    spotLight.target = tetra
    spotLight.castShadow = true
    
    //Add all neccesary objects to scene
    scene.add(cube, tetra, plane, spotLight, directionalLight)
    camera.position.set(0,0,15)

    let amount = 0
    let moved = false


    gui.add(renderPass, 'normalEdgeStrength', .1, 1, .05).name("Normal")
    gui.add(renderPass, 'depthEdgeStrength', .1, 2, .05).name("Depth")

    //List of things that will update during animation
    function updateables(delta){
        const move = delta * .3
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
        if(amount <= 0) moved = false
        if(amount >= 1) moved = true
    }

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

        /*camera.left(-aspect)
        camera.right(aspect)
        camera.top(1)
        camera.bottom(-1)*/
    })

    function animate(){
        requestAnimationFrame(animate)
        const delta = clock.getDelta()
        updateables(delta)
        composer.render()
    }

    animate()
