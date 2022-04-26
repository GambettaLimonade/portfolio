import Main from "../Main";
import * as THREE from 'three'

export default class Room
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.room
        this.images = [this.resources.items.maths78, this.resources.items.ccd, this.resources.items.dbz]
        this.index = 0

        console.log('In the constructor : ', this.images[0])
        this.createRoom()


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.3, 0.3, 0.3)
        this.model.position.set(50,0,0)
        this.model.name = "room"
        this.scene.add(this.model)


        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                    {
                        if (child.name == "tvscreen")
                            {       
                                child.material = new THREE.MeshStandardMaterial(
                                        {
                                            color: 0xffff00
                                        }

                                    )
                                child.material.map = this.images[0]
                                child.material.needsUpdate = true;
                                console.log('Image after mapping : ', child.material.map)
                            }       
                        }
                    }
                )
            }




    setLights()
    {
        this.light = new THREE.PointLight( 0xffff00, 1, 100 );
        this.light.position.set( 42, 8, 10 );
        this.scene.add( this.light );

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper( this.light, sphereSize );
        this.scene.add( pointLightHelper );



    }

    createRoom()
    {
        this.setModel()
        this.setLights()

    }
    
    update()
    {
        this.model.rotation.y = - Math.PI        
    }
}