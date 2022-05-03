import Main from "../Main";
import * as THREE from 'three'

export default class LivingRoom
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.livingroom
        this.createLivingRoom()

    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1000, 100, 100)
        this.model.position.set(0,0,0)
        this.model.rotation.y = Math.PI/2
        this.model.name = "LivingRoom"
        this.scene.add(this.model)
    }



    createLivingRoom()
    {
        this.setModel()
    }
    
    update()
    {
    }
}