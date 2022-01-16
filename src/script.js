import './style.css'
import Main from './Main/Main.js'

const main = new Main(document.querySelector('canvas.webgl'));
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as dat from 'dat.gui'
// import CANNON from 'cannon'


// /**
//  * Base
//  */


// /**
//  * Debug
//  *  */ 
// const gui = new dat.GUI()
// const debugObject = {}

// debugObject.createSphere = () =>
// {
//     createSphere(1, { x : 0, y : 3, z : 0})
// }
// gui.add(debugObject, 'createSphere')

// // Canvas
// const canvas = document.querySelector('canvas.webgl')


// /**
//  * Physics
//  */

// //World
// const world = new CANNON.World()
// world.gravity.set(0, -9.82, 0)

// // Materials
// const defautMaterial = new CANNON.Material('defaut')

// const defautContactMaterial = new CANNON.ContactMaterial(
//     defautMaterial,
//     defautMaterial,
//     {
//         friction : 0.1,
//         restitution : 0.5
//     }
// )

// world.addContactMaterial(defautContactMaterial)
// world.defaultContactMaterial = defautContactMaterial
// //On a pas besoin de mettre le defaut material dans le sol et 
// // le sphère car on dit au monde que le matériel par defaut et celui la.



// // Floor 
// const floorShape = new CANNON.Plane()
// const floorBody = new CANNON.Body()
// floorBody.mass = 0
// floorBody.addShape(floorShape)
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
// world.addBody(floorBody)


// /**
//  * Scene
//  */


// const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0x000000 );

// /**
//  * Utils (sphere, bricks)...
//  */

// const objectToUpdate = []


// const createSphere = (radius, position) =>
// {
//     // THREE LIBRARY
//     const mesh = new THREE.Mesh(
//         new THREE.SphereBufferGeometry(radius, 20, 20),
//         new THREE.MeshStandardMaterial({
//             metalness: 0.3,
//             roughness: 0.4
//         })
//     )
//     mesh.castShadow = true
//     mesh.position.copy(position)
//     scene.add(mesh)

//     //CANNON LIBRARY
//     const shape = new CANNON.Sphere(radius)
//     const body = new CANNON.Body({
//         mass:3,
//         position: new CANNON.Vec3(0,3,0),
//         shape:shape,
//         material:defautMaterial
//     })
//     body.position.copy(position)
//     world.addBody(body)

//     //Save the object to update
//     objectToUpdate.push({
//         mesh:mesh,
//         body:body
//     })
    
// }



// /**
//  * Floor
//  */
//  const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(3000, 3000),
//     new THREE.MeshStandardMaterial({
//         color: '#777777',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5


// scene.add(floor)



// // Loader
// const gltfLoader = new GLTFLoader()

// let mixer = null
// var character_walk;
// let arrow = {};
// var character;
// var action_avancer;
// var action_tourner;




// //main Character
// gltfLoader.load(
//     '/models/Soldier.glb',
//     (gltf) =>
//     {
//         character_walk = gltf.scene


//         scene.add(character_walk)

//         gltf.scene.position.set(0, 0, 0)

//         gltf.scene.rotation.y = Math.PI
//         gltf.scene.scale.set(5,5,5)


//         character = gltf
//         mixer = new THREE.AnimationMixer(character_walk)
//         action_avancer = mixer.clipAction(character.animations[1])
//         action_tourner = mixer.clipAction(character.animations[0])
        
//         document.addEventListener('keydown', (event) => {
//                 arrow[event.key] = true;
//          }, false);

//          document.addEventListener('keyup', (event) => {
//             delete arrow[event.key];
//             action_avancer.stop();
//             action_tourner.stop();
//         }, false);   
//     })



// let angle = 0;        
// const vitesse = 1;    
// const rotation = Math.PI/60 ;

// function move_character() {
//     if (Object.keys(arrow).length !== 0){
    
//     arrow = arrow || window.event;
    
//     var avancer = arrow['ArrowUp'] ? 1 : 0;
//     var tourner = (arrow['ArrowLeft']) ? 1 : (arrow['ArrowRight']) ? -1 : 0;

//     if (avancer) action_avancer.play()
//     if (tourner) action_tourner.play()
//     character_walk.position.x = character_walk.position.x - Math.sin(angle) * (avancer * vitesse)
//     character_walk.position.z = character_walk.position.z - Math.cos(angle) * (avancer * vitesse)
    
//     character_walk.rotation.y = character_walk.rotation.y + rotation * tourner
//     angle = character_walk.rotation.y  

//     }
// }

//     //CANNON LIBRARY CYLINDRE
// const shapeCharacter = new CANNON.Cylinder(2,2, 18, 10)
// const bodyCharacter = new CANNON.Body({
//     mass:6,
//     position: new CANNON.Vec3(0,0,0),
//     shape:shapeCharacter,
//     material:defautMaterial
// })
// bodyCharacter.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

// world.addBody(bodyCharacter)



// //cylindre three

// // const geometry = new THREE.CylinderGeometry(2, 2, 18, 10);
// // const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// // const cylinder = new THREE.Mesh( geometry, material );
// // scene.add( cylinder );


// /**
//  * Lights
//  */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 200
// directionalLight.shadow.camera.left = 200
// directionalLight.shadow.camera.top = 200
// directionalLight.shadow.camera.right = - 200
// directionalLight.shadow.camera.bottom = - 200
// var shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
// scene.add( shadowHelper );
// directionalLight.position.set(5, 100, 5)
// scene.add(directionalLight)



// /**
//  * Sizes
//  */
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 10, 2000)
// camera.position.y = 20
// scene.add(camera)

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0, 0)
// controls.enableDamping = true
// controls.enableZoom = false;


// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
// })

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// /**
//  * Animate
//  */
// const clock = new THREE.Clock()
// let previousTime = 0




// const tick = () =>
// {
//     move_character(arrow)



//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime
//     const distance = 100
    
//     //update Physics World
//     world.step(1/60, deltaTime, 3)



//     for (const object of objectToUpdate)
//     {

//         object.mesh.position.copy(object.body.position)

//     }


//     //update mixer
//     if(mixer) mixer.update(deltaTime)



//     if (character_walk)
//     {
            
//             controls.target.set(character_walk.position.x,character_walk.position.y,character_walk.position.z)
//             camera.position.x = character_walk.position.x + Math.sin(character_walk.rotation.y) * distance
//             camera.position.z = character_walk.position.z + Math.cos(character_walk.rotation.y) * distance
//             bodyCharacter.position.copy(character_walk.position)
//             //cylinder.position.copy(character_walk.position)

//     }
//     // Update controls
//     controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()