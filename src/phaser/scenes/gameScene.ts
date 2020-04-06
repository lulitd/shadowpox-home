import PlayerCharacter from '../objects/player';
import FPS from "../objects/fps";
import Character, { CharacterState } from '../objects/character';
import { Physics, Scene, GameObjects, Actions, Geom } from 'phaser';
import { gConfigGeneral, gConfigNeighbourhood, gNeighbour, debugColors, gConfigPlayer, gConfigTrail } from '../data/gameConfig'
import Listener from "../Listener";
import { GAME_EVENTS } from "../data/const";
export default class MainScene extends Scene {
  player: PlayerCharacter;
  neighbours: GameObjects.Group;
  FPS: FPS;
  trailManager: GameObjects.Particles.ParticleEmitterManager;
  trail: GameObjects.Particles.ParticleEmitter;
  public static readonly neighbourLimit = 99;
  gameLength: number = 1000 * 60;
  timeRemaining;
  InnerBounds: Geom.Rectangle;
  OuterBounds: Geom.Rectangle;
  DebugMode: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
    this.gameLength = 1000 * (gConfigGeneral.gameLength ?? 60);

    // @ts-ignore
    if (window.phaserEvents === undefined) {
      // @ts-ignore
      window.phaserEvents = new Listener();
    }

  }

  create() {
    this.FPS = new FPS(this);
    const initWidth = window.innerWidth;
    const initHeight = window.innerHeight;
    const playerSettings = gConfigPlayer;

    this.cameras.main.setBounds(0, 0, this.game.scale.width, this.game.scale.height);

    //PLAYER SETUP
    this.player = new PlayerCharacter(this, initWidth * playerSettings.spawnLocation.x, initHeight * playerSettings.spawnLocation.y);

    if (this.DebugMode) {
      this.player.setTint(debugColors.player ?? 0x00ff00);
    }
    this.player.isControlled(playerSettings.isControlled ?? true);

    // Trail setup
    this.trailManager = this.add.particles('particle');
    this.trailManager.setDepth(0);
    this.trail = this.trailManager.createEmitter(
      Phaser.Utils.Objects.Merge({ tint: gConfigTrail.tint },
        {
          speed: 0,
          scale: { start: gConfigTrail.startingScale ?? 0.6, end: 0.15 },
          alpha: { start: 1, end: 0.2 },
          frequency: gConfigTrail.frequency ?? 500,
          lifespan: this.gameLength * (gConfigTrail.lifespan ?? 0.25),
        })
    ).reserve(gConfigTrail.limit ?? 100).startFollow(this.player, 0, this.player.height * this.player.scaleY * 0.75);

    // Neighbours setup
    this.neighbours = this.add.group({
      maxSize: MainScene.neighbourLimit
    });
    this.InnerBounds = new Geom.Rectangle(0, 0, this.game.scale.width, this.game.scale.height);

    this.OuterBounds = new Geom.Rectangle(-100, -100, this.game.scale.width + 200, this.game.scale.height + 200);

    const inverseNeighbours = 1 / MainScene.neighbourLimit;

    this.time.addEvent({
      repeat: MainScene.neighbourLimit,
      callback: () => {

        const spawnPoint = Geom.Rectangle.RandomOutside(this.OuterBounds, this.InnerBounds);
        const neighbour = new Character(this, spawnPoint.x, spawnPoint.y);
        neighbour.setTint(gNeighbour.tint);
        this.neighbours.add(neighbour);
        neighbour.resizeToFitDisplay(this.scale.width, this.scale.height, this.scale.width, this.scale.height, gNeighbour.relScale);
      },
      delay: this.gameLength * inverseNeighbours * (gConfigNeighbourhood.spawnedPrecent ?? 0.75),
    });


    // game timer set up

    this.timeRemaining = gConfigGeneral.gameLength;
    this.time.addEvent({
      delay: 1000,
      callback: this.onCountdown,
      callbackScope: this,
      loop: true
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
    this.player.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height, gConfigPlayer.relScale);

    Actions.Call(this.neighbours.getChildren(), (neighbour: Character) => {
      neighbour.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height, gNeighbour.relScale);
    }, this);
    ;

    this.physics.world.setBounds(0, 0, width, height);
    this.physics.world.resume();

    this.trail.startFollow(this.player, 0, this.player.height * this.player.scaleY * 0.75);

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
    this.player.setTint(this.DebugMode ? debugColors.player : gConfigPlayer.tint);


    if (this.game.getFrame() % gConfigTrail.colisionCheck) {
      this.trail.forEachAlive(this.virusCheck, this);
    }
    Actions.Call(this.neighbours.getChildren(), (neighbour: Character) => {
      neighbour.update();
    }, this);
  }

  toggleDebug() {
    this.DebugMode = !this.DebugMode;
  }

  virusCheck(particle: GameObjects.Particles.Particle, emitter: GameObjects.Particles.ParticleEmitter) {

    const impact = this.physics.overlapCirc(particle.x, particle.y, particle.scaleX * gConfigTrail.collisonRadius, true, false);

    if (impact.length <= 0) return;

    impact.forEach((element: Physics.Arcade.Body | Physics.Arcade.StaticBody) => {
      const { gameObject } = element;
      if (gameObject instanceof Character && !(gameObject instanceof PlayerCharacter)) {

        if (gameObject.state != CharacterState.Healthy) return;

        const precent = Math.random();

        if (precent <= gConfigTrail.infectionRate) {
          let char = gameObject as Character;
          if (this.DebugMode) char.setTint(debugColors.sick);
          let vel = char.unscaleVelocity;
          vel = vel.scale(0.5);
          char.setVelocity(vel.x, vel.y);
          char.setState(CharacterState.Sick);
        }
      }
    });
  }

  onCountdown() {

    this.timeRemaining--;

    // @ts-ignore
    if (window.phaserEvents) {
      if (this.timeRemaining >= 0) {
        // @ts-ignore
        window.phaserEvents.emit(
          GAME_EVENTS.ON_TIMER,
          this.timeRemaining
        );
      } else {
        // @ts-ignore
        window.phaserEvents.emit(
          GAME_EVENTS.ON_ROUND_END,
        );

        this.game.scene.stop('GameScene');
      }
    }
  }

}
