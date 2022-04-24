import Main from "../Main";
import * as THREE from 'three'

export default class DeadTree
{
    constructor(position)
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.position = position
        this.resource = this.resources.items.deadTree
        this.setModel()
        
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.12, 0.12, 0.12)
        this.model.position.set(this.position[0],this.position[1], this.position[2])
        this.model.name = "tree"
        // this.model.material.color.setHex( 0Xff0000)
        this.scene.add(this.model)

        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {   
                    // child.material.color.setHex( 0xeeecf1 )
                    child.castShadow = true
                }
            }
        )

        this.model.children[0].children[0].children[0].material.color.setHex(0x00000f)
        this.model.children[0].children[0].children[1].material.color.setHex(0xC2C2B4)


    }
}