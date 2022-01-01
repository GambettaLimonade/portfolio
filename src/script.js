import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//MOdels

const gltfLoader = new GLTFLoader()
let mixer = null
var character_walk;
let arrow = {};

gltfLoader.load(
    '/models/Soldier.glb',
    (gltf) =>
    {
        character_walk = gltf.scene
        scene.add(character_walk)
        mixer = new THREE.AnimationMixer(character_walk)
        mixer.clipAction(gltf.animations[0])

        gltf.scene.scale.set(2, 2, 2)

        var lastUpdate = Date.now();
        var repeating = false;
        var repeatRateTimer = null;

        document.addEventListener('keydown', (event) => {
            // if( repeating == true )
            // {
            //     var now = Date.now();
            //     var dt = now - lastUpdate;
            //     if(dt >= 900)
            //     {
            //         lastUpdate = now;
            //         arrow[event.key] = true;
            //         move_character(arrow)
            //         console.log(dt) 
            //     }

        
            // }
            // else
            // {
                arrow[event.key] = true;

            // }
            // repeating = true;

         }, false);

         document.addEventListener('keyup', (event) => {
            delete arrow[event.key];
            // if( repeatRateTimer != null )
            // {
            //     clearTimeout( repeatRateTimer );
            //     repeatRateTimer = null;
            // }
            // repeating = false;
        }, false);   
    })



let angle = 0;            
function move_character() {
    if (Object.keys(arrow).length !== 0){
    
    arrow = arrow || window.event;
    
    var avancer = arrow['ArrowUp'] ? 1 : 0;
    var tourner = (arrow['ArrowLeft']) ? 1 : (arrow['ArrowRight']) ? -1 : 0;

    // mixer = new THREE.AnimationMixer(character_walk)
    // var action = mixer.clipAction(gltf.animations[1]);
    // action.setLoop( THREE.LoopOnce );
    character_walk.position.x = character_walk.position.x - Math.sin(angle) * avancer
    character_walk.position.z = character_walk.position.z - Math.cos(angle) * avancer
    
    character_walk.rotation.y = character_walk.rotation.y + (Math.PI/8) * tourner
    angle = character_walk.rotation.y  

    }
}


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)




/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000'
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)

cube.position.set(4, 3, 0)

// sphere
const sphereGeo = new THREE.SphereBufferGeometry(1, 1, 1)
const sphereMat = new THREE.MeshBasicMaterial({
    color: '#00ff00'
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphere)

sphere.position.set(-4, 3, 0)


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.set(0, 6, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(4, 10, 0)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0




const tick = () =>
{
    move_character(arrow)


    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //update mixer
    if(mixer !== null)
    {
        mixer.update(deltaTime)
    }
    
    if (character_walk)
    {
        controls.target.set(character_walk.position.x,character_walk.position.y,character_walk.position.z)
        camera.position.x = character_walk.position.x + 10
        camera.position.z = character_walk.position.z + 10
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()