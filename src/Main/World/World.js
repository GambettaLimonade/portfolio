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
import Room from './Room.js';
import Cylindre from './Cylindres.js';



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
        this.cylinders = []

        this.ballonsPosition = [(0,0,0)]
        this.cylindersValues = {
            'position' : [[-90,0,70],[-80,3,80], [-60,0, 100], [-60,0, 70], [-65,0, 95], [-50, 0, 60], [-90, 0, 50], [-80, 0, 30], [-80, 0, 50]],
            'diametre' : [5, 3, 2, 4, 4, 3, 6, 1, 4, 3],
            'hauteur' : [25, 20, 30, 10, 70, 35, 20, 40, 100, 70]
        }
        

        this.bricksPosition = [(0,1,0)]
        
        
        this.resources.on('ready', () =>
        {
            for(var i=0; i<this.bricksPosition.length; i++)
            {
                this.bricks.push(new Bricks(this.bricksPosition[i]))
            }
            this.points = new Points()
            this.floor = new Floor()
            this.sky = new Sky()
            this.soldier = new Soldier()
            // this.couch = new Couch()
            this.table = new Table()
            // this.bigcouch = new Bigcouch()
            this.tv = new Tv()
            // this.floor1 = new Floor1()
            // this.floor2 = new Floor2()

            this.room = new Room()

            for(var i=0; i<this.ballonsPosition.length; i++)
            {
                this.ballons.push(new Ballon(this.ballonsPosition[i]))
            }

            for(var i=0; i<this.cylindersValues['position'].length; i++)
            {
                console.log(this.cylindersValues['position'])
                this.cylinders.push(new Cylindre(this.cylindersValues['position'][i], this.cylindersValues['diametre'][i], this.cylindersValues['hauteur'][i]))
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

        if(this.cylinders)
        {
            for(var cylinder of this.cylinders)
                cylinder.update()
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

        if (this.room)
        {
            this.room.update()
        }

    }
    
}