import Phaser from 'phaser';
import backgroundImage from './assets/background.jpg';
import platform from './assets/platform.png';
import mainCharacter from './assets/mainCharacter.png';
import { loadMusic } from './music/playMusic';
import { playJump } from './sounds/jump';

class BugSlayer extends Phaser.Scene {
  #player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #platforms!: Phaser.Physics.Arcade.StaticGroup;
  #pad?: Phaser.Input.Gamepad.Gamepad;
  #debug!: Phaser.GameObjects.Text;
  audioContext?: AudioContext;
  #analyser?: AnalyserNode;
  #canDoubleJump = false;

  constructor() {
    super('BugSlayer');
    this.audioContext = new AudioContext();
    this.#analyser = this.audioContext?.createAnalyser();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((microphone)=>{
      const microphoneStream = this.audioContext?.createMediaStreamSource(microphone);
      microphoneStream && microphoneStream.connect(this.#analyser as AudioNode);
    });
  }

  preload() {
    this.load.image('backgroundImage', backgroundImage);
    this.load.image('ground', platform);
    this.load.spritesheet('mainCharacter', mainCharacter, {
      frameWidth: 24,
      frameHeight: 24,
    });
    loadMusic();
  }

  create() {
    this.add.image(640, 360, 'backgroundImage');
    this.#debug = this.add.text(0, 0, 'Debug', {
      color: 'black',
      backgroundColor: 'white',
      fontSize: '40px',
    });

    this.#platforms = this.physics.add.staticGroup();
    this.#platforms.create(640, 680, 'ground').setScale(6, 4).refreshBody();
    this.#platforms.create(100, 600, 'ground').setScale(0.5, 4).refreshBody();
    this.#platforms.create(400, 600, 'ground').setScale(0.5, 4).refreshBody();
    this.#platforms.create(800, 600, 'ground').setScale(0.5, 4).refreshBody();

    this.#player = this.physics.add.sprite(100, 450, 'mainCharacter');
    this.#player.setScale(2);
    this.#player.setCollideWorldBounds(true);
    this.physics.add.collider(this.#player, this.#platforms);
    this.#player.body.setGravityY(320);
    this.anims.create({
      key: 'move',
      frames: this.anims.generateFrameNumbers('mainCharacter', {
        start: 4,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('mainCharacter', {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.cameras.main.setBounds(0, 0, 1280, 720, true);
    this.cameras.main.startFollow(this.#player, true, 0.8, 0.8);
    this.cameras.main.setZoom(2);

    if (this.input.gamepad.total === 0) {
      this.input.gamepad.once(
        'connected',
        (pad: Phaser.Input.Gamepad.Gamepad) => {
          this.#pad = pad;
        }
      );
    } else {
      this.#pad = this.input.gamepad.pad1;
    }
  }

  update() {
    let heySound = false;
    if (this.#analyser){
      const pcmData = new Float32Array(this.#analyser.fftSize);
      this.#analyser.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
      heySound = Math.sqrt(sumSquares / pcmData.length) > 0.2;
      
    }
    const cursors = this.input.keyboard.createCursorKeys();
    const padTiltToLeft =
      this.#pad && this.#pad.axes[0].value < -this.#pad.axes[0].threshold;
    const padTiltToRight =
      this.#pad && this.#pad.axes[0].value > this.#pad.axes[0].threshold;
    const XButtonPressed = this.#pad?.X;
    const moveLeft = cursors.left.isDown || padTiltToLeft;
    const moveRight = cursors.right.isDown || padTiltToRight;
    if (moveLeft || moveRight) {
      let acceleration = moveLeft ? -1 : 1;
      if ((padTiltToLeft || padTiltToRight) && this.#pad) {
        acceleration = this.#pad.axes[0].value;
      }
      this.#player.setVelocityX(200 * acceleration);
      this.#player.setFlipX(!!moveLeft);
      this.#player.anims.play('move', true);
    } else {
      this.#player.setVelocityX(0);
      this.#player.anims.play('idle', true);
    }
    const didPressJump = Phaser.Input.Keyboard.JustDown(cursors.up);
    if (didPressJump || XButtonPressed || heySound) {
      if (this.#player.body.onFloor()) {
        this.#canDoubleJump = true;
        this.#player.setVelocityY(-330);
        playJump();
        return;
      } else if (this.#canDoubleJump) {
        this.#canDoubleJump = false;
        this.#player.setVelocityY(-330);
        playJump();
        return;
      } 
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: BugSlayer,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  input: {
    gamepad: true,
  },
};

new Phaser.Game(config);
