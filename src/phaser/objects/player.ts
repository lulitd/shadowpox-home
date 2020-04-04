import Character from "../objects/character";

export default class PlayerCharacter extends Character {

  respondToPlayer: boolean;
  respondThres: number = 20;
  respondSpeed: number = 75;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
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





  update() {
    this.updatePhysics();
    this.playerActions();
    this.animate();
    this.depth = this.y + this.height / 2;
  }
}