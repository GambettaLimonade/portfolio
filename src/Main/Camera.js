import Main from "./Main.js"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.main = new Main()
        this.sizes = this.main.sizes
        this.scene = this.main.scene
        this.canvas = this.main.canvas

        this.setInstance()
        this.setOrbitControls()



    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(30, this.sizes.width / this.sizes.height, 10, 2000)
        this.instance.position.y = 20
        this.scene.add(this.instance)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.set(0, 0, -10)
        this.controls.enableDamping = true
        this.controls.maxPolarAngle = Math.PI * 0.45
        
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()

    }
}