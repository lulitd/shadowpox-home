import PlayerCharacter from '../objects/player';
import FPS from "../objects/fps";
import Character, { CharacterState } from '../objects/character';
import { Physics, Scene, GameObjects, Actions, Geom } from 'phaser';
import { gConfigGeneral, gConfigNeighbourhood, gNeighbour, debugColors, gConfigPlayer, gConfigTrail } from '../data/gameConfig'
import Listener from "../Listener";
import { GAME_EVENTS } from "../data/const";


export default class MainScene extends Scene {
  player: PlayerCharacter;
  allNeighbours: Phaser.Physics.Arcade.Group;
  sickNeighbours: Phaser.Physics.Arcade.Group;
  home: Phaser.Physics.Arcade.Sprite;
  // home_char: GameObjects.Sprite;
  FPS: FPS;
  trailManager: GameObjects.Particles.ParticleEmitterManager;
  trail: GameObjects.Particles.ParticleEmitter;
  public static readonly neighbourLimit = 99;
  gameLength: number = 1000 * 60;
  timeRemaining: number = 60;
  CenterBounds:Geom.Rectangle; 
  InnerBounds: Geom.Rectangle;
  OuterBounds: Geom.Rectangle;
  DebugMode: boolean = false;
  score: number = 0;
  activateDistancing: boolean;

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
    //@ts-ignore
    this.activateDistancing = this.game.propsFromReact.stayed;



    this.cameras.main.setBounds(0, 0, this.game.scale.width, this.game.scale.height);

    //PLAYER SETUP
    this.player = new PlayerCharacter(this, initWidth * playerSettings.spawnLocation.x, initHeight * playerSettings.spawnLocation.y);
    this.player.isHome = true;

    if (this.DebugMode) {
      this.player.setTint(debugColors.player ?? 0x00ff00);
    }
    this.home = this.physics.add.sprite(initWidth * playerSettings.spawnLocation.x, initHeight * playerSettings.spawnLocation.y, "stay_home");

    this.home.setTint(0x000000);
    this.home.setCircle(200, -100, -100);
    this.home.setScale(0.5, 0.5);
    this.home.setImmovable(true);
    this.home.setBounce(0);

    // this.home_char = this.add.sprite(initWidth * playerSettings.spawnLocation.x, initHeight * playerSettings.spawnLocation.y, 'home_char');


    // this.home_char.play("wave", true, Math.floor(Math.random() * 30));
    // this.home_char.setTint(0x000000);
    // this.home_char.setOrigin(0.5,0.25);
    // this.home_char.setScale(0.5, 0.5);
    // this.home_char.visible= this.playerStayed;
    //

    this.player.isControlled(playerSettings.isControlled ?? true);
    // Trail setup
    this.trailManager = this.add.particles('particle');
    this.trailManager.setDepth(-1000);

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

    this.activateTrail(!this.player.isHome);

    // Neighbours setup
    this.allNeighbours = this.physics.add.group({
      maxSize: MainScene.neighbourLimit
    });
    this.sickNeighbours = this.physics.add.group({
      maxSize: MainScene.neighbourLimit
    });

    this.InnerBounds = new Geom.Rectangle(0, 0, this.game.scale.width, this.game.scale.height);
    const centerW = this.game.scale.width*0.25;
    const centerH = this.game.scale.height*0.25;
    this.CenterBounds = new Geom.Rectangle(this.game.scale.width*0.5-centerW*0.5,this.game.scale.height*0.5-centerH*0.5, centerW, centerH);

    this.OuterBounds = new Geom.Rectangle(-100, -100, this.game.scale.width + 200, this.game.scale.height + 200);

    const inverseNeighbours = 1 / MainScene.neighbourLimit;

