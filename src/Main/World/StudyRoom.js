import Main from "../Main";
import * as THREE from 'three'
import portalVertexShader from '../../shaders/portal/vertex.glsl'
import portalFragmentShader from '../../shaders/portal/fragment.glsl'


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


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(-30,0,0)
        this.model.rotation.y = Math.PI/2
        this.model.name = "StudyRoom"
        this.scene.add(this.model)


        
        this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                }
                
                if (child.name == "Cube036_1")
                {
                    child.material = new THREE.ShaderMaterial({
                        uniforms : 
                        {
                            uTime : { value : 0 }
                        },
                        vertexShader : portalVertexShader,
                        fragmentShader : portalFragmentShader
                    })
                }


                if (child.name == "pCube11_lambert21_0")
                {
                    child.material = new THREE.ShaderMaterial({
                        vertexShader : portalVertexShader,
                        fragmentShader : portalFragmentShader
                    })
                }

                if (child.name == "pCube14_lambert25_0")
                {
                    child.material = new THREE.ShaderMaterial({
                        vertexShader : portalVertexShader,
                        fragmentShader : portalFragmentShader
                    })
                }


                
                if (child.name == "pCube15_lambert28_0")
                {
                    child.material = new THREE.ShaderMaterial({
                        vertexShader : portalVertexShader,
                        fragmentShader : portalFragmentShader
                    })
                }

                










            }
        )


        // this.model.traverse((child) =>
        // {
        //     if(child.name == "iMac")
        //     {
        //         this.screen = child

        //         setInterval(() => { 
        //             this.index = (this.index + 1) % this.images.length
        //             this.screen.material.map = this.images[this.index]
        //             // this.screen.material.repeat.set(1, 0.5);
        //             this.screen.material.needsUpdate = true;

        //         }, 1000);
        //     }
        // })
    }

    setLights()
    {

        this.lightEcran = new THREE.PointLight( 0xFFFFFF, 0.5, 100 );
        this.lightEcran.position.set( 56, 12, -13 );
        this.scene.add( this.lightEcran );
        const sphereSizeEcran = 1;
        const pointLightHelperEcran = new THREE.PointLightHelper( this.lightEcran, sphereSizeEcran );
        this.scene.add( pointLightHelperEcran );



        this.lightEcran2 = new THREE.PointLight( 0xFFFFFF, 1, 100 );
        this.lightEcran2.position.set( 30, 13, 55 );
        this.scene.add( this.lightEcran2 );
        const pointLightHelperEcran2 = new THREE.PointLightHelper( this.lightEcran2, sphereSizeEcran );
        this.scene.add( pointLightHelperEcran2 );



    }






    createStudyRoom()
    {
        this.setModel()
        // this.setLights()


    }
    
    update()
    {
        
    }
}