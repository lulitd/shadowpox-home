import PlayerCharacter from '../objects/player';
import FPS from "../objects/fps";
import Character, { CharacterState } from '../objects/character';
import { Physics } from 'phaser';

export default class MainScene extends Phaser.Scene {
  player: PlayerCharacter;
  neighbours: Phaser.GameObjects.Group;
  FPS: FPS;
  trailManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  trail: Phaser.GameObjects.Particles.ParticleEmitter;
  public static readonly neighbourLimit = 99;
  gameLength: number = 1000 * 60;
  InnerBounds: Phaser.Geom.Rectangle;
  OuterBounds: Phaser.Geom.Rectangle;
  DebugMode: boolean = false;

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {

    this.FPS = new FPS(this);
    const initWidth = window.innerWidth;
    const initHeight = window.innerHeight;

    this.cameras.main.setBounds(0, 0, this.game.scale.width, this.game.scale.height);

    //PLAYER SETUP
    this.player = new PlayerCharacter(this, initWidth * 0.5, initHeight * 0.5);

    if (this.DebugMode) {
      this.player.setTint(0xaaaaaa);
    }
    this.player.isControlled(false);

    // Trail setup
    this.trailManager = this.add.particles('particle');
    this.trailManager.setDepth(0);
    this.trail = this.trailManager.createEmitter({
      speed: 0,
      scale: { start: 0.75, end: 0 },
      alpha: { start: 1, end: 0 },
      frequency: 500,
      lifespan: this.gameLength * 0.25,
    }).reserve(100).startFollow(this.player, 0, this.player.height * 0.75);

    // Neighbours setup
    this.neighbours = this.add.group({
      maxSize: MainScene.neighbourLimit
    });
    this.InnerBounds = new Phaser.Geom.Rectangle(0, 0, this.game.scale.width, this.game.scale.height);

    this.OuterBounds = new Phaser.Geom.Rectangle(-100, -100, this.game.scale.width + 200, this.game.scale.height + 200);

    this.time.addEvent({
      repeat: 99,
      callback: () => {

        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(this.OuterBounds, this.InnerBounds);
        const neighbour = new Character(this, spawnPoint.x, spawnPoint.y);
        this.neighbours.add(neighbour);
      },
      delay: this.gameLength * 0.01 * 0.75,
    });

    // SETUP EVENT LISTENERS
    this.input.keyboard.on('keydown-D', () => {
      this.toggleDebug();
    });

    this.scale.on('resize', (gameSize) => {
      this.onResize(gameSize.width, gameSize.height);
    })

    this.physics.world.on('worldbounds', this.onWorldBounds);

    this.onResize(initWidth, initHeight);

  }

  onResize = (width: number, height: number) => {
    this.cameras.resize(width, height);
    this.physics.world.pause();

    const prevBounds = this.physics.world.bounds;
    this.player.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height);

    Phaser.Actions.Call(this.neighbours.getChildren(), (neighbour: Character) => {
      neighbour.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height);
    }, this);
    ;

    this.physics.world.setBounds(0, 0, width, height);
    this.physics.world.resume();

    this.trail.startFollow(this.player, 0, this.player.height * 0.75);

  }

  onWorldBounds(body: { gameObject: any; velocity: any; }) {

    let char = body.gameObject;
    let dir = body.velocity;
    char.flipX = dir.x < 0; // flip based on their direction. 
  }

  update() {
    this.FPS.update();
    this.player.update();

    this.FPS.setVisible(this.DebugMode);
    this.player.setTint(this.DebugMode ? 0xff0000 : 0xaaaaaa);


    if (this.game.getFrame() % 15) {
      this.trail.forEachAlive(this.virusCheck, this);
    }
    Phaser.Actions.Call(this.neighbours.getChildren(), (neighbour: Character) => {
      neighbour.update();
    }, this);
  }

  toggleDebug() {
    this.DebugMode = !this.DebugMode;
  }

  virusCheck(particle: Phaser.GameObjects.Particles.Particle, emitter: Phaser.GameObjects.Particles.ParticleEmitter) {


    const impact = this.physics.overlapCirc(particle.x, particle.y, particle.scaleX * 32, true, false);

    if (impact.length <= 0) return;

    impact.forEach((element: Physics.Arcade.Body | Physics.Arcade.StaticBody) => {
      const { gameObject } = element;
      if (gameObject instanceof Character && !(gameObject instanceof PlayerCharacter)) {

        if (gameObject.state!=CharacterState.Healthy) return; 
        let char = gameObject as Character;
        char.setTint(0x00ddff);
        
        let vel = char.unscaleVelocity; 
        vel= vel.scale(0.5);
        char.setVelocity(vel.x,vel.y);
        char.setState(CharacterState.Sick);

      }
    });


  }
}
