import Phaser from "phaser";
import React,{Component} from "react";
import preloadScene from "../phaser/scenes/preloadScene";
import gameScene from "../phaser/scenes/gameScene";
import {gConfigGeneral} from "../phaser/data/gameConfig";
import { GAME_EVENTS } from "../phaser/data/const";
const DEFAULT_WIDTH = window.innerWidth;
const DEFAULT_HEIGHT = window.innerHeight; 


type GameProp = {
  stayed: boolean,
}

export default class GameComponent extends Component<GameProp,{}>{

    componentDidMount(){

      const configSettings = gConfigGeneral; 


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
      
         const game = new Phaser.Game(config);

        // console.log(this.props);

         const {stayed:playerChoice} = this.props;
          //@ts-ignore
          game.propsFromReact={stayed:playerChoice};

    }

    componentWillUnmount(){
      //@ts-ignore
      if (window.phaserEvents) {
        // @ts-ignore
        window.phaserEvents.emit(
          GAME_EVENTS.GAME_OVER,
        );
      }
    }
    shouldComponentUpdate(){
        return false; 
    }

    render(){
        return <div id="phaser-game"/>;
    }

}