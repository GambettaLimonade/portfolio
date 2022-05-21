import Main from "../Main";
import * as THREE from 'three'
import portalTvVertexShader from '../../shaders/portal/tvBed/vertex.glsl'
import portalTvFragmentShader from '../../shaders/portal/tvBed/fragment.glsl'
import portalArcadeVertexShader from '../../shaders/portal/arcadeMachine/vertex.glsl'
import portalArcadeFragmentShader from '../../shaders/portal/arcadeMachine/fragment.glsl'
import longMiddleScreenVertexShader from '../../shaders/portal/longMiddleScreen/vertex.glsl'
import longMiddleScreenFragmentShader from '../../shaders/portal/longMiddleScreen/fragment.glsl'
import * as POSTPROCESSING from "postprocessing";

export default class BlenderScene
{
    constructor()
    {

        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.length = 10
        this.height = 5
        this.resource = this.resources.items.scene
        this.index = 0
        this.images = [this.resources.items.it1, this.resources.items.it2, this.resources.items.it3, this.resources.items.it4, this.resources.items.it5, this.resources.items.it6, this.resources.items.it7, this.resources.items.it8, this.resources.items.it9]
        this.imagesAnim = [this.resources.items.snk, this.resources.items.vsc]
        this.index = 0

        // this.redTexture = this.resources.items.red
        this.red = this.resources.items.red



        this.petitScreenTv;
        this.time = this.main.time;
        this.createScene()


    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(-30,0,0)
        this.model.rotation.y = Math.PI/2
        this.model.name = "Scene"
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
                            uColorStart : { value : new THREE.Color(0x000fff) },
                            uColorEnd : { value : new THREE.Color(0xff9500) }

                        },
                        vertexShader : portalArcadeVertexShader,
                        fragmentShader : portalArcadeFragmentShader
                    })
                }

                if(child.name == "longMiddleScreen" )
                {
                    this.longMiddleScreen =  child

                    this.longMiddleScreen.material = new THREE.ShaderMaterial({
                        uniforms : 
                        {
                            uTime : { value : 0 },
                            uColorStart : { value : new THREE.Color(0xffffff) },
                            uColorEnd : { value : new THREE.Color(0x000000) }

                        },
                        vertexShader : longMiddleScreenVertexShader,
                        fragmentShader : longMiddleScreenFragmentShader
                    })
                }

                if (child.name == "lightLeftScreen")
                {
                    this.lightLeftScreen =  child
                    this.lightLeftScreen.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    })

                }


                if (child.name == "littleMiddleScreen")
                {
                    this.littleMiddleScreen =  child
                    this.littleMiddleScreen.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    })

                }

                
                if (child.name == "Object_35")
                {
                    this.screenCenter =  child
                    this.screenCenter.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff
                    })

                }


            }
        )

    }

    setLights()
    {
        const sphereSizeEcran = 1;

        this.lightFusee = new THREE.PointLight( 0x15F4EE, 1, 40 );
        this.lightFusee.position.set( 53, 12, -18 );
        this.scene.add( this.lightFusee );
        const lightFuseeHelper = new THREE.PointLightHelper( this.lightFusee, sphereSizeEcran );
        // this.scene.add( lightFuseeHelper );


        this.lightLampadaire = new THREE.PointLight( 0xfe019a, 0.8, 60 );
        this.lightLampadaire.position.set( -71.950, 20, 0.005 );
        this.scene.add( this.lightLampadaire );
        const lightLampadaireHelper = new THREE.PointLightHelper( this.lightLampadaire, sphereSizeEcran );
        // this.scene.add( lightLampadaireHelper );


        this.lightMultipleScreens = new THREE.PointLight( 0xffffff, 1, 30 );
        this.lightMultipleScreens.position.set( 15, 5, 55 );
        this.scene.add( this.lightMultipleScreens );
        const lightMultipleScreensHelper = new THREE.PointLightHelper( this.lightMultipleScreens, sphereSizeEcran );
        // this.scene.add( lightMultipleScreensHelper );

        this.lightArcadeMachine = new THREE.PointLight( 0x39ff14, 1, 40 );
        this.lightArcadeMachine.position.set( 25, 15, -55 );
        this.scene.add( this.lightArcadeMachine );
        const lightArcadeMachineHelper = new THREE.PointLightHelper( this.lightArcadeMachine, 5 );
        // this.scene.add( lightArcadeMachineHelper );







    }






    createScene()
    {
        this.setModel()
        this.setLights()

        // const spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set( 63, 10, -6 );

        // spotLight.castShadow = true;

        // spotLight.shadow.mapSize.width = 1024;
        // spotLight.shadow.mapSize.height = 1024;

        // spotLight.shadow.camera.near = 500;
        // spotLight.shadow.camera.far = 4000;
        // spotLight.shadow.camera.fov = 30;

        // this.scene.add( spotLight );


    }
    
    update()
    {
        if (this.petitScreenTv)
        {
            this.petitScreenTv.material.uniforms.uTime.value = this.time.elapsed * 0.002
        }

        if (this.arcadeScreen)
        {
            this.arcadeScreen.material.uniforms.uTime.value = this.time.elapsed * 0.001
        }

        if (this.longMiddleScreen)
        {
            this.longMiddleScreen.material.uniforms.uTime.value = this.time.elapsed * 0.5
        }

    }
}