export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreloadScene' })
    }
  
    preload() {
      this.load.image('particle','assets/img/solid-circle-particle.png');
      this.load.image('stay_home','assets/img/stay-home-house.png');
      this.load.image('out_home','assets/img/go-out-house.png');
   
     
      this.load.atlas('character','assets/sheet/animation.png', 'assets/sheet/animation.json');
       
      this.load.atlas('home_char','assets/sheet/wave.png', 'assets/sheet/wave.json');
    }
  
    create() {
  
      this.anims.create({ key: 'walk', frames: this.anims.generateFrameNames('character',{ 
        start: 0, end: 29, zeroPad:1,
        prefix: 'healthy_', suffix: '.png'
    }), repeat: -1 ,frameRate:30});

    this.anims.create({ key: 'sick', frames: this.anims.generateFrameNames('character',{ 
      start: 0, end: 47, zeroPad:1,
      prefix: 'sick_', suffix: '.png'
  }), repeat: -1 ,frameRate:24});

  this.anims.create({ key: 'wave', frames: this.anims.generateFrameNames('home_char',{ 
    start: 0, end: 374, zeroPad:3,
    prefix: 'wave', suffix: '.png'
}), repeat: -1 ,frameRate:24});
  
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