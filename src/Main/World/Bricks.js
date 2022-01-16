import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Ballon
{
    constructor(position)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.position = position
        this.createBrick()
        
    }

    setGeometry()
    {
        this.geometry = new THREE.BoxBufferGeometry(this.length, this.height, this.height)
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial(
            {
            metalness: 0.3,
            roughness: 0.4
            }
        )
    }

    setMesh()
    {
        this.meshBrick = new THREE.Mesh(this.geometry, this.material)
        this.meshBrick.rotation.x = - Math.PI * 0.5
        this.meshBrick.castShadow = true
        this.scene.add(this.meshBrick)
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
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(this.position)

    }
    
    update()
    {
        this.meshBrick.position.copy(this.body.position)
        this.meshBrick.position.y = this.height / 2

    }
}