import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Color, Raycaster } from "three";
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
        this.raycaster = new Raycaster()
        this.intersects; 
        this.intersectsFocus; 
        this.movements = [];
        this.playerSpeed = 1;
        this.resource = this.resources.items.soldier
        this.temp = new THREE.Vector3;
        this.collisions = []
        this.characterBoundingBox;
        this.focused = false;
        this.allScene = this.resources.items.scene

        this.setModel()
        this.setAnimation()
        this.pressKey()
        this.releaseKey()
        this.onTouch()
        this.setShape()
        this.setBody()
        this.focusedObject()
        this.etapierFocusObject()
        this.detectCollision()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(2.5,2.5,2.5)
        this.model.position.set(-10,0,0)
        this.behind = new THREE.Object3D
        this.behind.position.set(this.model.position.x , this.model.position.y+8, this.model.position.z - 30)
        this.model.add(this.behind)
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
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

    // Finger Part

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

            if (this.intersects.length > 0 )
            {
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

    // Arrows Part

    pressKey()
    {
        document.addEventListener('keydown', (event) => 
        {
            this.keys[event.key] = true;
            this.updateKeyIllumination(event.key, true);
        }, false);
    }

    releaseKey()
    {
        
        document.addEventListener('keyup', (event) => 
        {
                delete this.keys[event.key];
                this.updateKeyIllumination(event.key, false);
                this.animation.actions.running.stop();
            }, false
        );   
        
    }


    updateKeyIllumination(key, isPressed) {
        let keyElement;
        switch (key) {
            case 'ArrowUp':
                keyElement = document.getElementById('up-key');
                break;
            case 'ArrowLeft':
                keyElement = document.getElementById('left-key');
                break;
            case 'ArrowDown':
                keyElement = document.getElementById('down-key');
                break;
            case 'ArrowRight':
                keyElement = document.getElementById('right-key');
                break;
            default:
                return; // Ne rien faire si ce n'est pas une touche directionnelle
        }
    
        if (isPressed) {
            keyElement.classList.add('illuminated');
        } else {
            keyElement.classList.remove('illuminated');
        }
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

    // TIPHAINE

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
            console.log(this.intersectsFocus)

            // Partie focus Ballons
            if (this.intersectsFocus[0].object.name == "ball" )
            {
                this.focused = true
                console.log(this.intersectsFocus[0].point)
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(this.intersectsFocus[0].point.x - 10, 10, this.intersectsFocus[0].point.z - 10) , 3000).easing(TWEEN.Easing.Quartic.InOut).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Quartic.InOut).start()
            } 

            // Partie focus PROJET
            if (this.intersectsFocus[0].object.name == "bottomRightScreen" ||this.intersectsFocus[0].object.name == "bottomLeftScreen" ||this.intersectsFocus[0].object.name == "littleMiddleScreen" ||this.intersectsFocus[0].object.name == "Object_35" ||this.intersectsFocus[0].object.name == "longMiddleScreen" ||this.intersectsFocus[0].object.name == "lightLeftScreen" ||this.intersectsFocus[0].object.name == "middleLeftScreen" ||this.intersectsFocus[0].object.name == "middleMiddleScreen" ||this.intersectsFocus[0].object.name == "middleRightScreen" ||this.intersectsFocus[0].object.name == "topScreen" )
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(12.8, 10, 42.3), 2000).easing(TWEEN.Easing.Back.Out).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Back.Out).start()
            } 

            // Partie focus TESTING
            if (this.intersectsFocus[0].object.name == "Object_8")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(50, 10, 35), 2000).easing(TWEEN.Easing.Back.Out).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Back.Out).start()
            } 

            // Partie où la camera focus la partie PROGRAMMATION
            if (this.intersectsFocus[0].object.name == "Object_9")
            {
                this.focused = true
                let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(50, 10, 40), 2000).easing(TWEEN.Easing.Back.Out).start()
                let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(this.intersectsFocus[0].point, 1000).easing(TWEEN.Easing.Back.Out).start()
            } 

            if (this.intersectsFocus[0].object.name == "floor" || this.intersectsFocus[0].object.name == "BackSquare")
            {
                this.focused = false
                var descriptionScreens = document.getElementsByClassName('descriptionScreens')
                var descriptionGames = document.getElementsByClassName('descriptionGames')
                var descriptionSkills = document.getElementsByClassName('descriptionSkills')

                
                descriptionScreens[0].style.visibility = 'hidden';
                descriptionGames[0].style.visibility = 'hidden';
                descriptionSkills[0].style.visibility = 'hidden';

            }           
        })
        
    }

    
    // Fonction pour gérer les sous-titres
    setupAudioWithSubtitles(audio, subtitles) {
        const subtitleDiv = document.getElementById('subtitles');
        audio.addEventListener('timeupdate', () => {
            const currentTime = audio.currentTime;
            const currentSubtitle = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
            if (currentSubtitle) {
                console.log(currentSubtitle.text); // Affiche dans la console
                subtitleDiv.textContent = currentSubtitle.text; // Affiche sur le front-end
                subtitleDiv.style.display = 'block'; // Affiche le bandeau
            } else {
                subtitleDiv.style.display = 'none'; // Cache le bandeau
            }
        });
    }



    etapierFocusObject() {
        const audioWork = new Audio('son/work.mp3');
        const audioLife = new Audio('son/life.mp3');
        const audioStack = new Audio('son/stack.mp3');
    
        audioWork.loop = false;
        audioLife.loop = false;
        audioStack.loop = false;
    
        audioWork.volume = 0.5;
        audioLife.volume = 0.5;
        audioStack.volume = 0.5;
    
        let currentAudio = null;
    
        function playAudio(audio) {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0; // Réinitialise l'audio
            }
            currentAudio = audio;
            audio.play().catch(error => {
                console.error('Erreur lors de la lecture de l\'audio:', error);
            });
        }
        
        function toggleSound() {
            const isMuted = audioWork.muted; // Vérifie l'état actuel du son
            audioWork.muted = !isMuted;
            audioLife.muted = !isMuted;
            audioStack.muted = !isMuted;
        
            // Met à jour le texte du bouton en fonction de l'état du son
            const button = document.getElementById('sound-toggle');
            button.textContent = isMuted ? 'SOUND: ON' : 'SOUND: OFF';
        }
    
        document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    
        const subtitlesWork = [
            { start: 0, end: 3.5, text: "Welcome, I'm Issam but you can call me Sami." },
            { start: 4, end: 7, text: "I am a QA tester and I want to showcase a blend of my life." },
            { start: 8, end: 14, text: "I always wanted to be a professional football player, but the real world pushed me to give up on that dream."},
            { start: 14, end: 20, text: "As time flew and the need for money arises, I needed to come up with a different piece of skills to grow income."},
            { start: 20, end: 27, text: "I started to learn mathematics and computer science. I graduated during covid and landed my first job right away."},
            { start: 28, end: 31, text: "Since that day, I've had fun testing applications"},
            { start: 31, end: 34, text: "and discovering the new technologies that this world has to offer."}      
        ];
    
        const subtitlesLife = [
            { start: 0, end: 1.5, text: "Well, well, well" },
            { start: 1.5, end: 5, text: "I hope you guys recognized some of the items on that table." },
            { start: 5, end: 7.5, text: "I mean yeah I am that kind of guy." },
            { start: 7.5, end: 10, text: "I grew up watching Dragon Ball Z and Naruto." },
            { start: 11, end: 14, text: "I followed Luffy on his One piece quest." },
            { start: 14, end: 17, text: "I am that nerdy guy always looking for Pokémon cards." },
            { start: 17, end: 22, text: "I mean im pretty decent in chess, maybe 2000 elo on chesscom." },
            { start: 22, end: 23.5, text: "Anyway it doesnt matter..." },
        ];
    
        const subtitlesStack = [
            { start: 0, end: 4, text: "If you're curious about my technical side, let me give you a quick tour."},
            { start: 4, end: 8, text: "I'm quite the tech enthusiast, with a strong command of Python and Java." },
            { start: 8, end: 16, text: "I love diving into automation with tools like the Selenium library and frameworks such as SerenityBDD and Robot Framework."},
            { start: 16, end: 23, text: "I also delve into the world of CI/CD development, using Git and Jenkins to optimize processes." },
            { start: 23.5, end: 27.5, text: "Additionally, I'm proud to be ISTQB and Selenium certified." }
        ];
    
        // Appliquez les sous-titres à chaque audio
        this.setupAudioWithSubtitles(audioWork, subtitlesWork);
        this.setupAudioWithSubtitles(audioLife, subtitlesLife);
        this.setupAudioWithSubtitles(audioStack, subtitlesStack);
    
        const workBullet = document.getElementsByClassName('li-work');
        const gamesBullet = document.getElementsByClassName('li-games');
        const skillsBullet = document.getElementsByClassName('li-skills');
    
        const descriptionScreens = document.getElementsByClassName('descriptionScreens');
        const descriptionGames = document.getElementsByClassName('descriptionGames');
        const descriptionSkills = document.getElementsByClassName('descriptionSkills');
    
        workBullet[0].addEventListener('click', (event) => {
            event.stopPropagation();
            this.focused = true;
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(12, 10, 25), 2000).easing(TWEEN.Easing.Linear.None).start();
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(15, 10, 60), 1000).easing(TWEEN.Easing.Linear.None).start();
            descriptionScreens[0].style.visibility = 'visible';
            descriptionGames[0].style.visibility = 'hidden';
            descriptionSkills[0].style.visibility = 'hidden';
            playAudio(audioWork);
        });
    
        gamesBullet[0].addEventListener('click', (event) => {
            event.stopPropagation();
            this.focused = true;
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(-50, 10, 40), 2000).easing(TWEEN.Easing.Linear.None).start();
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(13, 10, -1), 1000).easing(TWEEN.Easing.Linear.None).start();
            descriptionGames[0].style.visibility = 'visible';
            descriptionScreens[0].style.visibility = 'hidden';
            descriptionSkills[0].style.visibility = 'hidden';
            playAudio(audioLife);
        });
    
        skillsBullet[0].addEventListener('click', (event) => {
            event.stopPropagation();
            this.focused = true;
            let positionChange = new TWEEN.Tween(this.camera.instance.position).to(new THREE.Vector3(20, 10, 19), 2000).easing(TWEEN.Easing.Linear.None).start();
            let positionTarget = new TWEEN.Tween(this.camera.controls.target).to(new THREE.Vector3(52, 10, 40), 1000).easing(TWEEN.Easing.Linear.None).start();
            descriptionSkills[0].style.visibility = 'visible';
            descriptionScreens[0].style.visibility = 'hidden';
            descriptionGames[0].style.visibility = 'hidden';
            playAudio(audioStack);
        });
    }
 


    detectCollision()
    {
        // this.raycasterFromCharacter = new THREE.Raycaster(this.model.position);
        // this.intersectsFromCharacter = this.raycasterFromCharacter.intersectObjects(this.scene.children);

        // for (var i = 0; i < this.intersectsFromCharacter.length; i++)
        // {
        //     // console.log('2 : ', this.intersectsFromCharacter[i].object.name);
        // }


    }

    // Update

    update()
    {

        this.raycasterFromCharacter = new THREE.Raycaster(this.model.position);
        this.intersectsFromCharacter = this.raycasterFromCharacter.intersectObjects(this.scene.children);

        for (var i = 0; i < this.intersectsFromCharacter.length; i++)
        {
            // console.log('je raycast : ', this.intersectsFromCharacter[i].object.name);
            if ( this.intersectsFromCharacter[i].object.name == "pCube11_lambert1_0" )
            {
                console.log('intersection ok')
                console.log('distance : ', this.intersectsFromCharacter[i].point.distanceTo(this.model.position))
                // console.log('position point : ', this.intersectsFromCharacter[i].point)
                // console.log('position model : ', this.model.position)
                if(this.intersectsFromCharacter[i].point.distanceTo(this.model.position) < 20)
                {
                    console.log('je suis super proche')
                }
            }
        }


        // console.log('ma position : ', this.model.position)
        this.animation.mixer.update(this.time.delta * 0.001)
        TWEEN.update()

        if ((this.model.position.x - 0)**2 + (this.model.position.z - 0)**2 > 10000 )
        {
            console.log('on sort bientot de la sphere')
            var distance = 1
            this.model.position.x -= Math.sin(this.model.rotation.y) * distance
            this.model.position.z -= Math.cos(this.model.rotation.y) * distance
        } 
        else
        {              

            if(this.model.position.distanceTo(new THREE.Vector3(-39.85, 0, 68.01)) < 10)
            {
                this.model.position.x = 2
                this.model.position.z = 2
            }
    
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
                this.camera.controls.maxDistance = 100
                this.camera.instance.position.lerp(this.temp, 0.2);    
                
                this.camera.controls.target.set(this.model.position.x,this.model.position.y,this.model.position.z)
            }

            this.bodyCharacter.position.copy(this.model.position)
        }        
    }
}