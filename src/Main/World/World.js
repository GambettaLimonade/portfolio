import Main from "../Main.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Soldier from "./Soldier.js";
import Ballon from './Ballon.js'
import Overlay from "./Overlay.js";
import Points from './Points.js';
import Fireflies from './Fireflies.js';
import BlenderScene from "./BlenderScene.js";
import Queen from "./Queen.js";
import King from "./King.js";
import Sky from "./Sky.js";
import Description from "./Description.js";
import Physics from "./Physics.js";



export default class World
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.overlay = new Overlay()
        this.resources = this.main.resources
        this.ballons = []

        this.ballonsValues = 
        {
            'position' : [[5,0,-0], [-4, 0, 10], [7, 0, 25], [3, 0, 22], [0, 0, -8], [-10, 0, 0]],
            'diametre' : [1.5, 1, 1, 1, 1.8, 1],
            'texture' : ['ballon', 'pokeball', 'pokeball', 'pokeball', 'basketball', 'dbz1'],
            'metalness' : [0.1, 0.9, 0.9, 0.9, 0.1, 0.9]


        }

        
        
        this.resources.on('ready', () =>
        {
            this.floor = new Floor()
            this.sky = new Sky()
            this.soldier = new Soldier()
            this.blenderScene = new BlenderScene()
            this.fireflies = new Fireflies()
            this.queen = new Queen()
            this.king = new King()
            
            for(var i=0; i<this.ballonsValues['position'].length; i++)
            {
                this.ballons.push(new Ballon(this.ballonsValues['position'][i], this.ballonsValues['diametre'][i], this.ballonsValues['texture'][i], this.ballonsValues['metalness'][i]))
            }
            
            this.environment = new Environment()
            this.description = new Description()
            this.physics = new Physics()
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
            {
                ballon.update()
            }
        }


        if (this.blenderScene)
        {
            this.blenderScene.update()
        }

        if (this.fireflies)
        {
            this.fireflies.update()
        }

        if (this.queen)
        {
            this.queen.update()
        }

        if (this.king)
        {
            this.king.update()
        }

        if (this.physics)
        {
            this.physics.update()
        }

    }
    
}