    this.time.addEvent({
      repeat: MainScene.neighbourLimit,
      callback: () => {

        const spawnPoint = Geom.Rectangle.RandomOutside(this.OuterBounds, this.InnerBounds);
        const neighbour = new Character(this, spawnPoint.x, spawnPoint.y);
        neighbour.setTint(gNeighbour.tint);
        this.allNeighbours.add(neighbour);
        neighbour.resizeToFitDisplay(this.scale.width, this.scale.height, this.scale.width, this.scale.height, gNeighbour.relScale);
        neighbour.setID(this.allNeighbours.getLength());

        neighbour.once('gotSick', (neighbour: Character) => { this.neighbourGotSick(neighbour) }, this);
        neighbour.once('hospitalized', (neighbour: Character) => { this.neighbourHospitalized(neighbour) }, this);
        neighbour.body.setCollideWorldBounds(true,1,1);
        neighbour.shouldSeperate = this.activateDistancing;
      },
      delay: this.gameLength * inverseNeighbours * (gConfigNeighbourhood.spawnedPrecent ?? 0.75),
      startAt: gConfigGeneral.gameStartDelay ?? 3,
    });


    // game timer set up
    this.timeRemaining = gConfigGeneral.gameLength;
    this.time.addEvent({
      delay: 1000,
      callback: this.onCountdown,
      callbackScope: this,
      loop: true,
      startAt: gConfigGeneral.gameStartDelay ?? 3
    });

    // SETUP EVENT LISTENERS
    this.input.keyboard.on('keydown-D', () => {
      this.toggleDebug();
    });

    this.scale.on('resize', (gameSize) => {
      this.onResize(gameSize.width, gameSize.height);
    })

    this.physics.world.on('worldbounds', this.onWorldBounds);

    // @ts-ignore
    if (window.phaserEvents === undefined) {
      // @ts-ignore
      window.phaserEvents = new Listener();
    }
    // @ts-ignore
    window.phaserEvents.addListener(
      GAME_EVENTS.GAME_OVER,
      () => this.gameOver()
    );

