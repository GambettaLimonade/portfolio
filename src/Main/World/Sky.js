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
        this.geometry = new THREE.SphereBufferGeometry(200)
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
                    color: '#000000',
                    side: THREE.BackSide
                })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.receiveShadow = true
        this.mesh.name = "sky"
        this.scene.add(this.mesh)
        this.mesh.position.set(0, 10, 0)
    }

}