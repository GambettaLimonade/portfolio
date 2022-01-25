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