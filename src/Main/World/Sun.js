import Main from "../Main";
import * as THREE from 'three'

export default class Sun
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.light;
        this.setSun()

    }

    setSun()
    {
        this.light = new THREE.PointLight( 0xFDB813, 1, 100 );
        this.light.position.set( 0, 20, 0 );
        this.scene.add( this.light );
    }

    update()
    {        
        this.light.position.x = Math.cos(this.time.elapsed * 0.0002) * 100
        this.light.position.z = Math.sin(this.time.elapsed * 0.0002) * 100
    }
}