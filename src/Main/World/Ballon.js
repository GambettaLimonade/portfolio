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
        this.radius = 1
        this.position = position
        this.yarnTexture = this.resources.items.yarn

        this.createBall()
        
    }

    setGeometry()
    {
        this.geometry = new THREE.SphereBufferGeometry(this.radius, 20, 20)
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial(
            {
            metalness: 0.3,
            roughness: 0.4,
            // map: this.yarnTexture
            }
        )
    }

    setMesh()
    {
        this.meshBallon = new THREE.Mesh(this.geometry, this.material)
        this.meshBallon.rotation.x = - Math.PI * 0.5
        this.meshBallon.castShadow = true
        this.scene.add(this.meshBallon)
    }




    setShape()
    {
        this.shape = new CANNON.Sphere(this.radius)

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

    createBall()
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
        this.meshBallon.position.copy(this.body.position)
    }
}