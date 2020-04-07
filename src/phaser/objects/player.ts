import Character from "../objects/character";
import { gConfigPlayer } from "../data/gameConfig"
export default class PlayerCharacter extends Character {

  respondToPlayer: boolean;
  respondThres: number = 20;
  respondSpeed: number = 75;
  graphics: Phaser.GameObjects.Graphics;
  geomCircle: Phaser.Geom.Circle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.respondThres = gConfigPlayer.respondThres;
    this.respondSpeed = gConfigPlayer.respondSpeed;

    this.geomCircle = new Phaser.Geom.Circle(x, y, this.height * 0.5 * this.scaleY);
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillCircleShape(this.geomCircle);
  }


  isControlled(active: boolean) {
    this.respondToPlayer = active;
  }

  playerActions() {
    if (!this.respondToPlayer) return;

    const pointer = this.scene.input.activePointer;
    const curTime = this.scene.game.getTime();
    const moveTime = pointer.moveTime;

    if (curTime - moveTime < this.respondThres) {
      this.scene.physics.moveToObject(this, pointer, this.respondSpeed);
    }

  }

  animate() {
    super.animate();
    this.drawCircle();
  }


  drawCircle() {
    this.geomCircle.radius = this.height * 0.6 * this.scaleY;
    this.geomCircle.setPosition(this.x, this.y + (this.scaleY * this.height * 0.5));
    this.graphics.clear();
    const current = this.tintTopLeft;
    this.graphics.fillStyle(0xffffff - current, 1);
    this.graphics.fillCircleShape(this.geomCircle);
    this.graphics.setDepth(this.depth - 1);
  }



  update() {
    this.updatePhysics();
    this.playerActions();
    this.animate();
    this.depth = this.y + this.height / 2;
    this.graphics.setDepth(this.depth - 1);
  }
}