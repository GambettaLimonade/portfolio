import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Raycaster } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from "gsap";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'




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
        this.canvas = this.main.canvas


        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius


        this.flooor = this.world2.floor
        this.floorColor = this.flooor.mesh.material.color
    
        


        
        this.raycaster = new Raycaster()
        this.intersects; 
        this.intersectsFocus; 

        this.movements = [];
        this.playerSpeed = 0.1;
        this.resource = this.resources.items.soldier
        this.temp = new THREE.Vector3;
        this.collisions = []
        this.characterBoundingBox;
        this.focused = false;


        


        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('soldier')
        }
        

        this.setModel()
        this.setAnimation()
       
        this.pressKey()
        this.releaseKey()
        this.onTouch()

        this.setShape()
        this.setBody()


        this.changementDambiance()
        this.focusedObject()
        this.etapierFocusObject()
    }

    /**
     * CREATE MODEL AND PHYSICS PART
     */

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(2.5,2.5,2.5)
        this.model.position.set(0,0,0)
        this.behind = new THREE.Object3D
        this.behind.position.set(this.model.position.x, this.model.position.y+8, this.model.position.z - 30)
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
                    key : [27, 27, 27]
                }
            ,
            {
                value : distanceCharacterPointB,
                key : [27, 27, 27]     
            },
            {
                value : distanceCharacterPointC,
                key : [27, 27, 27]   
            },
            {
                value : distanceCharacterPointD,
                key : [27, 27, 27] 

            },
            {
                value : distanceCharacterCentre,
                key : [0, 0, 0]

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
    
        // this.floorColor.set(new THREE.Color(`rgb(${Math.round(Total[0])}, ${Math.round(Total[1])}, ${Math.round(Total[2])})`)) 
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
        const vitesse = 1.2;    
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

    

    focusedObject()
    {
        document.addEventListener('click', (event) => {


            this.height =  this.main.sizes.height
            this.width =  this.main.sizes.width

            const mouse = new THREE.Vector2();
            
            var x = event.clientX
            var y = event.clientY

            mouse.x = ( x / this.width ) * 2 - 1;
            mouse.y = - ( y / this.height ) * 2 + 1;
            
            this.raycaster.setFromCamera(mouse, this.camera.instance);
            this.intersectsFocus = this.raycaster.intersectObjects(this.scene.children, true);


            // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ 
            // /!\ IF POUR LE MOUVEMENT DE LA CAMERA ET LES TWEENS /!\ 
            // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ 

            // if (this.intersectsFocus[0].object.name == "cylindre" || this.intersectsFocus[0].object.name == "ball")
            // {
            //     gsap.to( this.camera.instance.position, {
            //         duration: 2.5,
            //         x: this.intersectsFocus[0].object.position.x,
            //         y: -100,
            //         z: this.intersectsFocus[0].object.position.z, // maybe adding even more offset depending on your model
            //         // onUpdate: function()
            //             // {
            //             //     console.log('i : ', i)
            //             // }
            //         // }
            //     } );

            // this.camera.controls.target.set(this.intersectsFocus[0].object.position.x,this.intersectsFocus[0].object.position.y,this.intersectsFocus[0].object.position.z) 
            // this.focused = true
    
            //     // document.getElementById("info").style.display = "block";
    
            //     setTimeout(() =>
            //      { 
            //         this.focused = false;
            //         // document.getElementById("info").style.display = "none";
    
            //     }, 2500)
            // }


            if (this.intersectsFocus[0].object.name == "pCube11_lambert21_0" || this.intersectsFocus[0].object.name == "pCube11_lambert10_0")
            {
                console.log(this.intersectsFocus[0].object.name)
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(17, 9, -40), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 


            if (this.intersectsFocus[0].object.name == "pCube14_lambert25_0" || this.intersectsFocus[0].object.name == "pCube11_lambert10_0")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(45, 9, -4), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 


            if (this.intersectsFocus[0].object.name == "pCube15_lambert28_0" || this.intersectsFocus[0].object.name == "pCube11_lambert10_0")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(45, 6, -10), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 


            if (this.intersectsFocus[0].object.name == "Cube036_1" || this.intersectsFocus[0].object.name == "pCube11_lambert10_0")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(-36, 2, 64), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 


            // Partie où la camera focus les objet (futurama, hitachi, chapeau de paille...)
            if (this.intersectsFocus[0].object.name == "pCube2_lambert9_0" || this.intersectsFocus[0].object.name == "pCube3_lambert9_0" ||this.intersectsFocus[0].object.name == "CIMA_verde_claro_0" ||this.intersectsFocus[0].object.name == "BAIXO_verde_claro_0" ||this.intersectsFocus[0].object.name == "Plano_verde_escuro_riscado_0" ||this.intersectsFocus[0].object.name == "Aasa_cima_logo_0" ||this.intersectsFocus[0].object.name == "Object_4" ||this.intersectsFocus[0].object.name == "Object_2002" ||this.intersectsFocus[0].object.name == "Cylinder_Material001_0" ||this.intersectsFocus[0].object.name == "Cube_Material003_0" ||this.intersectsFocus[0].object.name == "pCylinder12_blinn2_0001" ||this.intersectsFocus[0].object.name == "pCylinder12_blinn2_0" ||this.intersectsFocus[0].object.name == "pCube38_lambert36_0" ||this.intersectsFocus[0].object.name == "Straw_Hat_Material002_0" ||this.intersectsFocus[0].object.name == "NMSMultyTool_0010pCube1_NMSMultyTool_0010phong3_0" ||this.intersectsFocus[0].object.name == "Object_47" ||this.intersectsFocus[0].object.name == "Object_46")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(45, 10, -2.5), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 
            


            // Partie où la camera focus les écrans avec les projets et les photos
            if (this.intersectsFocus[0].object.name == "Object_17001" || this.intersectsFocus[0].object.name == "Object_16001" ||this.intersectsFocus[0].object.name == "bottomRightScreen" ||this.intersectsFocus[0].object.name == "bottomLeftScreen" ||this.intersectsFocus[0].object.name == "littleMiddleScreen" ||this.intersectsFocus[0].object.name == "Object_35" ||this.intersectsFocus[0].object.name == "longMiddleScreen" ||this.intersectsFocus[0].object.name == "lightLeftScreen" ||this.intersectsFocus[0].object.name == "middleLeftScreen" ||this.intersectsFocus[0].object.name == "middleMiddleScreen" ||this.intersectsFocus[0].object.name == "middleRightScreen" ||this.intersectsFocus[0].object.name == "topScreen" )
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(12.8, 10, 42.3), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 

            // Partie où la camera focus la partie TESTING
            if (this.intersectsFocus[0].object.name == "Object_8")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(50, 10, 35), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 

            // Partie où la camera focus la partie PROGRAMMATION
            if (this.intersectsFocus[0].object.name == "Object_9")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(50, 10, 40), 2000).easing(TWEEN.Easing.Linear.None).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Linear.None).start()
            } 

            if (this.intersectsFocus[0].object.name == "sky" || this.intersectsFocus[0].object.name == "floor" || this.intersectsFocus[0].object.name == "BackSquare")
            {
                this.focused = false
            }           


            console.log('objet : ', this.intersectsFocus[0].object.name)

            // /!\ /!\ /!\ /!\ /!\ 
            // /!\ FIN DES IF  /!\ 
            // /!\ /!\ /!\ /!\ /!\  

        })
        
    }


    etapierFocusObject()
    {
        this.intersectsFocus = this.raycaster.intersectObjects(this.scene.children, true);
        var workBullet = document.getElementsByClassName('li-work')
        var bedBullet = document.getElementsByClassName('li-bed')
        var kitchenBullet = document.getElementsByClassName('li-kitchen')
        var gamesBullet = document.getElementsByClassName('li-games')
        var skillsBullet = document.getElementsByClassName('li-skills')

        workBullet[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements
            event.stopPropagation()
            this.focused = true
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(12, 10, 25), 2000).easing(TWEEN.Easing.Linear.None).start()
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(15, 10, 60), 1000).easing(TWEEN.Easing.Linear.None).start()

        })

        bedBullet[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements
            event.stopPropagation()
            this.focused = true
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(-16, 10, 16), 2000).easing(TWEEN.Easing.Linear.None).start()
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(-50, 5, 50), 1000).easing(TWEEN.Easing.Linear.None).start()

        })

        kitchenBullet[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements
            event.stopPropagation()
            this.focused = true
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(0, 10, 0), 2000).easing(TWEEN.Easing.Linear.None).start()
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(-50, 5, -40), 1000).easing(TWEEN.Easing.Linear.None).start()

        })

        gamesBullet[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements
            event.stopPropagation()
            this.focused = true
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(-50, 10, 40), 2000).easing(TWEEN.Easing.Linear.None).start()
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(13, 10, -1), 1000).easing(TWEEN.Easing.Linear.None).start()

        })

        skillsBullet[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements
            event.stopPropagation()
            this.focused = true
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(20, 10, 19), 2000).easing(TWEEN.Easing.Linear.None).start()
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(52, 10, 40), 1000).easing(TWEEN.Easing.Linear.None).start()

        })

        

    }

    /**
     * UPDATE PART
     */

    update()
    {

        // console.log(this.model.position)
        this.animation.mixer.update(this.time.delta * 0.001)
        TWEEN.update()

        // console.log(this.model.position.x, this.model.position.z)

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
            // if (this.world2.bricks[0].center)
            // {
            //     if (this.model.position.distanceTo(this.world2.bricks[0].center) < 5)
            //     {
            //         var distance = 1
            //         this.model.position.x -= Math.sin(this.model.rotation.y) * distance * 5
            //         this.model.position.z -= Math.cos(this.model.rotation.y) * distance * 5
            //     }
            // }       
            

            // /!\/!\/!\ le (54, 0, 4.4) est relatif à /!\/!\/!\
            // /!\/!\/!\ la ligne de code : this.model.position.set(50,0,0) dans Room.js /!\/!\/!\

            // if(this.model.position.distanceTo(new THREE.Vector3(54, 0, 4.4)) < 5 || this.model.position.distanceTo(new THREE.Vector3(-54, 0, 16)) < 5 || this.model.position.distanceTo(new THREE.Vector3(-61, 0, 2)) < 5 || this.model.position.distanceTo(new THREE.Vector3(-60, 0, -13)) < 5)
            // {
            //     var distance = 1
            //     this.model.position.x -= Math.sin(this.model.rotation.y) * distance * 5
            //     this.model.position.z -= Math.cos(this.model.rotation.y) * distance * 5


            // }
           
    
                this.moveModelArrow(this.keys)
                if (this.movements.length > 0)
                {    
                    this.model.lookAt(this.direction)
                    this.moveModelFinger(this.model, this.movements[ 0 ]);
                }



            
            if (!this.focused)
            {
                this.temp.setFromMatrixPosition(this.behind.matrixWorld);
                
                this.camera.controls.minDistance = 15
                this.camera.controls.maxDistance = 1000
                this.camera.instance.position.lerp(this.temp, 0.2);    
                
                this.camera.controls.target.set(this.model.position.x,this.model.position.y,this.model.position.z)
            }

            this.bodyCharacter.position.copy(this.model.position)
            this.changementDambiance()
            // this.camera.controls.update()
        }        

    }
}
