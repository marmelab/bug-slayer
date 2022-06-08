import Phaser from "phaser";
import backgroundImage from "./assets/background.jpg";
import platform from "./assets/platform.png"; //32px height
import mainCharacter from "./assets/mainCharacter.png";
// 24 image, 576px

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("backgroundImage", backgroundImage);
    this.load.image("ground", platform);
    this.load.spritesheet("mainCharacter", mainCharacter, {
      frameWidth: 24,
      frameHeight: 24,
    });
  }

  create() {
    this.add.image(640, 360, "backgroundImage");
    const platforms = this.physics.add.staticGroup();
    platforms.create(640, 680, "ground").setScale(6, 4).refreshBody();
    platforms.create(100, 600, "ground").setScale(0.5, 4).refreshBody();
    platforms.create(400, 600, "ground").setScale(0.5, 4).refreshBody();
    platforms.create(800, 600, "ground").setScale(0.5, 4).refreshBody();

    const player = this.physics.add.sprite(100, 450, "mainCharacter");
    player.setScale(2);
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    this.physics.add.collider(player, platforms);
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
