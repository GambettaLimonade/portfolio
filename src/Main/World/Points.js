import Main from "../Main.js";
import * as THREE from 'three'
import { Raycaster } from "three";

export default class Points
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.window = this.main.window
        this.sizes = this.main.sizes
        
        this.raycaster = new Raycaster()

        this.points = [
            {
                position: new THREE.Vector3(4, 3, 0),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(10, 3, 1),
                element: document.querySelector('.point-1')
            },
            {
                position: new THREE.Vector3(4, 3, -10),
                element: document.querySelector('.point-2')
            },
            
        ]

        this.camera = this.main.camera
    }


    update()
    {   
        if(this.camera && this.resources.sceneReady)
        {
            for (const point of this.points)
            {
                const screenPosition = point.position.clone()
                screenPosition.project(this.camera.instance)

                this.raycaster.setFromCamera(screenPosition, this.camera.instance)
                const intersects = this.raycaster.intersectObjects(this.scene.children, true)

                if(intersects.length === 0)

                {
                    point.element.classList.add('visible')
                }
                else
                {
                    const intersectionDistance = intersects[0].distance // distance camera et intersection
                    const pointDistance = point.position.distanceTo(this.camera.instance.position) // distance camera objet

                    if (intersectionDistance < pointDistance)
                    {
                        point.element.classList.remove('visible')
                    }
                    else
                    {
                        point.element.classList.add('visible')
                    }
                }


                const translateX = screenPosition.x * this.sizes.width * 0.5
                const translateY = - screenPosition.y * this.sizes.height * 0.5
                point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
            }
        }
    }
}