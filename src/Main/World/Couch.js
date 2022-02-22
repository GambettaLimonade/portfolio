import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Couch
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.couch
        this.debug = this.main.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Couch')
        }
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
        this.model.scale.set(.1,.1,.1)
        this.model.position.set(0,0,0)
        


        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    const material = new THREE.MeshStandardMaterial({ color: 0xE0D0AB})
                    child.material = material;
                    const parameters = {
                        color: 0xff0000,
                    }
            
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
        )




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
        this.body.position = new CANNON.Vec3(20,0, 175)

        this.debugFolder.add(this.body.position, 'x')
        .min(-500)
        .max(500)
        .step(5)


        this.debugFolder.add(this.body.position, 'z')
        .min(-500)
        .max(500)
        .step(5)


    }
    
    update()
    {
        this.model.position.copy(this.body.position)
        this.model.position.y = 0
        this.model.rotation.y = Math.PI / 2

    }
}