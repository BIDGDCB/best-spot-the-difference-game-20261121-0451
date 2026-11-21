// Screenshot scenes behind ?shot=cover|cafe|harbor|win. Each preset drives the
// real game state (real levels, real found sets, real HUD numbers) and lets the
// normal render loop draw it, so a screenshot is a genuine frame of the game
// at a moment a player could reach — never a mock-up.
import { startLevel } from './game.js';

const PRESETS = {
  // The cover: market level, 3 of 7 found (markers on, 4 still hidden),
  // counter and timer both live.
  cover: { level: 0, found: [0, 2, 4], score: 325, timeLeft: 132 },
  // Cat café mid-hunt: 5 of 8 found, 3 still hidden.
  cafe: { level: 1, found: [0, 1, 3, 5, 6], score: 540, timeLeft: 98 },
  // Harbor at dawn: 4 of 9 found, 5 still hidden, and a hint pulse ringing
  // one of the differences that is still out there.
  harbor: { level: 2, found: [1, 3, 6, 8], score: 410, timeLeft: 121, hint: 4 },
  // A finished market level: all 7 found, win card up.
  win: { level: 0, found: [0, 1, 2, 3, 4, 5, 6], score: 964, timeLeft: 87 },
};

/**
 * Apply the named preset to a fresh state and return the overlay the shot
 * should show ('playing' for a mid-game frame, 'won' for the win card).
 * Unknown names fall back to the cover.
 */
export function stageShot(name, state) {
  const preset = PRESETS[name] || PRESETS.cover;
  startLevel(state, preset.level);
  state.score = preset.score;
  state.timeLeft = preset.timeLeft;
  for (const index of preset.found) {
    state.found.add(index);
    state.foundOrder.push(index);
  }
  state.combo = preset.found.length;
  if (preset.hint !== undefined) {
    state.hint = { index: preset.hint, at: performance.now() };
  }
  if (name === 'win') {
    state.status = 'won';
    state.elapsedMs = (state.level.parSeconds - preset.timeLeft) * 1000;
  } else {
    state.status = 'playing';
  }
  return state.status;
}

export function shotNames() {
  return Object.keys(PRESETS);
}
