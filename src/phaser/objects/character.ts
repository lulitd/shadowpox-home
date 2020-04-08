import { gConfigTrail,gConfigPlayer} from '../data/gameConfig'

export enum CharacterState {
  None,
  Home,
  Healthy,
  Sick,
  Quarantine,
  Dead
}

export default class Character extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  state: CharacterState;
  lastEnounter: number = 0;
  unscaleVelocity: Phaser.Math.Vector2;
  cId: number;
  graphics: Phaser.GameObjects.Graphics;
  geomCircle: Phaser.Geom.Circle;
  readonly TEXTURE_WIDTH: number = 42;
  readonly TEXTURE_HEIGHT: number = 72;



  constructor(scene: Phaser.Scene, x: number, y: number, velMin: number = 50, velMax: number = 100) {
    super(scene, x, y, 'character')
    this.setOrigin(0.5, 0);
    this.play("walk", true, Math.floor(Math.random() * 30));
    scene.add.existing(this)

    this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this);

    this.body.setCollideWorldBounds(true, 1, 1);
    this.body.onWorldBounds = true;

    this.unscaleVelocity = new Phaser.Math.Vector2(1, 1);
    this.body.setVelocity(this.unscaleVelocity.x, this.unscaleVelocity.y);

    const xVel = Phaser.Math.Between(velMin, velMax) * (Math.random() > 0.5 ? 1 : -1);

    const yVel = Phaser.Math.Between(velMin, velMax) * (Math.random() > 0.5 ? 1 : -1);


    this.setVelocity(xVel, yVel);

    this.flipX = this.body.velocity.x < 0;
    scene.physics.add.existing(this, false);

    this.setState(CharacterState.Healthy);
    this.body.setMaxVelocity(100, 100);

    this.geomCircle = new Phaser.Geom.Circle(x, y, this.height * 0.5 * this.scaleY);
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x000000, 1);

    this.resizeToFitDisplay(scene.game.scale.width, scene.game.scale.height);
    this.body.setMaxSpeed(100);
  }

  setID(id: number) {
    this.cId = id;
  }

  resizeToFitDisplay(width: number, height: number, prevWidth?: number, prevHeight?: number, displayPrecent: number = 0.05) {
    const isLandscape = width > height;
    const conWidth = displayPrecent * width;
    const conHeight = displayPrecent * height;


    const newScale = isLandscape ? (conWidth / this.TEXTURE_WIDTH) : (conHeight / this.TEXTURE_HEIGHT);

    if (prevHeight == undefined) prevHeight = height;
    if (prevWidth == undefined) prevWidth = width;

    // ENSURE CHARACTER IS ON SCREEN
    const relX = this.x / prevWidth;
    const relY = this.y / prevHeight;
    this.setPosition(width * relX, height * relY);
    this.setScale(Math.min(newScale, 1));

    this.setVelocity();
  }

  drawCircle() {
    this.geomCircle.radius = this.TEXTURE_HEIGHT * 0.6 * this.scaleY;
    this.geomCircle.setPosition(this.x, this.y + (this.scaleY * this.height * 0.5));
    this.graphics.clear();
    const current = this.tintTopLeft;
    this.graphics.fillStyle(0xffffff-current, 1);
    this.graphics.lineStyle(2, current, 1);
    this.graphics.fillCircleShape(this.geomCircle);
    this.graphics.strokeCircleShape(this.geomCircle);
    this.graphics.setDepth(this.depth - 1);

  }
  setVelocity(x?: number, y?: number) {

    if (x !== undefined) {
      this.unscaleVelocity.x = x;
      if (y === undefined)
        this.unscaleVelocity.y = x;
    }
    if (y !== undefined) this.unscaleVelocity.y = y;
    this.body.setVelocity(this.unscaleVelocity.x * this.scaleX, this.unscaleVelocity.y * this.scaleY);
  }

  animate() {
    const currentState = this.state;

    switch (currentState) {
      case CharacterState.None:

        break;
      case CharacterState.Healthy:
        this.play("walk", true);
        break;
      case CharacterState.Home:

        break;
      case CharacterState.Sick:
        this.play("sick", true);
        this.setTint(0xffffff);
        break;
      case CharacterState.Dead:
        this.setTexture('character', 'dead-figure.png');
        this.setTint(0xffffff);
        this.drawCircle();
        break;

      default:
        break;
    }
    this.flipX = this.body.velocity.x < 0;

  }

  updatePhysics() {
    const currentState = this.state;
    if (!this.body) return;

    switch (currentState) {
      case CharacterState.None:
        this.setVelocity(0);
        this.body.enable = false;
        break;
      case CharacterState.Healthy:
        this.body.enable = true;
        break;
      case CharacterState.Home:
        this.setVelocity(0);
        this.body.enable = false;
        break;
      case CharacterState.Sick:

        this.body.enable = true;
        break;
      case CharacterState.Dead:
        this.setVelocity(0);
        this.body.enable = false;
        break;

      default:
        break;
    }
  }

  getInfected(how?:string) {

    const precent = Math.random();
    const currentTime = this.scene.game.getTime() / 1000;

    const val = how=='contact'?gConfigPlayer.infectionRate:gConfigTrail.infectionRate;
  
    // adding a buffer between checks
    if (currentTime - this.lastEnounter > 0.2) {
      if (precent <= val) {
        let vel = this.unscaleVelocity;
        vel.x = vel.x * 0.5;
        vel.y = vel.y * 0.5;
        this.setVelocity(vel.x, vel.y);
        this.setState(CharacterState.Sick);
        this.emit('gotSick');

        const rate = Phaser.Math.Between(gConfigTrail.deathCall.min ?? 3, gConfigTrail.deathCall.max ?? 14);
        this.scene.time.addEvent({
          delay: 1000 * rate,
          callback: this.died,
          callbackScope: this,
          loop: false
        });
      }
    }
    this.lastEnounter = this.scene.game.getTime() / 1000;
  }

  died() {
    const precent = Math.random();
    if (precent <= gConfigTrail.deathRate) {
      this.setID(this.cId * -1);
      this.setState(CharacterState.Dead);
    }
  }


  update() {
    if (!this.scene) return;
    this.updatePhysics();
    this.animate();
    this.depth = this.y + this.height / 2;
  }
}