import Main from "../Main";
import * as THREE from 'three'


export default class TextScene
{
    constructor()
    {
        this.main = new Main()
        this.scene = this.main.scene
        this.resources = this.main.resources

        this.myText()
    }

    myText()
    {
        const fontLoader = new THREE.FontLoader()

        fontLoader.load( '/fonts/helvetiker_regular.typeface.json', ( font ) => {

            var textGeoFoot = new THREE.TextGeometry( "Big Sports fan !", {
        
                font: font,        
                size: 3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5

        
            } );

            var textGeoProg = new THREE.TextGeometry( "Techno that I know", {
        
                font: font,        
                size: 3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5

        
            } );


            var textGeoChess = new THREE.TextGeometry( "Lets play a Game", {
        
                font: font,        
                size: 3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5

        
            } );


            var textGeoRoom = new THREE.TextGeometry( "Feel free to take a Walk", {
        
                font: font,        
                size: 2,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5

        
            } );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xB1907F } );
        
            var meshSport = new THREE.Mesh( textGeoFoot, textMaterial );
            var meshProg = new THREE.Mesh( textGeoProg, textMaterial );
            var meshChess = new THREE.Mesh( textGeoChess, textMaterial );
            var meshRoom = new THREE.Mesh( textGeoRoom, textMaterial );


            meshSport.position.set(60, 1, -70 );
            meshSport.rotation.x = - Math.PI / 4
            meshSport.castShadow = true


            meshProg.position.set(-81, 1, -73 );
            meshProg.rotation.x = - Math.PI / 4
            meshProg.castShadow = true

            meshRoom.position.set(70, 1, 60 );
            meshRoom.rotation.y = Math.PI 
            meshRoom.rotation.x = Math.PI / 4
            meshRoom.castShadow = true


            this.scene.add( meshSport );
            this.scene.add( meshRoom );
            this.scene.add( meshProg );


        } );
    }

}

