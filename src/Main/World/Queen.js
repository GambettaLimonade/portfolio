import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Queen
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.diametreQueen = 1
        this.resource = this.resources.items.queen
        this.position = (0, 0, 0)
        this.camera = this.main.camera
        this.createQueen()
        
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.position.set(0,0,0)
        this.model.name = "queen"
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    child.name = "queen"
                }
            }
        )
    }

    setShape()
    {
        this.shape = new CANNON.Box(new CANNON.Vec3(this.diametreQueen, this.diametreQueen, this.diametreQueen))
    }

    setBody()
    {
        this.body = new CANNON.Body({
                mass:0.1,
                shape:this.shape,
                linearDamping:0.8
            })

        this.main.physics.world.addBody(this.body)
    }

    createQueen()
    {
        this.setModel()
        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(-10, 0, 50)
    }

    update()
    {
        this.body.position.y = 0
        this.model.position.copy(this.body.position)
    }
}