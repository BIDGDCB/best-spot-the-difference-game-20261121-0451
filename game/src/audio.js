// All sound is synthesised with WebAudio — no audio files, no network.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type = 'sine', vol = 0.12) {
  if (muted) return;
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + at);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  } catch (err) {
    // Audio is decoration; a blocked context must never break the game.
  }
}

export const sfx = {
  click() { tone(660, 0, 0.06, 'triangle', 0.05); },
  found() { tone(880, 0, 0.12); tone(1318, 0.09, 0.18); },
  wrong() { tone(160, 0, 0.18, 'sawtooth', 0.07); tone(110, 0.1, 0.2, 'sawtooth', 0.06); },
  hint() { tone(523, 0, 0.1, 'sine', 0.08); tone(784, 0.08, 0.14, 'sine', 0.08); },
  win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22)); },
  lose() { [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.24, 'triangle', 0.09)); },
  tick() { tone(980, 0, 0.05, 'square', 0.04); },
};
