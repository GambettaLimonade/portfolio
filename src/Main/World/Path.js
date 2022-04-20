import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Path
{
    constructor(position, diametre, hauteur)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.position = position
        this.diametre = diametre
        this.hauteur = hauteur

        this.createPath()
        
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
        this.meshPath = new THREE.Mesh(this.geometry, this.material)
        this.meshPath.castShadow = true
        this.meshPath.position.set(this.position[0],this.position[1], this.position[2])
        this.scene.add(this.meshPath)

    }





    createPath()
    {
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    update()
    {
    }
}