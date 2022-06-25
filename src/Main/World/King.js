import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class King
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.diametreKing = 2
        this.resource = this.resources.items.king
        this.position = (0, 0, 0)
        this.camera = this.main.camera
        this.createKing()
        
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(2, 2, 2)
        this.model.position.set(0,0,0)
        this.model.name = "king"
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    child.name = "king"
                }
            }
        )
    }

    setShape()
    {
        this.shape = new CANNON.Box(new CANNON.Vec3(this.diametreKing, this.diametreKing, this.diametreKing))
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

    createKing()
    {
        this.setModel()
        this.setShape()
        this.setBody()
        this.body.position = new CANNON.Vec3(-30, 0, 20)
    }
          
    update()
    {
        this.body.position.y = -3
        this.model.position.copy(this.body.position)
    }
}