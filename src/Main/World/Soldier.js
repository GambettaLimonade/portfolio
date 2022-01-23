import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Raycaster } from "three";


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
        this.world = this.main.physics.world
        this.raycaster = new Raycaster()

        
        
        
        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('soldier')
        }
        
        //Setup
        this.resource = this.resources.items.soldier
        
        console.log(this.resource)
        
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
        this.onDoubleClick()

        this.setShape()
        this.setBody()

    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(2,2,2)
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

    onDoubleClick()
    {
        document.addEventListener('dblclick', () => 
        { 
            this.height =  this.main.sizes.height
            this.width =  this.main.sizes.width
            var event = window.event;

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = ( event.clientX / this.width ) * 2 - 1;
            mouse.y = - ( event.clientY / this.height ) * 2 + 1;

            raycaster.setFromCamera( mouse, this.camera.instance );
            const intersects = raycaster.intersectObjects( this.scene.children );

            this.model.position.x = intersects[0].point.x
            this.model.position.z = intersects[0].point.z

            console.log('position x : ', intersects[0].point.x, ' et z : ', intersects[0].point.z)
            
          });
    }

    moveCharacter()
    {

        const vitesse = 1;    
        const rotation = Math.PI/60 ;
        //REVOIR CETTE LIGNE AVEC TIPHAINE
        //this.animation.actions.idle.play()

        if (Object.keys(this.keys).length !== 0)
        {
            this.keys = this.keys || window.event
            
            var avancer = this.keys['ArrowUp'] ? 1 : 0;
            var tourner = (this.keys['ArrowLeft']) ? 1 : (this.keys['ArrowRight']) ? -1 : 0;

            if (avancer) this.animation.actions.running.play()
            if (tourner) this.animation.actions.running.play()

            this.model.position.x = this.model.position.x + Math.sin(this.angle) * (avancer * vitesse)
            this.model.position.z = this.model.position.z + Math.cos(this.angle) * (avancer * vitesse)
            
            this.model.rotation.y = this.model.rotation.y + rotation * tourner
            this.angle = this.model.rotation.y

            
            this.camera.instance.position.x = this.model.position.x - Math.sin(this.model.rotation.y) * this.distance
            this.camera.instance.position.z = this.model.position.z - Math.cos(this.model.rotation.y) * this.distance
        }

    }

    setShape()
    {
        this.shapeCharacter = new CANNON.Cylinder(2,2, 18, 10)
    }

    setBody()
    {
        this.bodyCharacter = new CANNON.Body({
                mass:0,
                position: new CANNON.Vec3(0,0,0),
                shape:this.shapeCharacter,
                material:this.world.defaultMaterial
            })
        this.bodyCharacter.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
        this.main.physics.world.addBody(this.bodyCharacter)
    }



    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        this.moveCharacter(this.keys)
        this.onDoubleClick()


        this.camera.controls.target.set(this.model.position.x,this.model.position.y,this.model.position.z)
        this.camera.controls.maxDistance = 5 * 100;
        this.camera.controls.minDistance = 20;      
        this.bodyCharacter.position.copy(this.model.position)



    }
}
