import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Programming
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.python
        this.position = (100, 0, 20)

        this.world2 = this.main.world
        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius




        this.createProgramming()
        
    }

    setModel()
    {
        this.modelPython = this.resource.scene
        this.modelPython.scale.set(1,1,1)
        this.modelPython.position.set(0,0,0)



        this.scene.add(this.modelPython)

        this.modelPython.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    const material = new THREE.MeshStandardMaterial({ color: 0x976C42, metalness: 0.01, roughness: 0.5, name: 'white' })
                    child.material = material;

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

    createProgramming()
    {
        this.setModel()

        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(-100, 0, -100)

    }
    
    update()
    {
        // console.log('position python : ', (this.modelPython.position.x - 0)**2 + (this.modelPython.position.z - 0)**2)
        // console.log('rayon sphère : ', this.skyRadius ** 2)
        // console.log('threejs y rotation : ', this.modelPython.rotation.y)
        // console.log('cannon body quaternion y ', this.body.quaternion)

        if ((this.modelPython.position.x - 0)**2 + (this.modelPython.position.z - 0)**2 > ((this.skyRadius**2) - 1000) )
        {
            this.body.position.x = (this.body.position.x + 0.9) 
            this.body.position.z = (this.body.position.z + 0.9)
            // this.releaseKey()
            // bloquer la position du character
        } 
        
        this.modelPython.position.copy(this.body.position)

    }
}