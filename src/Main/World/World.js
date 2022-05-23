import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";
import Ballon from './Ballon.js'
import Sky from "./Sky.js";
import Overlay from "./Overlay.js";
import Points from './Points.js';
import Path from './Path.js';
// import Fireflies from './Fireflies.js';
import BlenderScene from "./BlenderScene.js";
import { Light } from "three";
import Hologram from "./Hologram.js";



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
            'position' : [[-142, 0, 40], [-164, 0, -33], [-64,0,-30], [-37,0,-136], [7,0,-98], [115,0,-137], [141,0,-48], [92,0,11], [122,0,63], [91,0,130]],
            'angletree' : [10, 3, 1, 2, 3, 1, 3, 8, 2, 10]
        }




        this.bricksPosition = [(0,3,0)]
        
        
        this.resources.on('ready', () =>
        {
            // for(var i=0; i<this.bricksPosition.length; i++)
            // {
            //     this.bricks.push(new Bricks(this.bricksPosition[i]))
            // }
            // this.points = new Points()
            this.floor = new Floor()
            this.sky = new Sky()
            this.soldier = new Soldier()



            // this.room = new Room()
            this.blenderScene = new BlenderScene()
            // this.fireflies = new Fireflies()
            this.lights = new Light()
            // this.hologram = new Hologram()
            // this.livingRoom = new LivingRoom()
            // this.text3d = new TextScene()

            // for(var i=0; i<this.ballonsValues['position'].length; i++)
            // {
            //     this.ballons.push(new Ballon(this.ballonsValues['position'][i], this.ballonsValues['diametre'][i]))
            // }

            // for(var i=0; i<this.cylindersValues['position'].length; i++)
            // {
            //     this.cylinders.push(new Cylindre(this.cylindersValues['position'][i], this.cylindersValues['diametre'][i], this.cylindersValues['hauteur'][i]))
            // }

            // for(var i=0; i<this.pathValues['position'].length; i++)
            // {
            //     this.path.push(new Path(this.pathValues['position'][i], this.pathValues['diametre'][i], this.pathValues['hauteur'][i]))
            // }

            // this.firstDeadTree = new DeadTree([20,0,158], 2)
            // for(var i=0; i<this.deadtreeValues['position'].length; i++)
            // {
            //     var newDeadTree = this.firstDeadTree.model.clone();
            //     newDeadTree.position.set(this.deadtreeValues['position'][i][0],this.deadtreeValues['position'][i][1],this.deadtreeValues['position'][i][2]);      
            //     newDeadTree.rotation.x = Math.PI / this.deadtreeValues['angletree'][i]          
            //     this.scene.add(newDeadTree); 

            // }
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


        if (this.blenderScene)
        {
            this.blenderScene.update()
        }

        if (this.fireflies)
        {
            this.fireflies.update()
        }

        // if (this.hologram)
        // {
        //     this.hologram.update()
        // }


    }
    
}