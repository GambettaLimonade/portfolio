import Main from "../Main";
import * as THREE from 'three'

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

    }

// /**
//  * Floor
//  */
//  const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(3000, 3000),
//     new THREE.MeshStandardMaterial({
//         color: '#777777',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5


// scene.add(floor)



    setGeometry()
    {
        this.geometry = new THREE.PlaneBufferGeometry(3000, 3000)
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
                    color: '#777777',
                    metalness: 0,
                    roughness: 0.5
                })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}