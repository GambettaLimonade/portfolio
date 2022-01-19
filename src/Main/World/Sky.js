import Main from "../Main";
import * as THREE from 'three'


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
        this.geometry = new THREE.SphereGeometry(1000, 25, 25);

    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
                    color: '#ADD8E6'
                })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.material.side = THREE.BackSide;

        this.scene.add(this.mesh)
    }


}