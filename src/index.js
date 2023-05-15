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

    let pixelPass, halftonePass, currentPass, renderPass;
    let orthographicCamera, perspectiveCamera, camera;
    let halftoneFolder, pixelFolder
    let params;
    const state = {
        mode: 'No-process',
        options: {
            pixel: true,
            halftone: false,
            noProcess: false,
        },
    }

    //Perspective camera used for the halftone and no process passes
    perspectiveCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 200)
    perspectiveCamera.position.set(0,0,15)
    perspectiveCamera.updateProjectionMatrix()

    params = {shape: 1,
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

    halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params)
    
    const halftoneObj = {
        camera: perspectiveCamera,
        pass: halftonePass,
    }

    const controller = {
        shape: halftonePass.uniforms['shape'].value,
        radius: halftonePass.uniforms[ 'radius' ].value,
        rotateR: halftonePass.uniforms[ 'rotateR' ].value / ( Math.PI / 180 ),
        rotateG: halftonePass.uniforms[ 'rotateG' ].value / ( Math.PI / 180 ),
        rotateB: halftonePass.uniforms[ 'rotateB' ].value / ( Math.PI / 180 ),
        scatter: halftonePass.uniforms[ 'scatter' ].value,
        greyscale: halftonePass.uniforms[ 'greyscale' ].value,
        blending: halftonePass.uniforms[ 'blending' ].value,
        blendingMode: halftonePass.uniforms[ 'blendingMode' ].value,
        disable: halftonePass.uniforms[ 'disable' ].value
    }

    renderPass = new RenderPass(scene, camera)

    //Orthographic camera usedee for pixel pass
    orthographicCamera = new OrthographicCamera(-aspect, aspect, 1, -1, .1, 100)
    orthographicCamera.position.set(0,0,15)
    orthographicCamera.zoom = .2
    orthographicCamera.updateProjectionMatrix()

    camera = orthographicCamera

    pixelPass = new RenderPixelatedPass(3, scene, camera )
    pixelPass.normalEdgeStrength = .1
    pixelPass.depthEdgeStrength = .1

    const pixelObj = {
        camera: orthographicCamera,
        pass: pixelPass,
    }

    renderPass = new RenderPass(scene, perspectiveCamera)

    const gui = new GUI()
    gui.add(state, 'mode', ['Pixel', 'Halftone', 'No-process']).name('Render').onChange((mode)=>{
        changeRender(mode)
    })

    pixelFolder = gui.addFolder("Pixelated")
    halftoneFolder = gui.addFolder("Halftone")

    pixelFolder.close()
    pixelFolder.domElement.style.pointerEvents = 'none';

    halftoneFolder.add(controller, 'shape', {'Dot': 1, 'Ellipse': 2, 'Line': 3, 'Square': 4}).onChange( halftoneGui )
    halftoneFolder.add(controller, 'radius', 1, 25).onChange( halftoneGui )
    halftoneFolder.add(controller, 'rotateR', 0, 90).onChange( halftoneGui )
    halftoneFolder.add(controller, 'rotateG', 0, 90).onChange( halftoneGui )
    halftoneFolder.add(controller, 'rotateB', 0, 90).onChange( halftoneGui )
    halftoneFolder.add(controller, 'greyscale').onChange( halftoneGui )
    halftoneFolder.add(controller, 'blending', 0, 1, .01).onChange( halftoneGui )
    halftoneFolder.add(controller, 'blendingMode', { 'Linear': 1, 'Multiply': 2, 'Add': 3, 'Lighter': 4, 'Darker':5}).onChange( halftoneGui )
    halftoneFolder.add(controller, 'disable').onChange( halftoneGui )

    halftoneFolder.close()
    halftoneFolder.domElement.style.pointerEvents = 'none'

    //Renderer ***
    const renderer = new WebGLRenderer({ antialias: true })
    
    renderer.physicallyCorrectLights = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    //Orbit controls. Once initilaized it is not necessary to use elsewhere in code.
    const controls = new OrbitControls(perspectiveCamera, renderer.domElement)

    const composer =  new EffectComposer(renderer)
    composer.addPass(renderPass)

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
                noProcessState()
                break
        }
    }

    function noProcessState(){
        composer.removePass(currentPass)
        camera = halftoneObj.camera
        controls.object = halftoneObj.camera
        console.log(camera, controls)
    }

    function pixelState(){
        halftoneFolder.close()
        halftoneFolder.domElement.style.pointerEvents = 'none'

        pixelFolder.open()
        pixelFolder.domElement.style.pointerEvents = 'auto';

        composer.removePass(currentPass)
        
        currentPass = pixelObj.pass
        controls.object = pixelObj.camera

        pixelFolder.add(currentPass, 'pixelSize', 1, 16, 1).name("Pixel Size").onChange((change)=> {
            currentPass.setPixelSize(change)
        })
        pixelFolder.add(currentPass, 'normalEdgeStrength', .1, 1, .05).name("Normal")
        pixelFolder.add(currentPass, 'depthEdgeStrength', .1, 2, .05).name("Depth")
        
        composer.addPass(currentPass)
    }

    function halftoneGui(){
        halftonePass.uniforms[ 'radius' ].value = controller.radius
        halftonePass.uniforms[ 'rotateR' ].value = controller.rotateR * ( Math.PI / 180 )
        halftonePass.uniforms[ 'rotateG' ].value = controller.rotateG * ( Math.PI / 180 )
        halftonePass.uniforms[ 'rotateB' ].value = controller.rotateB * ( Math.PI / 180 )
        halftonePass.uniforms[ 'scatter' ].value = controller.scatter
        halftonePass.uniforms[ 'shape' ].value = controller.shape
        halftonePass.uniforms[ 'greyscale' ].value = controller.greyscale
        halftonePass.uniforms[ 'blending' ].value = controller.blending
        halftonePass.uniforms[ 'blendingMode' ].value = controller.blendingMode
        halftonePass.uniforms[ 'disable' ].value = controller.disable
    }

    function halftoneState(){
        pixelFolder.close()
        pixelFolder.domElement.style.pointerEvents = 'none';

        halftoneFolder.open()
        halftoneFolder.domElement.style.pointerEvents = 'auto';
        composer.removePass(currentPass)

        currentPass = halftoneObj.pass
        controls.object = halftoneObj.camera

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
    })

    function animate(){
        requestAnimationFrame(animate)
        const delta = clock.getDelta()
        updateables(delta)
        composer.render()
    }

    animate()
