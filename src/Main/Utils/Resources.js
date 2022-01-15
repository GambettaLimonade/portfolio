import EventEmitter from "./EventEmitter";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Set up
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        // this.loaders.gltfLoader.load(
        //         '/models/Soldier.glb',
        //         (gltf) =>
        //         {
            //         character_walk = gltf.scene
            
            
            //         scene.add(character_walk)
            
            //         gltf.scene.position.set(0, 0, 0)
            
            //         gltf.scene.rotation.y = Math.PI
            //         gltf.scene.scale.set(5,5,5)
            
            
            //         //character_walk.children[0].children[0].castShadow = true; //default
            //         character_walk.children[0].children[1].castShadow = true; //default
            //         //character_walk.children[0].children[2].castShadow = true; //default
            
            
            //         character = gltf
            //         mixer = new THREE.AnimationMixer(character_walk)
            //         action_avancer = mixer.clipAction(character.animations[1])
            //         action_tourner = mixer.clipAction(character.animations[0])
                    
            //         document.addEventListener('keydown', (event) => {
            //                 arrow[event.key] = true;
            //          }, false);
            
            //          document.addEventListener('keyup', (event) => {
            //             delete arrow[event.key];
            //             action_avancer.stop();
            //             action_tourner.stop();
            //         }, false);   
                // })

            this.loaders.textureLoader = new THREE.TextureLoader()
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if (source.type == 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file =>
                        {
                            this.sourceLoaded(source, file)
                        })
                )
            }
            else if (source.type == 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file =>
                        {
                            this.sourceLoaded(source, file)
                        })
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }


}