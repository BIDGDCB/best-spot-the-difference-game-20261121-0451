// Game state and rules: levels, timer, scoring, hints, wrong clicks and the
// keyboard crosshair. Rendering lives in render.js, scenes in scenes.js.
import { LEVELS } from './levels.js';
import { sfx, setMuted, isMuted } from './audio.js';

export const PANEL_W = 560;
export const PANEL_H = 420;

export function newState() {
  return {
    levelIndex: 0,
    level: LEVELS[0],
    status: 'title', // title | playing | paused | won | lost
    found: new Set(),
    score: 0,
    combo: 0,
    hintsLeft: LEVELS[0].hints,
    timeLeft: LEVELS[0].parSeconds,
    flashes: [],
    floaters: [],
    hint: null,
    crosshair: { x: PANEL_W / 2, y: PANEL_H / 2, visible: false },
    wrongClicks: 0,
    foundOrder: [],
    startedAt: 0,
    elapsedMs: 0,
    bestCombo: 0,
  };
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.level = LEVELS[index];
  state.found = new Set();
  state.foundOrder = [];
  state.combo = 0;
  state.hintsLeft = state.level.hints;
  state.timeLeft = state.level.parSeconds;
  state.flashes = [];
  state.floaters = [];
  state.hint = null;
  state.wrongClicks = 0;
  state.status = 'playing';
  state.startedAt = performance.now();
  state.elapsedMs = 0;
  state.crosshair = { x: PANEL_W / 2, y: PANEL_H / 2, visible: false };
}

export function remainingCount(state) {
  return state.level.total - state.found.size;
}

export function nearestDifference(state, x, y) {
  let best = -1;
  let bestDist = Infinity;
  state.level.scene.differences.forEach((diff, index) => {
    if (state.found.has(index)) return;
    const dist = Math.hypot(diff.x - x, diff.y - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = index;
    }
  });
  return { index: best, dist: bestDist };
}

export function clickAt(state, x, y) {
  if (state.status !== 'playing') return 'idle';
  const { index, dist } = nearestDifference(state, x, y);
  if (index === -1) return 'done';
  const diff = state.level.scene.differences[index];
  if (dist <= diff.r + 12) {
    state.found.add(index);
    state.foundOrder.push(index);
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const comboBonus = (state.combo - 1) * state.level.comboBonus;
    const gained = state.level.findPoints + comboBonus;
    state.score += gained;
    state.floaters.push({ x: diff.x, y: diff.y, text: `+${gained}`, color: '#ffd23e', at: performance.now() });
    sfx.found();
    if (state.found.size === state.level.total) {
      const timeBonus = Math.round(state.timeLeft) * 2;
      state.score += timeBonus;
      state.status = 'won';
      state.elapsedMs = performance.now() - state.startedAt;
      sfx.win();
      return 'won';
    }
    return 'found';
  }
  state.combo = 0;
  state.wrongClicks += 1;
  state.timeLeft = Math.max(0, state.timeLeft - state.level.wrongPenaltySeconds);
  state.flashes.push({ x, y, at: performance.now() });
  sfx.wrong();
  if (state.timeLeft <= 0) {
    state.status = 'lost';
    sfx.lose();
    return 'lost';
  }
  return 'wrong';
}

export function useHint(state) {
  if (state.status !== 'playing' || state.hintsLeft <= 0) return false;
  const left = state.level.scene.differences.map((d, i) => i).filter((i) => !state.found.has(i));
  if (left.length === 0) return false;
  const pick = left[Math.floor(Math.random() * left.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - state.level.hintCost);
  state.hint = { index: pick, at: performance.now() };
  sfx.hint();
  return true;
}

export function togglePause(state) {
  if (state.status === 'playing') {
    state.status = 'paused';
    return 'paused';
  }
  if (state.status === 'paused') {
    state.status = 'playing';
    state.startedAt = performance.now() - state.elapsedMs;
    return 'playing';
  }
  return state.status;
}

export function toggleMute() {
  setMuted(!isMuted());
  return isMuted();
}

export function moveCrosshair(state, dx, dy) {
  state.crosshair.visible = true;
  state.crosshair.x = Math.max(8, Math.min(PANEL_W - 8, state.crosshair.x + dx));
  state.crosshair.y = Math.max(8, Math.min(PANEL_H - 8, state.crosshair.y + dy));
}

export function tick(state, dtSeconds) {
  if (state.status !== 'playing') return;
  state.timeLeft -= dtSeconds;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.status = 'lost';
    sfx.lose();
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function starsFor(state) {
  if (state.status !== 'won') return 0;
  const ratio = state.timeLeft / state.level.parSeconds;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}
