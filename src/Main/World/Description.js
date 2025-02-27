import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Color, Raycaster } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from "gsap";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

export default class Description
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.camera = this.main.camera
        this.world = this.main.physics.world
        this.world2 = this.main.world
        this.canvas = this.main.canvas      
        this.raycaster = new Raycaster()
        this.intersects; 
        this.intersectsFocus; 
        this.resource = this.resources.items.soldier
        this.focused = this.main.world.soldier.focused;
        this.temp = new THREE.Vector3;

        //this.focusCharacter()

    }

    
    focusCharacter()    
    {

        var homeIcon = document.getElementsByClassName('home-icon')
        homeIcon[0].addEventListener('click', (event) => 
        {
            // Permet de cliquer sur du HTML sans que Raycasting du sol ou de la sphère s'active
            // https://stackoverflow.com/questions/39435334/how-can-i-block-a-three-js-raycast-with-html-elements

            console.log("focus chara")
            event.stopPropagation()
            this.focused = false
        })
    }

    

}