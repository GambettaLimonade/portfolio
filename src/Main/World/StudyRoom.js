import Main from "../Main";
import * as THREE from 'three'

export default class StudyRoom
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.studyroom
        this.index = 0

        this.createStudyRoom()


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(-50,0,0)
        this.model.rotation.y = Math.PI/2
        this.model.name = "StudyRoom"
        this.scene.add(this.model)

    }


    setLights()
    {
        this.lightTv = new THREE.PointLight( 0xeedd82, 1, 100 );
        this.lightTv.position.set( -60, 12, 15 );
        this.scene.add( this.lightTv );

        const sphereSizeTv = 1;
        const pointLightHelperTv = new THREE.PointLightHelper( this.lightT, sphereSizeTv );
        this.scene.add( pointLightHelperTv );



        // this.light = new THREE.PointLight( 0xffffff, 1, 100 );
        // this.light.position.set( 0, 8, 0 );
        // this.scene.add( this.light );

        // const sphereSize = 1;
        // const pointLightHelper = new THREE.PointLightHelper( this.light, sphereSize );
        // this.scene.add( pointLightHelper );



    }






    createStudyRoom()
    {
        this.setModel()
        this.setLights()


    }
    
    update()
    {
    }
}