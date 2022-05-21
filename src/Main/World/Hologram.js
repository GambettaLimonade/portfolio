import Main from "../Main";
import * as THREE from 'three'
import CANNON from 'cannon'

export default class Hologram
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.resource = this.resources.items.holo
        this.setModel()
        
    }


    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(5,5,5)
        this.model.position.set(-20,10,20)
        this.scene.add(this.model)




        this.model.traverse((child) =>
        {
        
            if (child.geometry)
            {
                console.log(child.geometry.boundingSphere)
                child.geometry.computeBoundingSphere()
            }

            if(child.isObject3D)
            {
                child.frustumCulled = false;
            }

        })



    }
    
    update()
    {
    }
}