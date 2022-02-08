import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Tv
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.retro_tv
        this.position = (100, 0, 50)

        this.images = [this.resources.items.maths78]

        this.createBrick()
        // this.helper()
        
    }


    // helper()
    // {
    //     const geoHelper = new THREE.BoxBufferGeometry(this.length, this.height, this.height)
    //     const matHelper = new THREE.MeshStandardMaterial(
    //         {
    //         metalness: 0.3,
    //         roughness: 0.4,
    //         color : 0xff0000
    //         }
    //     )

    //     const geoMesh = new THREE.Mesh(geoHelper, matHelper)
    //     geoMesh.rotation.x = - Math.PI * 0.5
    //     geoMesh.castShadow = true
    //     geoMesh.position.set(100,0,250)
    //     this.scene.add(geoMesh)

    // }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10,10,10)
        this.model.position.set(0,0,0)
        
        
        this.model.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.5, name: 'white' })
        this.model.material.needsUpdate = true;



        this.model.material = new THREE.MeshStandardMaterial({ color: 0xff4400 })
        this.model.material.needsUpdate = true;


        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    child.material.color.set( 0xffffff );
                    
                    if (child.name == "Plane018_2")
                    {
                        this.screen = child
                        

                    }
                }
            }
        )

        // console.log(this.model)
    }

    changeColor()
    {
        this.screen.material.map = this.images[0]
    }

    setShape()
    {
        this.shape = new CANNON.Box(new CANNON.Vec3(this.length, this.height, this.height))

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

    createBrick()
    {
        this.setModel()

        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(0, 0, 300)

    }
    
    update()
    {
        this.model.position.copy(this.body.position)
        this.model.position.y = 25
        this.model.rotation.y = Math.PI

    }
}