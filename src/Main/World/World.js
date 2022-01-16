import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";
import Ballon from './Ballon.js'


export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.ballons = []
        
        this.resources.on('ready', () =>
        {
            this.floor = new Floor()
            this.soldier = new Soldier()
            for(var i=0; i<10; i++)
                this.ballons.push(new Ballon())

            this.environment = new Environment()
            
        })


        
    }

    update()
    {
        if(this.soldier)
        {
            this.soldier.update()
        }

        if(this.ballons)
        {
            for(var ballon of this.ballons)
                ballon.update()
        }
    }
    
}