import Phaser from "phaser";
import React,{Component} from "react";
import preloadScene from "../phaser/scenes/preloadScene";
import gameScene from "../phaser/scenes/gameScene";
import {gConfigGeneral} from "../phaser/data/gameConfig";

const DEFAULT_WIDTH = window.innerWidth;
const DEFAULT_HEIGHT = window.innerHeight; 

export default class Game extends Component{

    componentDidMount(){

      const configSettings = gConfigGeneral; 

      console.log(configSettings);
        const config:Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            backgroundColor: configSettings.background??0x000,
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
                  debug: configSettings.debug??false,
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