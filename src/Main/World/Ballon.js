import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Ballon
{
    constructor(position, diametre)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.diametre = diametre
        this.position = position
        this.yarnTexture = this.resources.items.yarn

        this.world2 = this.main.world
        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius

        this.createBall()
        
    }

    setGeometry()
    {
        this.geometry = new THREE.SphereBufferGeometry(this.diametre, 20, 20)
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
        this.shape = new CANNON.Sphere(this.diametre)

    }

    setBody()
    {
        this.body = new CANNON.Body({
                mass:0.8,
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
        this.body.position = new CANNON.Vec3(this.position[0],this.position[1], this.position[2])
    }

    update()
    {
        if ((this.meshBallon.position.x - 0)**2 + (this.meshBallon.position.z - 0)**2 > ((this.skyRadius**2) - 1000) )
        {
            this.body.position.x = (this.body.position.x + 0.9) 
            this.body.position.z = (this.body.position.z + 0.9)
            // this.releaseKey()
            // bloquer la position du character
        } 
        this.meshBallon.position.copy(this.body.position)
    }
}