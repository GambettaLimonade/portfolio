import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";


export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources

        
        this.resources.on('ready', () =>
        {
            this.floor = new Floor()
            this.soldier = new Soldier
            this.environment = new Environment()
            
        })


        
    }

    update()
    {
        if(this.soldier)
        {
            this.soldier.update()
        }
    }
    
}