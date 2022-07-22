import music from '../assets/musics/peaceful-garden-healing-light-piano.mp3';

const player = new Audio(music);
player.loop = true;

export const playMusic = () => {
  player.play();
};

export const pauseMusic = () => {
  player.pause();
};
