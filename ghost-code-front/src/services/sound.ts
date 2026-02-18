import { Howl } from 'howler';

const sounds = {
  countdown: new Howl({ src: ['/sounds/countdown.wav'], preload: false }),
  glitch: new Howl({ src: ['/sounds/glitch.wav'], preload: false }),
  success: new Howl({ src: ['/sounds/success.wav'], preload: false }),
  wrong: new Howl({ src: ['/sounds/wrong.wav'], preload: false }),
  click: new Howl({ src: ['/sounds/click.wav'], preload: false }),
  distraction: new Howl({ src: ['/sounds/distraction.wav'], preload: false }),
};

export const playSound = (name: keyof typeof sounds) => {
  const sound = sounds[name];
  if (sound) {
    // If still unloaded, load it (shouldn't happen if preloadSounds was called)
    if (sound.state() === 'unloaded') {
      sound.load();
    }
    sound.play();
  }
};

export const preloadSounds = () => {
  Object.values(sounds).forEach(sound => {
    if (sound.state() === 'unloaded') {
      sound.load();
    }
  });
};