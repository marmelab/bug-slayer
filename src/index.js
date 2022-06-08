import Phaser from "phaser";
import backgroundImage from "./assets/background.jpg";
import platform from "./assets/platform.png";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("backgroundImage", backgroundImage);
    this.load.image("ground", platform);
  }

  create() {
    this.add.image(640, 360, "backgroundImage");
    const platforms = this.physics.add.staticGroup();
    platforms.create(640, 680, "ground").setScale(6, 4).refreshBody();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: MyGame,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
