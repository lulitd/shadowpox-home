import { gConfigTrail, gConfigPlayer } from '../data/gameConfig'

export enum CharacterState {
  None,
  Home,
  Healthy,
  Sick,
  Quarantine,
  Hospitalized,
}


export default class Character extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  state: CharacterState;
  lastEnounter: number = 0;
  unscaleVelocity: Phaser.Math.Vector2;
  cId: number;
  graphics: Phaser.GameObjects.Graphics;
  // Dgraphics: Phaser.GameObjects.Graphics;
  geomCircle: Phaser.Geom.Circle;
  shouldSeperate: boolean;
  readonly TEXTURE_WIDTH: number = 42;
  readonly TEXTURE_HEIGHT: number = 72;
  hasCircle: boolean;

  static readonly ANGLES = [0, 45, 90, 135, 180, 135, -90, -45];
  vels: Array<Phaser.Geom.Point>;
  ends: Array<Phaser.Geom.Point>;

  alphaTweener: Phaser.Tweens.Tween;

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

    // this.Dgraphics = scene.add.graphics();
    // this.Dgraphics.lineStyle(0xff00ff, 1);

    this.resizeToFitDisplay(scene.game.scale.width, scene.game.scale.height);
    this.body.setMaxSpeed(50);

    this.shouldSeperate = false;

    this.vels = [];
    this.ends = [];

    this.alphaTweener = this.scene.tweens.addCounter({
      from:0.0,
      to: 0.4,
      duration: 100,
      yoyo: true,
      ease: 'Power2',
      paused: true
    });
  }

  debateOnSeperate() {
    this.shouldSeperate = !this.shouldSeperate;
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

  drawCircle(alpha?:number) {
    this.geomCircle.radius = this.TEXTURE_HEIGHT * 0.6 * this.scaleY;
    this.geomCircle.setPosition(this.x, this.y + (this.scaleY * this.height * 0.5));
    this.graphics.clear();
    if (!this.hasCircle) return;
    const current = this.tintTopLeft;
    this.graphics.fillStyle(0xffffff - current,alpha??this.alphaTweener.getValue());
    this.graphics.lineStyle(2, current,alpha??this.alphaTweener.getValue());
    this.graphics.fillCircleShape(this.geomCircle);
//    this.graphics.strokeCircleShape(this.geomCircle);
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

    this.drawCircle();
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
        this.body.setSize();
        break;
      case CharacterState.Hospitalized:
        this.setTexture('character', 'dead-figure.png');
        this.setTint(0xffffff);
        this.hasCircle = true;

        this.drawCircle(1);
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
        // this.setVelocity(this.unscaleVelocity.x, this.unscaleVelocity.y);
        this.body.enable = true;
        break;
      case CharacterState.Home:
        this.setVelocity(0);
        this.body.enable = false;
        break;
      case CharacterState.Sick:
        this.body.enable = true;
        break;
      case CharacterState.Hospitalized:
        this.setVelocity(0);
        this.body.enable = false;
        break;

      default:
        break;
    }
  }

  getInfected(how?: string) {

    const precent = Math.random();
    const currentTime = this.scene.game.getTime() / 1000;

    const val = how == 'contact' ? gConfigPlayer.infectionRate : gConfigTrail.infectionRate;

    // adding a buffer between checks
    if (currentTime - this.lastEnounter > 0.2) {

      this.hasCircle = true;

      this.setTint(0x555555);
      this.alphaTweener.play();
      if (precent <= val) {

        this.scene.time.addEvent({
          delay: 25,
          callback: this.becomeSick,
          callbackScope: this,
          loop: false
        });
        const rate = Phaser.Math.Between(gConfigTrail.deathCall.min ?? 3, gConfigTrail.deathCall.max ?? 14);
        this.scene.time.addEvent({
          delay: 1000 * rate,
          callback: this.hospitalized,
          callbackScope: this,
          loop: false
        });
      } else {
        this.scene.time.addEvent({
          delay: 200,
          callback: () => {
            this.hasCircle = false;
            this.setTint(0x000000);
           // this.alphaTweener.stop();
          },
          callbackScope: this,
          loop: false
        });
      }
    }
    this.lastEnounter = this.scene.game.getTime() / 1000;
  }

  becomeSick() {
    let vel = this.unscaleVelocity;
    vel.x = vel.x * 0.5;
    vel.y = vel.y * 0.5;
    this.setVelocity(vel.x, vel.y);

    this.setTint(0xffffff);
    this.setState(CharacterState.Sick);
    this.emit('gotSick', this);
    this.hasCircle = false;
    this.alphaTweener.stop();
  }

  seperation() {
    if (this.body == undefined) return;

    if (Math.random() < 0.2) return;
    const pos = this.body.center;
    const vel_0 = this.body.velocity.clone().normalize();

    Character.ANGLES.forEach((an, i) => {
      if (this.vels.length - 1 < i) {
        this.vels.push(Phaser.Math.Rotate(new Phaser.Geom.Point(vel_0.x, vel_0.y), Phaser.Math.DegToRad(an)));
      } else {
        this.vels[i] = Phaser.Math.Rotate(new Phaser.Geom.Point(vel_0.x, vel_0.y), Phaser.Math.DegToRad(an));
      }
    });

    const distA = this.displayHeight * 1.5;
    const outerRadius = this.displayHeight * 1;

    this.vels.forEach((vel, i) => {
      if (this.ends.length < i) {
        this.ends.push(new Phaser.Geom.Point(pos.x + vel.x * distA, pos.y + vel.y * distA));
      } else {
        this.ends[i] = new Phaser.Geom.Point(pos.x + vel.x * distA, pos.y + vel.y * distA);
      }
    });

    const cols = new Map<Number, Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[]>();

    this.ends.forEach((p, i) => {
      cols.set(i, this.scene.physics.overlapCirc(p.x, p.y, outerRadius, true, true));
    });

    cols.forEach(col => {
      //@ts-ignore
      const contains = col?.indexOf(this.body);
      if (contains >= 0) {
        col.splice(contains, 1);
      }
    });


    cols.forEach((col, i) => {
      if (col.length <= 0) {
        //@ts-ignore
        this.body.velocity.add(this.vels[i.valueOf()]);
      }
    }
    );


  }

  hospitalized() {
    const precent = Math.random();
    if (precent <= gConfigTrail.deathRate) {
      this.setID(this.cId * -1);
      this.setState(CharacterState.Hospitalized);
      this.emit("hospitalized", this);
    }
  }


  update() {
    if (!this.scene) return;
    if (this.shouldSeperate) this.seperation();
    this.updatePhysics();
    this.animate();

    this.depth = this.y + this.height / 2;
  }
}