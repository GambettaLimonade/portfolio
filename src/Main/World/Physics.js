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
                    friction : 0
                }
            )


        this.heavyMaterial = new CANNON.Material('heavy')
        
            this.heavyContactMaterial = new CANNON.ContactMaterial(
                this.defautContactMaterial,
                this.heavyMaterial,
                    {
                        restitution:0.3
                    }
                )





        this.world.addContactMaterial(this.defautContactMaterial)
        this.world.addContactMaterial(this.heavyContactMaterial)


        this.world.defaultContactMaterial = this.defautContactMaterial

    }

    update()
    {
        //A REVOIR AVEC TIPHAINE
        this.world.step(1/60, this.time.delta, 3)

    }
    
}