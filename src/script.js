

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

// Loader
const gltfLoader = new GLTFLoader()

let mixer = null
let mixer_n = null
let mixer_g = null
let mixer_s = null
var character_walk;
let arrow = {};
var character;
var action_avancer;
var action_tourner;

var g_walk;
var g;
var action_g;


var n_walk;
var n;
var action_n;

var s_walk;
var s;
var action_s;



// City
gltfLoader.load(
    '/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
        gltf.scene.position.set(0, 110, 0)
    }
)

// //Naruto
gltfLoader.load(
    '/models/hatch_naruto/scene.gltf',
    (gltf) =>
    {
        n_walk = gltf.scene
        scene.add(n_walk)

        gltf.scene.position.set(-450, -8, 550)
        gltf.scene.scale.set(30, 30, 30)

        n = gltf
        mixer_n = new THREE.AnimationMixer(n_walk)
        action_n = mixer_n.clipAction(n.animations[0])
    }
)


// //Sasuke
gltfLoader.load(
    '/models/rumba_dancing_sasuke/scene.gltf',
    (gltf) =>
    {
        s_walk = gltf.scene
        scene.add(s_walk)

        gltf.scene.position.set(-400, -8, 550)
        gltf.scene.scale.set(30, 30, 30)

        s = gltf
        mixer_s = new THREE.AnimationMixer(s_walk)
        action_s = mixer_s.clipAction(s.animations[0])
    }
)




//Goku
gltfLoader.load(
    '/models/goku_rigged__animated/scene.gltf',
    (gltf) =>
    {
        g_walk = gltf.scene
        scene.add(g_walk)

        gltf.scene.position.set(-580, -8, 500)
        gltf.scene.scale.set(20, 20, 20)

        g = gltf
        mixer_g = new THREE.AnimationMixer(g_walk)
        action_g = mixer_g.clipAction(g.animations[0])
    }
)

function move_goku(){
    if (g) action_g.play();
}

function move_naruto(){
    if (n) action_n.play()
}

function move_sasuke(){
    if (s) action_s.play();
}


//main Character
gltfLoader.load(
    '/models/Soldier.glb',
    (gltf) =>
    {
        character_walk = gltf.scene
        scene.add(character_walk)

        gltf.scene.position.set(-500, -8, 500)
        gltf.scene.scale.set(30, 30, 30)

       // console.log('main chara : ', gltf.scene)


        character = gltf
        mixer = new THREE.AnimationMixer(character_walk)
        action_avancer = mixer.clipAction(character.animations[1])
        action_tourner = mixer.clipAction(character.animations[0])
        
        document.addEventListener('keydown', (event) => {
                arrow[event.key] = true;
         }, false);

         document.addEventListener('keyup', (event) => {
            delete arrow[event.key];
            action_avancer.stop();
            action_tourner.stop();
        }, false);   
    })



let angle = 0;        
const vitesse = 3;    
const rotation = Math.PI/60 ;

function move_character() {
    if (Object.keys(arrow).length !== 0){
    
    arrow = arrow || window.event;
    
    var avancer = arrow['ArrowUp'] ? 1 : 0;
    var tourner = (arrow['ArrowLeft']) ? 1 : (arrow['ArrowRight']) ? -1 : 0;

    if (avancer) action_avancer.play()
    if (tourner) action_tourner.play()
    character_walk.position.x = character_walk.position.x - Math.sin(angle) * (avancer * vitesse)
    character_walk.position.z = character_walk.position.z - Math.cos(angle) * (avancer * vitesse)
    
    character_walk.rotation.y = character_walk.rotation.y + rotation * tourner
    angle = character_walk.rotation.y  

    }
}



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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.y = 100
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
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

    // if (idle) {
    //     console.log(idle)
    //     console.log(idle._clip)
    //     console.log(idle._clip.name)
    // }

    // if (goku) console.log('goku animation : ', goku.animations)
    // if (character_walk) console.log('main character animation : ', character_walk.animations)


    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    const distance = 170
    
    //update mixer
    if(mixer) mixer.update(deltaTime)
    if(mixer_s) mixer_s.update(deltaTime)
    if(mixer_g) mixer_g.update(deltaTime)
    if(mixer_n) mixer_n.update(deltaTime)

    if (n_walk) move_naruto();
    if (s_walk) move_sasuke();
    if (g_walk) move_goku();

    if (character_walk)
    {
        controls.target.set(character_walk.position.x,character_walk.position.y,character_walk.position.z)
        camera.position.x = character_walk.position.x + Math.sin(character_walk.rotation.y) * distance
        camera.position.z = character_walk.position.z + Math.cos(character_walk.rotation.y) * distance
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()