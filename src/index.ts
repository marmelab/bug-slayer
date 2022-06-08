import Phaser from "phaser";
import backgroundImage from "./assets/background.jpg";
import platform from "./assets/platform.png";
import mainCharacter from "./assets/mainCharacter.png";

class BugSlayer extends Phaser.Scene {
  #player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #platforms!: Phaser.Physics.Arcade.StaticGroup;

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
    this.#platforms = this.physics.add.staticGroup();
    this.#platforms.create(640, 680, "ground").setScale(6, 4).refreshBody();
    this.#platforms.create(100, 600, "ground").setScale(0.5, 4).refreshBody();
    this.#platforms.create(400, 600, "ground").setScale(0.5, 4).refreshBody();
    this.#platforms.create(800, 600, "ground").setScale(0.5, 4).refreshBody();

    this.#player = this.physics.add.sprite(100, 450, "mainCharacter");
    this.#player.setScale(2);
    this.#player.setCollideWorldBounds(true);
    this.physics.add.collider(this.#player, this.#platforms);
    this.#player.body.setGravityY(320);
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.#player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      this.#player.setVelocityX(160);
    } else {
      this.#player.setVelocityX(0);
    }

    if (cursors.up.isDown && this.#player.body.touching.down) {
      this.#player.setVelocityY(-330);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: BugSlayer,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
