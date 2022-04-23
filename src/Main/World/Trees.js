import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Trees
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.trees
        this.position = (30, 0, 50)
        this.index = 0
        
        this.debug = this.main.debug


        if(this.debug.active)
        {
            // this.debugFolder = this.debug.ui.addFolder('TV')
        }



        this.createTrees()
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
        this.model.scale.set(0.01, 0.01, 0.01)
        this.model.position.set(0,0,0)
        
        
        this.model.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.5, name: 'white' })
        this.model.material.needsUpdate = true;



        this.model.material = new THREE.MeshStandardMaterial({ color: 0xff4400 })
        this.model.material.needsUpdate = true;

        this.model.name = "tree"

        console.log(this.model)
        
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    child.material.color.set( 0xffffff );
                    

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

        // console.log(this.model)
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
                linearDamping:1
                
            })
            
        this.main.physics.world.addBody(this.body)
    }

    createTrees()
    {
        this.setModel()

        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(60, 0, -100)


    }
    
    update()
    {
        this.model.position.copy(this.body.position)
        this.model.position.y = 0
        this.model.rotation.y = - Math.PI * 2

    }
}