
  import {debugColors} from "../data/gameConfig"
  export default class FPS extends Phaser.GameObjects.Text {
   
    constructor(scene: Phaser.Scene) {
        super(scene, 10, 10, '', { color: debugColors.text, fontSize: '28px' })
        scene.add.existing(this)
        this.setOrigin(0)
      }
  
      public update() {
        this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
      }
  }