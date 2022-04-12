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
        this.world2 = this.main.world


        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius


        this.flooor = this.world2.floor
        this.floorColor = this.flooor.mesh.material.color
        


        
        this.raycaster = new Raycaster()
        this.intersects; 
        this.movements = [];
        this.playerSpeed = 1;
        this.resource = this.resources.items.soldier
        this.temp = new THREE.Vector3;
        this.collisions = []
        this.characterBoundingBox;

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('soldier')
        }
        
        
        this.bricksBB = this.world2.bricks[0].brickBoundingBox
        this.setModel()
        this.setAnimation()
       
        this.pressKey()
        this.releaseKey()
        this.onTouch()

        this.setShape()
        this.setBody()


        this.changementDambiance()
    }

    /**
     * CREATE MODEL AND PHYSICS PART
     */

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(2,2,2)
        this.model.position.set(0,0,0)
        this.behind = new THREE.Object3D
        this.behind.position.set(this.model.position.x, this.model.position.y+10, this.model.position.z - 50)
        this.model.add(this.behind)
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true

                    const parameters = {
                        color: 0xff0000,
                    }


                    if(this.debug.active)
                    {
                        this.debugFolder
                        .addColor(parameters, 'color')
                        .name('color')
                        .onChange((c) => 
                        {
                            console.log(child)
                            child.material.color = new THREE.Color(c)
                            child.material.needsUpdate = true;
                        })
                    }
                }
            }
        )

        this.characterBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.characterBoundingBox.setFromObject(this.model);
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        this.animation.actions = {}

        this.animation.actions.stand = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[1])
        
        this.animation.actions.stand.play()
        

        //Debug
        if(this.debug.active)
        {
            const debugObject = 
            {
                playstand : () => { this.animation.play('idle')},
                playRunning : () => { this.animation.play('running')}
            }

            // this.debugFolder.add(debugObject, 'playidle')
            // this.debugFolder.add(debugObject, 'playRunning')
        }

    }

    setShape()
    {
        this.shapeCharacter = new CANNON.Cylinder(2,2, 18, 10)
    }

    setBody()
    {
        this.bodyCharacter = new CANNON.Body(
                {
                    mass:0,
                    position: new CANNON.Vec3(0,0,0),
                    shape:this.shapeCharacter,
                    material:this.world.defaultMaterial,

                }
            )
        this.bodyCharacter.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
        this.main.physics.world.addBody(this.bodyCharacter)
    }


    /**
     * MOVING WITH FINGERS PART
     */

    onTouch()
    {   
        document.addEventListener('touchstart', (e) => 
        { 
            this.movements = [];
            this.animation.actions.running.play()
            this.height =  this.main.sizes.height
            this.width =  this.main.sizes.width
            
            const mouse = new THREE.Vector2();
            
            var x = e.touches[0].pageX
            var y = e.touches[0].pageY
            
            mouse.x = ( x / this.width ) * 2 - 1;
            mouse.y = - ( y / this.height ) * 2 + 1;
            
            this.raycaster.setFromCamera(mouse, this.camera.instance);
            this.intersects = this.raycaster.intersectObjects(this.scene.children);

            this.direction = new THREE.Vector3(this.intersects[ 0 ].point.x, 0, this.intersects[ 0 ].point.z)

            if (this.intersects.length > 0 ) {
                this.movements.push(this.intersects[ 0 ].point);
                
              }

            }
        );
    }

    stopMovementFinger() {
        this.movements = [];
        window.setTimeout(() => {
            this.animation.actions.running.stop()
        }, 100)
        this.hasRotated = false
    }
      

    moveModelFinger(location, destination, speed = this.playerSpeed )
    {
        var moveDistance = speed;
        var posX = location.position.x;
        var posZ = location.position.z;
        var newPosX = destination.x;
        var newPosZ = destination.z;
    
        // Set a multiplier just in case we need negative values.
        var multiplierX = 1;
        var multiplierZ = 1;
        
        // Detect the distance between the current pos and target.
        var diffX = Math.abs( posX - newPosX );
        var diffZ = Math.abs( posZ - newPosZ );
        var distance = Math.sqrt( diffX * diffX + diffZ * diffZ );
        
        // Use negative multipliers if necessary.
        if (posX > newPosX)
        {
            multiplierX = -1;
        }
    
        if (posZ > newPosZ)
        {
            multiplierZ = -1;
        }
    
        // Update the main position.
        location.position.x = location.position.x + ( moveDistance * ( diffX / distance )) * multiplierX;
        location.position.z = location.position.z + ( moveDistance * ( diffZ / distance )) * multiplierZ;

       
        // If the position is close we can call the movement complete.
        const positionOffset = 5
        if (( Math.floor( location.position.x ) <= Math.floor( newPosX ) + positionOffset && 
            Math.floor( location.position.x ) >= Math.floor( newPosX ) - positionOffset ) &&
            ( Math.floor( location.position.z ) <= Math.floor( newPosZ ) + positionOffset && 
            Math.floor( location.position.z ) >= Math.floor( newPosZ ) - positionOffset ))
        {
            location.position.x = Math.floor( location.position.x );
            location.position.z = Math.floor( location.position.z );
            // Reset any movements.
            this.stopMovementFinger();
        }
    }


    /**
     * MOVING WITH ARROW PART
     */

    pressKey()
    {
        document.addEventListener('keydown', (event) => 
        {
            this.keys[event.key] = true;
        }, false);
    }




    changementDambiance()
    {
        var centreScene = new THREE.Vector3( 0, 0, 0 );
        var pointA = new THREE.Vector3(123,0,153);
        var pointB = new THREE.Vector3(-153,0,123);
        var pointC = new THREE.Vector3(153,0,-123);
        var pointD = new THREE.Vector3(-153,0,-123);

        var distanceCharacterPointA = this.model.position.distanceTo( pointA );
        var distanceCharacterPointB = this.model.position.distanceTo( pointB );
        var distanceCharacterPointC = this.model.position.distanceTo( pointC );
        var distanceCharacterPointD = this.model.position.distanceTo( pointD );
        var distanceCharacterCentre = this.model.position.distanceTo( centreScene );
        var distTotal = distanceCharacterPointA+distanceCharacterPointB+distanceCharacterPointC+distanceCharacterPointD+distanceCharacterCentre

        var colorDistance = 
        [
                {
                    value : distanceCharacterPointA,
                    key : [255, 0, 0] 
                }
            ,
            {
                value : distanceCharacterPointB,
                key : [0, 255, 0]     
            },
            {
                value : distanceCharacterPointC,
                key : [0,0,0]   
            },
            {
                value : distanceCharacterPointD,
                key : [0,0,0] 

            },
            {
                value : distanceCharacterCentre,
                key : [0, 0, 255]

            }
        ]



        var pourcentage = [ (distanceCharacterPointA/distTotal),(distanceCharacterPointB/distTotal),(distanceCharacterPointC/distTotal),(distanceCharacterPointD/distTotal),(distanceCharacterCentre/distTotal)]
        var a = colorDistance[0].key.map(function(x) {return x * pourcentage[0]; })
        var b = colorDistance[1].key.map(function(x) {return x * pourcentage[1]; })
        var c = colorDistance[2].key.map(function(x) {return x * pourcentage[2]; })
        var d = colorDistance[3].key.map(function(x) {return x * pourcentage[3]; })
        var e = colorDistance[4].key.map(function(x) {return x * pourcentage[4]; })
        var Total = []

        for( var i = 0; i < a.length; i++)
        {
            Total.push(a[i]+b[i]+c[i]+d[i]+e[i]);
        }
    
        this.floorColor.set(new THREE.Color(`rgb(${Math.round(Total[0])}, ${Math.round(Total[1])}, ${Math.round(Total[2])})`)) 
        this.sky.mesh.material[0].color.set(new THREE.Color(`rgb(${Math.round(Total[0])}, ${Math.round(Total[1])}, ${Math.round(Total[2])})`))
    }


    releaseKey()
    {
        
        document.addEventListener('keyup', (event) => 
        {
                delete this.keys[event.key];
                this.animation.actions.running.stop();
            }, false
        );   
        
    }

    moveModelArrow()
    {

        // console.log(this.model.position)

        const vitesse = 1;    
        const rotation = Math.PI/60 ;
        
        if (Object.keys(this.keys).length !== 0)
        {
            this.keys = this.keys || window.event
            
            var avancer = this.keys['ArrowUp'] ? 1 : 0;
            var tourner = (this.keys['ArrowLeft']) ? 1 : (this.keys['ArrowRight']) ? -1 : 0;
            
            if (avancer) this.animation.actions.running.play(); 
            if (tourner) this.animation.actions.running.play()
            this.model.position.x = this.model.position.x + Math.sin(this.angle) * (avancer * vitesse)
            this.model.position.z = this.model.position.z + Math.cos(this.angle) * (avancer * vitesse)
            
            this.model.rotation.y = this.model.rotation.y + rotation * tourner
            this.angle = this.model.rotation.y
        }
    }
    

    /**
     * UPDATE PART
     */

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)

        
        if ((this.model.position.x - 0)**2 + (this.model.position.z - 0)**2 > ((this.skyRadius**2) - 1000) )
        {
            console.log('on sort bientot de la sphere')
            var distance = 1
            this.model.position.x -= Math.sin(this.model.rotation.y) * distance
            this.model.position.z -= Math.cos(this.model.rotation.y) * distance
            // this.releaseKey()
            // bloquer la position du character
        } 
        else
        {            
            this.moveModelArrow(this.keys)
            if (this.movements.length > 0)
            {    
                this.model.lookAt(this.direction)
                this.moveModelFinger(this.model, this.movements[ 0 ]);
            }
            
            this.temp.setFromMatrixPosition(this.behind.matrixWorld);
            
            this.camera.instance.position.lerp(this.temp, 0.2);
            this.camera.controls.target.set(this.model.position.x,this.model.position.y,this.model.position.z)    
            this.bodyCharacter.position.copy(this.model.position)
            this.changementDambiance()
            // console.log('X : ', this.model.position.x)
            // console.log('Y : ', this.model.position.z)


        }        

    }
}
