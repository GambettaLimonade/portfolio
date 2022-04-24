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

//Commentaire

// import Bigcouch from './Bigcouch.js';
import Tv from './Tv.js';
import Room from './Room.js';
import Cylindre from './Cylindres.js';
import Sun from './Sun.js';
import Path from './Path.js';
import Python from './Python.js';
import Html from './Html.js';
import Css from './Css.js';
import TextScene from './TextScene.js';
import Blender from './Blender.js';
import Threejs from './Threejs.js';
import Windows from './Windows.js';
import DeadTree from './DeadTree.js';



export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.overlay = new Overlay()
        this.resources = this.main.resources

        this.ballons = []
        this.cylinders = []
        this.bricks = []
        this.path = []
        this.deadtrees = []
        

        this.ballonsValues = 
        {
            'position' : [[100,0,-100], [90,0,-105], [103,0,-101], [80,0,-95], [93,0,-104], [99,0,-97]],
            'diametre' : [3, 1, 2, 1.5, 0.5, 1.2]

        }
        this.cylindersValues = 
        {
            'position' : [[-90,0,70],[-80,3,80], [-60,0, 100], [-60,0, 70], [-65,0, 95], [-50, 0, 60], [-90, 0, 50], [-80, 0, 30], [-80, 0, 50]],
            'diametre' : [5, 3, 2, 4, 4, 3, 6, 1, 4, 3],
            'hauteur' : [25, 20, 30, 10, 70, 35, 20, 40, 100, 70]
        }
        
        //var pathRoomCylinder = [[20,0,100], [10,0,103], [0,0,99], [-10,0,99], [-20,0,95], [-30,0,94], [-40,0,92]]
        // var pathRoomBalls = [90, 0, 90], [100, 0, 70]

        this.pathValues = {
            'position' : [[-114, 0, 34],[-103, 0, 8],[-98, 0, -8],[-98, 0, -22],[-96, 0, -44],[-98, 0, -68],[-101, 0, 90],[85, 0, -118],[61, 0, -120],[40, 0, -121],[20, 0, -122],[1, 0, -122],[-25, 0, -119],[-50, 0, -112],[-76, 0, -105],[102, 0, -70], [104, 0, -60], [105, 0, -50], [104, 0, -40], [102, 0, -25], [105, 0, -10], [107, 0, 10], [107, 0, 30],[105, 0, 50], [100, 0, 70], [90, 0, 90], [20,0,100], [10,0,103], [0,0,99], [-10,0,99], [-20,0,95], [-30,0,94], [-40,0,92]],
            'diametre' : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            'hauteur' : [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
        }


        this.deadtreeValues = {
            'position' : [[-142, 0, 40], [-164, 0, -33]],
        }

        this.yellowtreeValues = {
            'position' : [[-10, 0, -40], [-20, 0, -33]],
        }



        this.bricksPosition = [(0,3,0)]
        
        
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
            this.table = new Table()
            this.python = new Python()
            this.blender = new Blender()
            this.threejs = new Threejs()
            this.windows = new Windows()
            this.html = new Html()

            this.css = new Css()


            this.tv = new Tv()

            this.room = new Room()
            this.text3d = new TextScene()

            for(var i=0; i<this.ballonsValues['position'].length; i++)
            {
                this.ballons.push(new Ballon(this.ballonsValues['position'][i], this.ballonsValues['diametre'][i]))
            }

            for(var i=0; i<this.cylindersValues['position'].length; i++)
            {
                this.cylinders.push(new Cylindre(this.cylindersValues['position'][i], this.cylindersValues['diametre'][i], this.cylindersValues['hauteur'][i]))
            }

            for(var i=0; i<this.pathValues['position'].length; i++)
            {
                this.path.push(new Path(this.pathValues['position'][i], this.pathValues['diametre'][i], this.pathValues['hauteur'][i]))
            }

            this.firstDeadTree = new DeadTree([-36,0,107])
            for(var i=0; i<this.deadtreeValues['position'].length; i++)
            {
                var newDeadTree = this.firstDeadTree.model.clone();
                newDeadTree.position.set(this.deadtreeValues['position'][i][0],this.deadtreeValues['position'][i][1],this.deadtreeValues['position'][i][2]);                
                this.scene.add(newDeadTree); 

            }
            this.environment = new Environment()
            this.sun = new Sun()            
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


        if(this.python)
        {
            this.python.update()
        }

        if(this.blender)
        {
            this.blender.update()
        }

        if(this.threejs)
        {
            this.threejs.update()
        }

        if(this.windows)
        {
            this.windows.update()
        }

        if(this.html)
        {
            this.html.update()
        }

        if(this.css)
        {
            this.css.update()
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


        if(this.sun)
        {
            this.sun.update()
        }

    }
    
}