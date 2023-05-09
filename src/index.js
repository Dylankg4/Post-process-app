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
    import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass.js"
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
    
    import { GUI } from "dat.gui";

    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

    import { cube, plane, tetra } from "./geometries";

    //Setup Functions
    const clock = new Clock()
    const scene = new Scene()
    scene.background = new Color(0x6699CC)
    
    const aspect = window.innerWidth / window.innerHeight

    let pixelRender, halftoneRender, normalRender, currentPass,renderPass;
    let params;
    let pixelCamera, halftoneCamera, normalCamera, camera;
    const state = {
        mode: 'Halftone',
        options: {
            pixel: true,
            halftone: false,
            noProcess: false,
        },
    }


    renderPass = new RenderPass(scene, camera)
    pixelCamera = new OrthographicCamera(-aspect, aspect, 1, -1, .1, 100)
    pixelCamera.position.set(0,0,15)
    //Set zoom on camera
    pixelCamera.zoom = .2
    pixelCamera.updateProjectionMatrix()

    camera = pixelCamera

    pixelRender = new RenderPixelatedPass(3, scene, camera )
    pixelRender.normalEdgeStrength = .1
    pixelRender.depthEdgeStrength = .1

    const pixelObj = {
        camera: pixelCamera,
        render: pixelRender,
    }

    halftoneCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 200)
    halftoneCamera.position.set(0,0,15)
    halftoneCamera.updateProjectionMatrix()

    params = {shape: 1,
        radius: 4,
        rotateR: Math.PI / 12,
        rotateB: Math.PI / 12*2,
        rotateG: Math.PI / 12*3,
        scatter: 0,
        blending: 1,
        blendingMode: 1,
        greyscale: false,
        disable: false
    }
    halftoneRender = new HalftonePass(window.innerWidth, window.innerHeight, params)
    console.log(halftoneRender, pixelRender)
    const halftoneObj = {
        camera: halftoneCamera,
        render: halftoneRender,
    }

    renderPass = new RenderPass(scene, camera)

    const gui = new GUI()
    gui.add(state, 'mode', ['Pixel', 'Halftone', 'No-process']).name('Render').onChange((mode)=>{
        changeRender(mode)
    })
    let pixelFolder = gui.addFolder("Pixel Render")
    let halftoneFolder = gui.addFolder("Halftone")
    let noProcessFolder = gui.addFolder("No process")

    //Renderer ***
    const renderer = new WebGLRenderer({ antialias: true })
    
    renderer.physicallyCorrectLights = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    //Orbit controls. Once initilaized it is not necessary to use elsewhere in code.
    const controls = new OrbitControls(camera, renderer.domElement)

    //Post processing
    const composer =  new EffectComposer(renderer)

    composer.addPass(renderPass)
    console.log(renderPass)

    /* Not currently being used
    const depthTexture = new DepthTexture()
    const renderTarget = new WebGL3DRenderTarget( window.innerWidth, window.innerHeight, {
        depthTexture: depthTexture,
        depthBuffer: true,
    }
    ) */

    function changeRender(mode) {
        state.mode = `${mode}`
        switch(state.mode){
            case 'Pixel':
                state.pixel = true
                state.halftone = false
                state.noProcess = false
                pixelState()
                break
            case 'Halftone':
                state.pixel = false
                state.halftone = true
                state.noProcess = false
                halftoneState()
                break
            case 'No-process':
                state.pixel = false
                state.halftone = false
                state.noProcess = true
                break
        }
    }


    function pixelState(){
        //pixelFolder.open()
        composer.removePass(currentPass)

        currentPass = pixelObj.render
        camera = pixelObj.camera
        renderPass.camera = camera
        
        controls.object = camera

        pixelFolder.add(currentPass, 'pixelSize', 1, 16, 1).name("Pixel Size").onChange((change)=> {
            currentPass.setPixelSize(change)
        })
        pixelFolder.add(currentPass, 'normalEdgeStrength', .1, 1, .05).name("Normal")
        pixelFolder.add(currentPass, 'depthEdgeStrength', .1, 2, .05).name("Depth")
        
        composer.addPass(currentPass)
    }

    function halftoneState(){
        composer.removePass(currentPass)

        currentPass = halftoneObj.render
        camera = halftoneObj.camera
        renderPass.camera = camera
        
        controls.object = camera
        console.log(controls.object)

        halftoneFolder.add(currentPass.uniforms, 'shape', {'Dot':1, 'Ellipse':2})

        composer.addPass(currentPass)
    }
    
    changeRender(state.mode)
    

    const container = document.getElementById('scene-container')
    container.append(renderer.domElement)
    
    // Lights ******
    const ambientLight = new AmbientLight(0x404040, 20)

    const spotLight = new SpotLight('orange', 40, 0, 1.1, 1, 1.5)
    spotLight.position.set(2,4,1)
    //spotLight.target = tetra
    spotLight.castShadow = true
    
    //Add all neccesary objects to scene
    scene.add(cube, tetra, plane, spotLight, ambientLight)

    let amount = 0
    let moved = false

    //List of things that will update during animation
    function updateables(delta){
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
