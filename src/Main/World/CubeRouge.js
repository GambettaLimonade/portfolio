import Main from "../Main";
import * as THREE from 'three'

export default class CubeRouge
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.cuberouge
        this.index = 0

        this.createCube()


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(-50,0,0)
        this.model.name = "cuberouge"
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
                {

                    if (child.name == "ArdoiseVerte")
                        {    
                            child.visible = false;
                        }       
                    }
                }
            )


    }






    createCube()
    {
        this.setModel()

    }
    
    update()
    {
    }
}