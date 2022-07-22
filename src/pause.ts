import gamepadButtons from './utils/gamepadButtons';

export class Pause extends Phaser.Scene {
  #pad?: Phaser.Input.Gamepad.Gamepad;
  constructor() {
    super('Pause');
  }

  create() {
    this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2,
        'Pause',
        {
          color: 'black',
          backgroundColor: 'white',
          fontSize: '40px',
        }
      )
      .setOrigin();
    this.input.keyboard.on('keydown-ESC', () => {
      this.resume();
    });
    if (this.input.gamepad.total === 0) {
      this.input.gamepad.once(
        'connected',
        (pad: Phaser.Input.Gamepad.Gamepad) => {
          this.#pad = pad;
          this.registerPadActions();
        }
      );
    } else {
      this.#pad = this.input.gamepad.pad1;
      this.registerPadActions();
    }
  }

  resume() {
    this.scene.stop();
    this.scene.resume('BugSlayer');
  }

  registerPadActions() {
    if (this.#pad) {
      this.#pad.on('down', (button: number) => {
        if (button === gamepadButtons.START) {
          this.resume();
        }
      });
    }
  }
}
