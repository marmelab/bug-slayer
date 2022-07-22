import music from '../assets/musics/peaceful-garden-healing-light-piano.mp3';

const player = new Audio(music);
player.loop = true;

export const loadMusic = () => {
  player.play();
};

export const stop = () => {
  player.pause();
};
export const play = () => {
  player.play();
};
