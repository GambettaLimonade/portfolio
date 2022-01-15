import Main from "./Main";
import * as THREE from 'three'

export default class Renderer
{
    constructor()
    {
        this.main = new Main()
        this.canvas = this.main.canvas
        this.sizes = this.main.sizes
        this.scene = this.main.scene
        this.camera = this.main.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGL1Renderer(
        {
            canvas: this.canvas,
            antialias: true
        })
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}