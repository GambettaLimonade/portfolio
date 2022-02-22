import * as THREE from 'three';
import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";
import Couch from './Couch.js';
import Ballon from './Ballon.js'
import Bricks from "./Bricks.js";
import Sky from "./Sky.js";
import Overlay from "./Overlay.js";
import Points from './Points.js';
import Floor1 from './Floor1.js';
import Floor2 from './Floor2.js';
import Table from './Table.js';
// import Bigcouch from './Bigcouch.js';
import Tv from './Tv.js';



export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.overlay = new Overlay()
        this.resources = this.main.resources

        this.ballons = []
        this.bricks = []

        this.ballonsPosition = [(-1,-1,-1),(1,1,1),(-2,-2,-2),(2,2,2), (-3,-3,-3),(3,3,3)]
        this.bricksPosition = [(0,1,0)]


        this.resources.on('ready', () =>
        {
            this.points = new Points()
            this.floor = new Floor()
            this.sky = new Sky()
            this.soldier = new Soldier()
            this.couch = new Couch()
            this.table = new Table()
            // this.bigcouch = new Bigcouch()
            this.tv = new Tv()
            // this.floor1 = new Floor1()
            this.floor2 = new Floor2()

            for(var i=0; i<this.ballonsPosition.length; i++)
            {
                this.ballons.push(new Ballon(this.ballonsPosition[i]))
            }

            for(var i=0; i<this.bricksPosition.length; i++)
            {
                this.bricks.push(new Bricks(this.bricksPosition[i]))
            }



            this.environment = new Environment()

            
        })


        
    }

    update()
    {
        if(this.points)
        {
            this.points.update()
        }

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
            brick.update()        
        }

        if(this.couch)
        {
            this.couch.update()
        }

        if(this.table)
        {
            this.table.update()
        }

        // if(this.bigcouch)
        // {
        //     this.bigcouch.update()
        // }

        if (this.tv)
        {
            this.tv.update()
        }

    }
    
}