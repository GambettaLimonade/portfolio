import EventEmitter from "./EventEmitter";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import Main from "../Main";


export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.main = new Main()
        this.overlay = this.main.overlay
        this.sources = sources
        this.debug = this.main.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Textures')
        }


        // Set up
        this.loadingBarElement = document.querySelector('.loading-bar')
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        this.sceneReady = false
        this.loadingManager = new THREE.LoadingManager(
            () =>
            {
                gsap.delayedCall(0.5, () => {
                    gsap.to(this.main.world.overlay.material.uniforms.uAlpha, { duration: 3, value : 0})
                    this.loadingBarElement.classList.add('ended')
                    this.loadingBarElement.style.transform = ''
                })
                gsap.delayedCall(2, () => {
                    this.sceneReady = true
                })
            },

            (itemUrl, itemsLoaded, itemsTotal) =>
            {
                const progressRatio = itemsLoaded / itemsTotal
                this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
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
                            if(this.debug.active)
                            {       
                                file.encoding = THREE.sRGBEncoding;        
                                file.flipY = false;
                                file.rotation = Math.PI / 2
                                file.wrapS = 10;
                                file.wrapT = 20;
                                file.repeat.set( 3,3 );
                                this.debugFolder
                                .add(file.repeat, 'x', 0, 5)
                                .name(`${source.name}.repeat.x`);
                                this.debugFolder
                                .add(file.repeat, 'y', 0, 5)
                                .name(`${source.name}.repeat.y`);
                                this.debugFolder
                                .add(file.offset, 'x', -2, 2)
                                .name(`${source.name}.offset.x`);
                                this.debugFolder
                                .add(file.offset, 'y', -2, 2)
                                .name(`${source.name}.offset.y`);
                                this.debugFolder
                                .add(file.center, 'x', -.5, 1.5, .01)
                                .name(`${source.name}.center.x`);
                                this.debugFolder
                                .add(file.center, 'y', -.5, 1.5, .01)
                                .name(`${source.name}.center.y`);
                            }
                            
                            file.encoding = THREE.sRGBEncoding;        
                            file.flipY = false;
                            file.rotation = Math.PI / 2
                            file.wrapS = 10;
                            file.wrapT = 20;
                            file.rotate = Math.PI / 2
                            file.repeat.set( 3,3 );


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