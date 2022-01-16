import CANNON from 'cannon'
import Main from '../Main'

export default class Physics
{
    constructor()
    {       
        this.main = new Main()
        this.time = this.main.time

        //World
        this.world = new CANNON.World()
        this.world.gravity.set(0, -9.82, 0)
        
        
        // Materials
        this.defautMaterial = new CANNON.Material('defaut')
        
        this.defautContactMaterial = new CANNON.ContactMaterial(
            this.defautMaterial,
            this.defautMaterial,
                {
                    friction : 10,
                    restitution : 0.5
                }
            )

        this.world.addContactMaterial(this.defautContactMaterial)
        this.world.defaultContactMaterial = this.defautContactMaterial

        this.update()
    }

    update()
    {
        //A REVOIR AVEC TIPHAINE
        this.world.step(1/60, this.time.delta, 3)

    }
    
}