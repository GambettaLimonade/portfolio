import Main from "../Main";
import * as THREE from 'three'


export default class Sky
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.sphereRadius = 200

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

    }



    
    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry(this.sphereRadius, 100, 100);

    }

    setMaterial()
    {
        this.materialSide = new THREE.MeshStandardMaterial(
            {
                    color: '#ADD8E6',
                    side: THREE.BackSide
            })
        this.materialFront = new THREE.MeshStandardMaterial(
            {
                    color: '#FF0000',
                    side: THREE.FrontSide
            })
        this.materials = [this.materialSide, this.materialFront];

        }

    setMesh()
    {

        // const edges = new THREE.EdgesGeometry( this.geometry );
        // const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
        
        
        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshFaceMaterial(this.materials))

        // this.scene.add( line );
        this.scene.add(this.mesh )
    }


}