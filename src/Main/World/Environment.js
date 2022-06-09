import Main from "../Main";
import * as THREE from 'three'

export default class Environment
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene

        this.setSunLight()
        this.setAmbiantLight()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 0.6)
        this.sunLight.castShadow = true
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.camera.far = 200
        this.sunLight.shadow.camera.left = 200
        this.sunLight.shadow.camera.top = 200
        this.sunLight.shadow.camera.right = - 200
        this.sunLight.shadow.camera.bottom = - 200       
        this.sunLight.position.set(5, 100, 5)
        this.scene.add(this.sunLight)
    }

    setAmbiantLight()
    {
        // this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
        // this.scene.add(this.ambientLight)
    }
}