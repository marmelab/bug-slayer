import Phaser from "phaser";
import backgroundImage from "./assets/background.jpg";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("backgroundImage", backgroundImage);
  }

  create() {
    const logo = this.add.image(640, 360, "backgroundImage");
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: MyGame,
};

const game = new Phaser.Game(config);
