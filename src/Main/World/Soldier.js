import Main from "../Main";
import * as THREE from 'three'

export default class Soldier
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.debug = this.main.debug
        this.camera = this.main.camera
        this.angle = 0
        this.keys = {}
        this.distance = 100

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('soldier')
        }

        //Setup
        this.resource = this.resources.items.soldier

        this.setModel()
        this.setAnimation()
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }
        this.pressKey()
        this.releaseKey()

    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(5,5,5)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[1])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()


        //Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle : () => { this.animation.play('idle')},
                playRunning : () => { this.animation.play('running')}

            }

            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playRunning')
        }

    }

    pressKey()
    {
        document.addEventListener('keydown', (event) => 
        {
            this.keys[event.key] = true;
        }, false);
    }

    releaseKey()
    {
        
        document.addEventListener('keyup', (event) => 
        {
                delete this.keys[event.key];
                this.animation.actions.running.stop();
                this.animation.actions.idle.stop();
            }, false
        );   
        
    }

    moveCharacter()
    {

        const vitesse = 1;    
        const rotation = Math.PI/60 ;


        if (Object.keys(this.keys).length !== 0)
        {
            this.keys = this.keys || window.event
            
            var avancer = this.keys['ArrowUp'] ? 1 : 0;
            var tourner = (this.keys['ArrowLeft']) ? 1 : (this.keys['ArrowRight']) ? -1 : 0;

            if (avancer) this.animation.actions.running.play()
            if (tourner) this.animation.actions.idle.play()

            this.model.position.x = this.model.position.x - Math.sin(this.angle) * (avancer * vitesse)
            this.model.position.z = this.model.position.z - Math.cos(this.angle) * (avancer * vitesse)
            
            this.model.rotation.y = this.model.rotation.y + rotation * tourner
            this.angle = this.model.rotation.y
        }

    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        this.moveCharacter(this.keys)
        this.camera.controls.target.set(this.model.position.x,this.model.position.y,this.model.position.z)
        this.camera.instance.position.x = this.model.position.x + Math.sin(this.model.rotation.y) * this.distance
        this.camera.instance.position.z = this.model.position.z + Math.cos(this.model.rotation.y) * this.distance
    }
}



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






// DANS LA FONCTION TICK Y AVAIT TOUT CA

//     move_character(arrow)

//     const elapsedTime = clock.getElapsedTime()
//     const deltaTime = elapsedTime - previousTime
//     previousTime = elapsedTime
//     const distance = 100
    


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