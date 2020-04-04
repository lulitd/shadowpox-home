import Phaser from "phaser";
import React,{Component} from "react";
import preloadScene from "../phaser/scenes/preloadScene";
import gameScene from "../phaser/scenes/gameScene";

const DEFAULT_WIDTH = window.innerWidth;
const DEFAULT_HEIGHT = window.innerHeight; 

export default class Game extends Component{

    componentDidMount(){
        const config:Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            backgroundColor: '#000',
            parent: "phaser-game",
            scale: {
                parent: 'phaser-game',
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                resolution:window.devicePixelRatio,
              },
              physics: {
                default: 'arcade',
                arcade: {
                  debug: false,
                }
            },
            scene: [preloadScene,gameScene]
          };
      
          new Phaser.Game(config);
    }

    shouldComponentUpdate(){
        return false; 
    }

    render(){
        return <div id="phaser-game"/>;
    }

}