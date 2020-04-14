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
  
  static readonly ANGLES = [0, 45, 90, 135, 180, 135, -90, -45];
  vels: Array<Phaser.Geom.Point>;
  ends: Array<Phaser.Geom.Point>;

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

    this.shouldSeperate=false; 
    
    this.vels = [];
    this.ends = [];
  }

  debateOnSeperate(){
    this.shouldSeperate =! this.shouldSeperate; 
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
    this.graphics.fillStyle(0xffffff - current, 1);
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
        this.body.setSize();
        break;
      case CharacterState.Hospitalized:
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
      if (precent <= val) {
        let vel = this.unscaleVelocity;
        vel.x = vel.x * 0.5;
        vel.y = vel.y * 0.5;
        this.setVelocity(vel.x, vel.y);
        this.setState(CharacterState.Sick);
        this.emit('gotSick', this);

        const rate = Phaser.Math.Between(gConfigTrail.deathCall.min ?? 3, gConfigTrail.deathCall.max ?? 14);
        this.scene.time.addEvent({
          delay: 1000 * rate,
          callback: this.hospitalized,
          callbackScope: this,
          loop: false
        });
      }
    }
    this.lastEnounter = this.scene.game.getTime() / 1000;
  }

  seperation() {
    if (this.body == undefined) return;

    if (Math.random() < 0.2) return;
    // this.Dgraphics.clear();
    const pos = this.body.center;
    const vel_0 = this.body.velocity.clone().normalize();

    Character.ANGLES.forEach((an,i) => {
      if(this.vels.length-1<i){
      this.vels.push(Phaser.Math.Rotate(new Phaser.Geom.Point(vel_0.x, vel_0.y), Phaser.Math.DegToRad(an)));
      } else{
        this.vels[i] = Phaser.Math.Rotate(new Phaser.Geom.Point(vel_0.x, vel_0.y), Phaser.Math.DegToRad(an));
      }
    });

    const distA = this.displayHeight * 1.5;
    const outerRadius = this.displayHeight * 1;

    this.vels.forEach((vel,i) => {
      if(this.ends.length<i){
      this.ends.push(new Phaser.Geom.Point(pos.x + vel.x * distA, pos.y + vel.y * distA));
      } else{
        this.ends[i]=new Phaser.Geom.Point(pos.x + vel.x * distA, pos.y + vel.y * distA);
      }
    });

    const cols = new Map<Number, Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[]>();

    this.ends.forEach((p, i) => {
      cols.set(i, this.scene.physics.overlapCirc(p.x, p.y, outerRadius, true, true));
    });


    // //@ts-ignore
    // const midIndex = MidCol?.indexOf(this.body);
    // //@ts-ignore
    // const leftIndex = LeftCol?.indexOf(this.body);
    // //@ts-ignore
    // const RightIndex = RightCol?.indexOf(this.body);

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

    

    // if (isMid) {
    //   //this.Dgraphics.fillStyle(0xff0000, 0.1);
    //   //@ts-ignore
    //   if (isLeft) this.body.velocity.add(velRight);
    //   //@ts-ignore
    //   if (isRight) this.body.velocity.add(velLeft);
    //  //@ts-ignore
    //   if (!isLeft && !isRight) this.body.velocity.add(velLeft);

    // }
    // // else { 
    // //   this.Dgraphics.fillStyle(0x000000, 0.1); }
    // // this.Dgraphics.fillCircle(PMid.x, PMid.y, midRadius);

    // if (isLeft) {
    //   // this.Dgraphics.fillStyle(0xff0000, 0.1);
    //   //@ts-ignore
    //   this.body.velocity.add(velRight);
    // }
    // // else { this.Dgraphics.fillStyle(0x000000, 0.1); }
    // // this.Dgraphics.fillCircle(PLeft.x, PLeft.y, outerRadius);

    // if (isRight) {
    //   // this.Dgraphics.fillStyle(0xff0000, 0.1);
    //   //@ts-ignore
    //   this.body.velocity.add(velLeft);
    // }
    // // else { this.Dgraphics.fillStyle(0x000000, 0.1); }
    // // this.Dgraphics.fillCircle(PRight.x, PRight.y, outerRadius);

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