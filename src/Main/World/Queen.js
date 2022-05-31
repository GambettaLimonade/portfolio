import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import { Raycaster } from "three";


export default class Queen
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.queen
        this.position = (0, 0, 0)
        this.raycaster = new Raycaster()
        this.camera = this.main.camera


        this.world2 = this.main.world
        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius




        this.createQueen()
        
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.position.set(0,0,0)
        this.model.name = "python"

        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    // const material = new THREE.MeshStandardMaterial({ metalness: 0.01, roughness: 0.5, name: 'white' })
                    // child.material = material;
                    child.name = "queen"
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
                linearDamping:0.8
                
            })
            
        this.main.physics.world.addBody(this.body)
    }

    createQueen()
    {
        this.setModel()
        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(-10, 0, 50)
    }

      
    update()
    {
        
        this.body.position.y = 0
        this.model.position.copy(this.body.position)

    }
}