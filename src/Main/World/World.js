import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";
import Ballon from './Ballon.js'
import Bricks from "./Bricks.js";
import Sky from "./Sky.js";


export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources
        this.ballons = []
        this.bricks = []
        this.ballonsPosition = [(-1,-1,-1),(1,1,1),(-2,-2,-2),(2,2,2), (-3,-3,-3),(3,3,3)]
        this.bricksPosition = [(0,0,0)]

        this.resources.on('ready', () =>
        {
            this.floor = new Floor()
            this.sky = new Sky()
            console.log(this.sky)
            this.soldier = new Soldier()
            for(var i=0; i<this.ballonsPosition.length; i++)
                this.ballons.push(new Ballon(this.ballonsPosition[i]))
                for(var i=0; i<this.bricksPosition.length; i++)
                this.bricks.push(new Bricks(this.bricksPosition[i]))
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

        if(this.bricks)
        {
            for(var brick of this.bricks)
            brick.update()        }
        }
    
}