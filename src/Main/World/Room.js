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
                            }       
                        }

                        if(child.name == "machinescreen")
                        {


                        }
                    }
                )
            }




    setLights()
    {
        this.lightTv = new THREE.PointLight( 0xffff00, 0.5, 100 );
        this.lightTv.position.set( 42, 8, 10 );
        this.scene.add( this.lightTv );

        const sphereSizeTv = 1;
        const pointLightHelperTv = new THREE.PointLightHelper( this.lightTv, sphereSizeTv );
        this.scene.add( pointLightHelperTv );



        // this.light = new THREE.PointLight( 0xffffff, 1, 100 );
        // this.light.position.set( 0, 8, 0 );
        // this.scene.add( this.light );

        // const sphereSize = 1;
        // const pointLightHelper = new THREE.PointLightHelper( this.light, sphereSize );
        // this.scene.add( pointLightHelper );



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