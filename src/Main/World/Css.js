import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Raycaster } from "three";


export default class Css
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.css
        this.position = (100, 0, 60)
        this.raycaster = new Raycaster()
        this.camera = this.main.camera


        this.world2 = this.main.world
        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius




        this.createCss()
        
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(3, 3, 3)
        this.model.position.set(0,0,0)
        this.model.rotation.y = - Math.PI * 0.5

        this.model.name = "css"
        
        this.model.children[0].children[0].material.color.r = 0
        this.model.children[0].children[0].material.color.g = 0
        this.model.children[0].children[0].material.color.b = 255
        // this.model.children[0].children[0].material.color.setHex( 0x0000ff )

        this.model.children[0].children[1].material.color.r = 255
        this.model.children[0].children[1].material.color.g = 255
        this.model.children[0].children[1].material.color.b = 255

        // this.model.children[0].children[0].material.color.setHex( 0x0000ff )
        // this.model.children[0].children[1].material.color.setHex( 0xffffff )

        // r: 0.0343399, g: 0.171441, b: 0.376262,
        // const light = new THREE.PointLight( 0xffffff, 1, 100 );
        // light.position.set( -70, 20, -60  );
        // const sphereSize = 10;
        // const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        // this.scene.add( pointLightHelper );
        // this.scene.add( light );





        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    // const material = new THREE.MeshStandardMaterial({ metalness: 0.01, roughness: 0.5, name: 'white' })
                    // child.material = material;
                    child.name = "css"
                    const parameters = {
                        color: 0xff0000,
                    }

                }
            }
        )

    }


    setShape()
    {
        this.shape = new CANNON.Box(new CANNON.Vec3(this.length, 2, this.height))

    }



    setBody()
    {
        this.body = new CANNON.Body({
                mass:0.1,
                shape:this.shape,
                material:this.main.physics.world.defaultMaterial,
                linearDamping:0.3
                
            })
            
        this.main.physics.world.addBody(this.body)
    }

    createCss()
    {
        this.setModel()
        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(-100, 0, -80)
    }

      
    update()
    {

        // console.log('position python : ', (this.model.position.x - 0)**2 + (this.model.position.z - 0)**2)
        // console.log('rayon sphère : ', this.skyRadius ** 2)
        // console.log('threejs y rotation : ', this.model.rotation.y)
        // console.log('cannon body quaternion y ', this.body.quaternion)

        if ((this.model.position.x - 0)**2 + (this.model.position.z - 0)**2 > ((this.skyRadius**2) - 1000) )
        {
            this.body.position.x = (this.body.position.x + 0.9) 
            this.body.position.z = (this.body.position.z + 0.9)
            // this.releaseKey()
            // bloquer la position du character
        }   
        this.body.position.y = 7
        
        this.model.position.copy(this.body.position)

    }
}