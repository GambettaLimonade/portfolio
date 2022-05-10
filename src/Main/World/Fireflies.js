import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'
import firefliesVertexShader from '../../shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from '../../shaders/fireflies/fragment.glsl'


export default class Fireflies
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.createFireflies()
        
    }

    setGeometry()
    {
        this.firefliesGeometry = new THREE.BufferGeometry()
        this.firefliesCount = 50
        const positionArray = new Float32Array(this.firefliesCount * 3)
        const scaleArray = new Float32Array(this.firefliesCount)

        for (let i = 0; i < this.firefliesCount; i++)
        {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 100
            positionArray[i * 3 + 1] = (Math.random()) * 60
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 100

            scaleArray[i] = Math.random()
        }
        this.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        this.firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

    }

    setMaterial()
    {
        this.firefliesMaterial = new THREE.ShaderMaterial({
            uniforms: 
            {
                uPixelRatio : { value : Math.min(window.devicePixelRatio, 2) },
                uSize : { value : 25},
                uTime : { value : 0 }
            },
            vertexShader: firefliesVertexShader,
            fragmentShader: firefliesFragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    }

    setMesh()
    {
        this.fireflies = new THREE.Points(this.firefliesGeometry, this.firefliesMaterial)
        this.scene.add(this.fireflies)

    }


    createFireflies()
    {
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    update()
    {
        this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}