import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'


export default class Sky
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        this.geometry = new THREE.SphereBufferGeometry(170)
    }

    setMaterial()
    {
        this.material = new THREE.MeshBasicMaterial({
                    color: '#020203',
                    
                })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.name = "sky"
        this.scene.add(this.mesh)
        this.mesh.position.set(0, 0, 0)
        this.mesh.rotation.x = Math.PI 
        this.mesh.material.side = THREE.DoubleSide;

    }

}