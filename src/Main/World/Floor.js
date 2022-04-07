import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'


export default class Floor
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
        this.geometry = new THREE.PlaneBufferGeometry(3000, 3000)
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
                    color: '#faa96a',
                    metalness: 0,
                    roughness: 0.5,

                })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    setShape()
    {
        this.floorShape = new CANNON.Plane()
    }

    setBody()
    {
        this.floorBody = new CANNON.Body({
            mass: 0,
            shape: this.floorShape,
            material:this.main.physics.world.defaultMaterial,

        })
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
        this.main.physics.world.addBody(this.floorBody)
    }
}