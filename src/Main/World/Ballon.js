import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Ballon
{
    constructor(position, diametre, texture)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.diametre = diametre
        this.position = position

        if (texture == "ballon")
        {
            this.resource = this.resources.items.ballon
        }

        else if (texture == "pokeball")
        {
            this.resource = this.resources.items.pokeball
        }
        this.createBall()
    }

    setMaterial()
    {

        // mettre un matierla different //
        this.material = new THREE.MeshStandardMaterial(
            {
            // metalness: 0.3,
            // roughness: 0.4,
            // color : 0xF7F3E7,
            map: this.resource
            }
        )
    }


    setGeometry()
    {
        this.geometry = new THREE.SphereBufferGeometry(this.diametre, 20, 20)
    }





    setMesh()
    {
        this.meshBallon = new THREE.Mesh(this.geometry, this.material)
        this.meshBallon.rotation.x = - Math.PI * 0.5
        this.meshBallon.castShadow = true
        this.meshBallon.name = "ball"

        this.scene.add(this.meshBallon)
    }




    setShape()
    {
        this.shape = new CANNON.Sphere(this.diametre)

    }

    setBody()
    {
        this.body = new CANNON.Body({
                mass:1,
                shape:this.shape,
                // material:this.main.physics.world.defaultMaterial,
                linearDamping:0.3
                
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
        this.body.position = new CANNON.Vec3(this.position[0],this.position[1], this.position[2])
    }

    update()
    {
        if ((this.meshBallon.position.x - 0)**2 + (this.meshBallon.position.z - 0)**2 > ((this.skyRadius**2) - 30) )
        {
            this.body.position.x = (this.body.position.x + 1.2) 
            this.body.position.z = (this.body.position.z + 1.2)
        } 
        this.meshBallon.position.copy(this.body.position)
    }
}