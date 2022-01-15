import Main from "../Main";
import * as THREE from 'three'

export default class Soldier
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.time = this.main.time
        this.debug = this.main.debug

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('soldier')
        }

        //Setup
        this.resource = this.resources.items.soldier

        this.setModel()
        this.setAnimation()
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }


    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(5,5,5)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[1])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()


        //Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle : () => { this.animation.play('idle')},
                playRunning : () => { this.animation.play('running')}

            }

            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playRunning')
        }

    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}