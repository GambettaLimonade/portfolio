import Main from "../Main";
import * as THREE from 'three'
import portalTvVertexShader from '../../shaders/portal/tvBed/vertex.glsl'
import portalTvFragmentShader from '../../shaders/portal/tvBed/fragment.glsl'
import portalArcadeVertexShader from '../../shaders/portal/arcadeMachine/vertex.glsl'
import portalArcadeFragmentShader from '../../shaders/portal/arcadeMachine/fragment.glsl'

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

        this.petitScreenTv;
        this.time = this.main.time;
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
                    this.petitScreenTv =  child

                    this.petitScreenTv.material = new THREE.ShaderMaterial({
                        uniforms : 
                        {
                            uTime : { value : 0 },
                            uColorStart : { value : new THREE.Color(0xff0000) },
                            uColorEnd : { value : new THREE.Color(0x0000ff) }

                        },
                        vertexShader : portalTvVertexShader,
                        fragmentShader : portalTvFragmentShader
                    })
                }


                if (child.name == "pCube11_lambert21_0")
                {
                    this.arcadeScreen =  child

                    this.arcadeScreen.material = new THREE.ShaderMaterial({
                        uniforms : 
                        {
                            uTime : { value : 0 },
                            uColorStart : { value : new THREE.Color(0xff00ff) },
                            uColorEnd : { value : new THREE.Color(0x39ff14) }

                        },
                        vertexShader : portalArcadeVertexShader,
                        fragmentShader : portalArcadeFragmentShader
                    })
                }

                // if (child.name == "pCube14_lambert25_0")
                // {
                //     child.material = new THREE.ShaderMaterial({
                //         vertexShader : portalVertexShader,
                //         fragmentShader : portalFragmentShader
                //     })
                // }


                
                // if (child.name == "pCube15_lambert28_0")
                // {
                //     child.material = new THREE.ShaderMaterial({
                //         vertexShader : portalVertexShader,
                //         fragmentShader : portalFragmentShader
                //     })
                // }

                










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
        if (this.petitScreenTv)
        {
            // console.log(this.petitScreenTv)
            this.petitScreenTv.material.uniforms.uTime.value = this.time.elapsed * 0.002
            this.arcadeScreen.material.uniforms.uTime.value = this.time.elapsed * 0.002

            // console.log("voici ma tv : ", this.petitScreenTv)
        }
    }
}