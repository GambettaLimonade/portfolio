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
        this.images = [this.resources.items.it1, this.resources.items.it2, this.resources.items.it3, this.resources.items.it4, this.resources.items.it5, this.resources.items.it6, this.resources.items.it7, this.resources.items.it8, this.resources.items.it9]
        this.imagesAnim = [this.resources.items.snk, this.resources.items.vsc]
        this.index = 0

        this.createStudyRoom()
        this.changeColor()


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(-50,0,0)
        this.model.rotation.y = Math.PI/2
        this.model.name = "StudyRoom"
        this.scene.add(this.model)


        this.model.traverse((child) =>
        {
            if(child.name == "iMac")
            {
                this.screen = child

                setInterval(() => { 
                    this.index = (this.index + 1) % this.images.length
                    this.screen.material.map = this.images[this.index]
                    // this.screen.material.repeat.set(1, 0.5);
                    this.screen.material.needsUpdate = true;

                }, 1000);
            }
        })
    }

    setLights()
    {
        this.lightiMac = new THREE.PointLight( 0xeedd82, 0.5, 100 );
        this.lightiMac.position.set( -60, 12, 15 );
        this.scene.add( this.lightiMac );
        this.lightEcran = new THREE.PointLight( 0xeedd82, 0.5, 100 );
        this.lightEcran.position.set( -60, 10, -8 );
        this.scene.add( this.lightEcran );


        const LightBug = new THREE.PointLightHelper( this.lightEcran, sphereSizeEcran );
        this.scene.add(LightBug)


        const sphereSizeEcran = 1;
        const pointLightHelperEcran = new THREE.PointLightHelper( this.lightEcran, sphereSizeEcran );
        this.scene.add( pointLightHelperEcran );
        const sphereSizeiMac = 1;
        const pointLightHelperiMac = new THREE.PointLightHelper( this.lightiMac, sphereSizeiMac );
        this.scene.add( pointLightHelperiMac );
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