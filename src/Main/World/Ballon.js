import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Ballon
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.setShape()
        this.setBody()

    }

    setGeometry()
    {
        this.geometry = new THREE.SphereBufferGeometry(5, 20, 20)
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
        this.meshBallon = new THREE.Mesh(this.geometry, this.material)
        this.meshBallon.rotation.x = - Math.PI * 0.5
        //this.meshBallon.receiveShadow = true
        console.log('mon ballon : ', this.meshBallon)
        console.log('ma scene : ', this.scene)
        this.scene.add(this.meshBallon)
    }




    setShape()
    {
        this.shape = new CANNON.Sphere(5)

    }

    setBody()
    {
        this.body = new CANNON.Body({
                mass:3,
                position: new CANNON.Vec3(0,3,0),
                shape:this.shape,
                material:this.main.physics.world.defaultMaterial
            })
            
        this.body.position.copy(this.body.position)
        this.main.physics.world.addBody(this.body)


    }


    update()
    {
        this.meshBallon.position.copy(this.body.position)
    }
}