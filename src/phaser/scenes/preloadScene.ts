export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreloadScene' })
    }
  
    preload() {
      this.load.image('particle','assets/img/solid-circle-particle.png');
      this.load.atlas('character', 'assets/sheet/walk.png', 'assets/sheet/walk.json');
    }
  
    create() {
  
      this.anims.create({ key: 'walk', frames: this.anims.generateFrameNames('character'), repeat: -1 ,frameRate:30});
  

      this.scene.start('GameScene');
      
    
  
  
      /**
       * This is how you would dynamically import the mainScene class (with code splitting),
       * add the mainScene to the Scene Manager
       * and start the scene.
       * The name of the chunk would be 'mainScene.chunk.js
       * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
       */
      // let someCondition = true
      // if (someCondition)
      //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
      //     this.scene.add('MainScene', mainScene.default, true)
      //   })
      // else console.log('The mainScene class will not even be loaded by the browser')
    }
  }