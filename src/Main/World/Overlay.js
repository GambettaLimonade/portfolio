import Main from "../Main.js";
import * as THREE from 'three'

export default class Overlay
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.debug = this.main.debug
        this.world = this.main.world

        
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }


    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: 
            {
                uAlpha: { value : 1}
            },
            vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
            `,
            fragmentShader: `
            uniform float uAlpha;

            void main()
            {
                gl_FragColor = vec4(173, 216, 230, uAlpha);
            }
            `
        })
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
       
        this.scene.add(this.mesh)
    }

    update()
    {

    }
}