    this.onResize(initWidth, initHeight);

  }



  onResize = (width: number, height: number) => {
    this.cameras.resize(width, height);
    this.physics.world.pause();

    const prevBounds = this.physics.world.bounds;
    this.player.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height, gConfigPlayer.relScale);

    Actions.Call(this.allNeighbours.getChildren(), (neighbour: Character) => {
      neighbour.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height, gNeighbour.relScale);
    }, this);

    Actions.Call(this.sickNeighbours.getChildren(), (neighbour: Character) => {
      neighbour.resizeToFitDisplay(width, height, prevBounds.width, prevBounds.height, gNeighbour.relScale);
    }, this);

    this.home.body.reset(width * gConfigPlayer.spawnLocation.x, height * gConfigPlayer.spawnLocation.y);
    // this.home.setScale(0.75 *this.player.scaleX, 0.75*this.player.scaleY);
    this.home.setScale(0.75 * this.player.scale);

    // this.home_char.setPosition(width * gConfigPlayer.spawnLocation.x, height * gConfigPlayer.spawnLocation.y);
    // this.home_char.setTint(0x000000);
    // this.home_char.setScale(0.8 * this.player.scale);

    this.physics.world.setBounds(0, 0, width, height);
    this.physics.world.resume();

    this.trail.startFollow(this.player, 0, this.player.height * this.player.scaleY * 0.75);


  }

  onWorldBounds(body: { gameObject: any; velocity: Phaser.Math.Vector2 }) {

    let char = body.gameObject;
    let dir = body.velocity;
    char.flipX = dir.x < 0; // flip based on their direction. 

    //@ts-ignore
    this.scene.physics.accelerateTo(body.gameObject,this.scene.CenterBounds.getRandomPoint(),100,100,100);



  }

  update() {
    if (!this.game) return;
    this.FPS.update();
    this.player.update();
    this.player.isHome = false;

    this.FPS.setVisible(this.DebugMode);
    this.player.setTint(this.DebugMode ? debugColors.player : gConfigPlayer.tint);

    this.physics.world.overlap(this.home, this.player, this.playerIsHome, null, this);

    this.activateTrail(!this.player.isHome);

    if (this.game.getFrame() % gConfigTrail.colisionCheck) {
      this.trail.forEachAlive(this.virusCheck, this);
    }
    Actions.Call(this.allNeighbours.getChildren(), (neighbour: Character) => {
      neighbour.update();
    }, this);

    // checking home
    this.physics.world.collide(this.home, [this.allNeighbours, this.sickNeighbours], this.neighbourHouseCollision);

    // player infecting neighbours
    this.physics.world.overlap(this.player, this.allNeighbours, this.playerCollides, this.checkIfNeighbourSick);

    // sick infecting neighbours
    this.physics.world.overlap(this.sickNeighbours, this.allNeighbours, this.playerCollides, this.checkIfNeighbourSick);

  }

  playerIsHome(home, player) {

    if (player instanceof PlayerCharacter) {
      player.isHome = true;
    }
  }

  playerCollides(player, neighbour) {
    if (neighbour instanceof Character && !(neighbour instanceof PlayerCharacter)) {
      neighbour.getInfected('contact');
    }
  }

  checkIfNeighbourSick(player, neighbour) {
    if (neighbour instanceof Character && !(neighbour instanceof PlayerCharacter)) {
      return neighbour.state === CharacterState.Healthy;
    }
    return false;
  }
  neighbourHouseCollision(home, obj2) {

    if (obj2 instanceof Character && !(obj2 instanceof PlayerCharacter)) {

      let newXVelocity = Math.abs(obj2.body.velocity.x) + 25;
      let newYVelocity = Math.abs(obj2.body.velocity.y) + 25;
      if (home instanceof Phaser.Physics.Arcade.Sprite) {
        if (obj2.x < home.body.left) {
          obj2.body.setVelocityX(-newXVelocity);
        } else {
          obj2.body.setVelocityX(newXVelocity);
        }

        if (obj2.y < home.body.top) {
          obj2.body.setVelocityY(-newYVelocity);
        } else {
          obj2.body.setVelocityY(newYVelocity);
        }
      }

    }
  }



  toggleDebug() {
    this.DebugMode = !this.DebugMode;
  }

  activateTrail(shouldActivate: boolean) {


    if (this.trail != undefined && this.trail.on != shouldActivate) {
      shouldActivate ? this.trail.start() : this.trail.stop();
    }
  }
  virusCheck(particle: GameObjects.Particles.Particle, emitter: GameObjects.Particles.ParticleEmitter) {

    const impact = this.physics.overlapCirc(particle.x, particle.y, particle.scaleX * gConfigTrail.collisonRadius, true, false);

    if (impact.length <= 0) return;

    impact.forEach((element: Physics.Arcade.Body | Physics.Arcade.StaticBody) => {
      const { gameObject } = element;
      if (gameObject instanceof Character && !(gameObject instanceof PlayerCharacter)) {

        if (gameObject.state != CharacterState.Healthy) return;
        let char = gameObject as Character;

        char.getInfected('trail');

      }
    });
  }


  neighbourHospitalized(neighbour: Character) {

    if (neighbour != undefined) {
      this.sickNeighbours.remove(neighbour);
    }
  }

  neighbourGotSick(neighbour: Character) {

    if (neighbour != undefined) {
      this.sickNeighbours.add(neighbour);

      neighbour.body.setCollideWorldBounds(true, 1,1); //some physics gets resetted when adding to new group...
      neighbour.body.onWorldBounds = true;
      
      neighbour.setVelocity(neighbour.unscaleVelocity.x, neighbour.unscaleVelocity.y);
    }
    this.score++;
    this.updateScore(this.score);
  }

  updateScore(amount: number) {
    // @ts-ignore
    if (window.phaserEvents) {
      // @ts-ignore
      window.phaserEvents.emit(
        GAME_EVENTS.ON_INFECTED,
        amount
      );
    }
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


        const infected = this.getInfectedNeighbours();
        this.game.scene.stop('GameScene');
        // @ts-ignore
        window.phaserEvents.emit(
          GAME_EVENTS.ON_ROUND_END,
          infected
        );

      }
    }
  }

  getInfectedNeighbours(): number[] {

    let infected: number[] = [];

    Actions.Call(this.allNeighbours.getChildren(), (neighbour: Character) => {

      if (neighbour.state === CharacterState.Sick || neighbour.state === CharacterState.Hospitalized)
        infected.push(neighbour.cId);
    }, this);

    return Phaser.Utils.Array.Shuffle(infected);

  }

  gameOver() {
    this.scene.stop("GameScene");
    this.sys.game.destroy(false);
    // TODO FIX CLEAN UP
  }

}
