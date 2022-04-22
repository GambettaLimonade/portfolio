import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Cylindre
{
    constructor(position, diametre, hauteur)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.position = position
        this.diametre = diametre
        this.hauteur = hauteur

        this.world2 = this.main.world
        this.sky = this.world2.sky
        this.skyRadius = this.sky.sphereRadius

        this.createCylindre()
        
    }

    setGeometry()
    {
        this.geometry = new THREE.CylinderBufferGeometry(this.diametre, this.diametre, this.hauteur, 32)
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
        this.meshCylindre = new THREE.Mesh(this.geometry, this.material)
        // this.meshCylindre.rotation.x = - Math.PI * 0.5

        this.meshCylindre.castShadow = true
        this.scene.add(this.meshCylindre)
    }




    setShape()
    {
        this.shape = new CANNON.Cylinder (this.diametre, this.diametre, this.hauteur, 32)

    }

    setBody()
    {
        this.body = new CANNON.Body({
                mass:0.1,
                shape:this.shape,
                material:this.main.physics.world.defaultMaterial,
                linearDamping:0.9
                
            })
            
        this.main.physics.world.addBody(this.body)


    }

    createCylindre()
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

        if ((this.meshCylindre.position.x - 0)**2 + (this.meshCylindre.position.z - 0)**2 > ((this.skyRadius**2) - 1000) )
        {
            this.body.position.x = (this.body.position.x + 0.9) 
            this.body.position.z = (this.body.position.z + 0.9)
            // this.releaseKey()
            // bloquer la position du character
        } 
        this.meshCylindre.position.copy(this.body.position)
        this.meshCylindre.position.y = this.hauteur/2
    }
}