import jump from '../assets/sounds/jump.mp3';

const player = new Audio(jump);

export const playJumpSound = () => {
  player.currentTime = 0;
  player.play();
};
