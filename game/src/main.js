// Boot and DOM wiring: canvas clicks, keyboard play, HUD updates, overlays
// and the animation loop. The rules live in game.js, the pictures in
// scenes.js, the drawing in render.js.
import {
  newState, startLevel, clickAt, useHint, togglePause, toggleMute,
  moveCrosshair, tick, formatTime, remainingCount, starsFor, PANEL_W, PANEL_H,
} from './game.js';
import { drawPanels } from './render.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';

const $ = (id) => document.getElementById(id);
const leftCanvas = $('leftCanvas');
const rightCanvas = $('rightCanvas');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
const state = newState();
let completedLevels = new Set();
let lastTick = performance.now();

const OVERLAY_COPY = {
  title: {
    title: 'Lantern Nights',
    text: 'Two pictures hang side by side. They look the same — they are not. Find every hidden change before the lanterns burn down. Some differences are tiny on purpose: a missing lantern, a sign that changed its mind, a cat that wandered off. Three scenes, 24 differences, one sharp eye.',
    button: 'Start playing',
    stats: '',
  },
  paused: {
    title: 'Paused',
    text: 'Take a breath. The lanterns wait for you — the timer is stopped while you are here.',
    button: 'Keep playing',
    stats: '',
  },
};

function showOverlay(kind, statsHtml = '') {
  const copy = OVERLAY_COPY[kind];
  if (kind === 'won') {
    const stars = '★'.repeat(starsFor(state)) + '☆'.repeat(3 - starsFor(state));
    $('overlayTitle').textContent = `${state.level.scene.name} — cleared!`;
    $('overlayText').textContent = `You found all ${state.level.total} differences with ${formatTime(state.timeLeft)} to spare. ${state.wrongClicks === 0 ? 'Not a single wrong click — a perfect hunt.' : `${state.wrongClicks} wrong click${state.wrongClicks > 1 ? 's' : ''} along the way.`}`;
    $('overlayStats').innerHTML = `<div><span class="big">${stars}</span><span class="cap">STARS</span></div><div><span class="big">${state.score}</span><span class="cap">SCORE</span></div><div><span class="big">${state.bestCombo}×</span><span class="cap">BEST COMBO</span></div>`;
    $('overlayBtn').textContent = state.levelIndex < 2 ? 'Next level →' : 'Play again';
  } else if (kind === 'lost') {
    $('overlayTitle').textContent = 'Out of time';
    $('overlayText').textContent = `The lanterns burned down with ${remainingCount(state)} difference${remainingCount(state) === 1 ? '' : 's'} still hiding in the ${state.level.scene.name}. You found ${state.found.size} of ${state.level.total} — try again, now you know where some of them live.`;
    $('overlayStats').innerHTML = `<div><span class="big">${state.found.size}/${state.level.total}</span><span class="cap">FOUND</span></div><div><span class="big">${state.score}</span><span class="cap">SCORE</span></div>`;
    $('overlayBtn').textContent = 'Try again';
  } else {
    $('overlayTitle').textContent = copy.title;
    $('overlayText').textContent = copy.text;
    $('overlayStats').innerHTML = statsHtml || copy.stats;
    $('overlayBtn').textContent = copy.button;
  }
  $('overlay').classList.add('show');
}

function hideOverlay() {
  $('overlay').classList.remove('show');
}

function refreshHud() {
  $('levelName').textContent = state.level.name;
  $('timeLeft').textContent = formatTime(state.timeLeft);
  $('remaining').textContent = `${remainingCount(state)} left`;
  $('score').textContent = state.score;
  $('hints').textContent = state.hintsLeft;
  $('timefill').style.width = `${Math.max(0, (state.timeLeft / state.level.parSeconds) * 100)}%`;
  $('timeLeft').parentElement.classList.toggle('low', state.timeLeft <= 20 && state.status === 'playing');
  $('hintBtn').disabled = state.status !== 'playing' || state.hintsLeft <= 0;
  document.querySelectorAll('#levelTabs button').forEach((btn) => {
    const index = Number(btn.dataset.level);
    btn.classList.toggle('active', index === state.levelIndex);
    btn.classList.toggle('done', completedLevels.has(index));
  });
  const chips = $('foundChips');
  if (state.foundOrder.length === 0) {
    chips.innerHTML = '<em class="none-yet">Nothing yet — click a difference on either picture.</em>';
  } else {
    chips.innerHTML = state.foundOrder
      .map((i) => `<span class="chip">✓ ${state.level.scene.differences[i].label}</span>`)
      .join('');
  }
  const foundNames = state.foundOrder.map((i) => state.level.scene.differences[i].label).join(', ');
  $('status').textContent = state.status === 'playing'
    ? `${remainingCount(state)} differences left in ${state.level.scene.name}. ${foundNames ? `Found: ${foundNames}.` : ''}`
    : '';
}

function afterAction(result) {
  refreshHud();
  if (result === 'won') {
    completedLevels.add(state.levelIndex);
    showOverlay('won');
  } else if (result === 'lost') {
    showOverlay('lost');
  }
}

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

function bindCanvas(canvas) {
  canvas.addEventListener('click', (event) => {
    const point = canvasPoint(event, canvas);
    afterAction(clickAt(state, point.x, point.y));
  });
  canvas.addEventListener('mousemove', (event) => {
    const point = canvasPoint(event, canvas);
    state.crosshair.x = point.x;
    state.crosshair.y = point.y;
  });
}
bindCanvas(leftCanvas);
bindCanvas(rightCanvas);

$('hintBtn').addEventListener('click', () => {
  if (useHint(state)) refreshHud();
});
$('pauseBtn').addEventListener('click', () => {
  const next = togglePause(state);
  if (next === 'paused') showOverlay('paused');
  else hideOverlay();
  refreshHud();
});
$('soundBtn').addEventListener('click', (event) => {
  const muted = toggleMute();
  event.currentTarget.innerHTML = muted ? '&#128263; Muted' : '&#128266; Sound';
});
$('overlayBtn').addEventListener('click', () => {
  hideOverlay();
  if (state.status === 'title') {
    startLevel(state, 0);
  } else if (state.status === 'won') {
    startLevel(state, state.levelIndex < 2 ? state.levelIndex + 1 : 0);
  } else if (state.status === 'lost') {
    startLevel(state, state.levelIndex);
  } else if (state.status === 'paused') {
    togglePause(state);
  }
  refreshHud();
});
document.querySelectorAll('#levelTabs button').forEach((btn) => {
  btn.addEventListener('click', () => {
    startLevel(state, Number(btn.dataset.level));
    hideOverlay();
    refreshHud();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')) return;
  const step = event.shiftKey ? 40 : 12;
  if (event.key === 'ArrowLeft') { moveCrosshair(state, -step, 0); event.preventDefault(); }
  else if (event.key === 'ArrowRight') { moveCrosshair(state, step, 0); event.preventDefault(); }
  else if (event.key === 'ArrowUp') { moveCrosshair(state, 0, -step); event.preventDefault(); }
  else if (event.key === 'ArrowDown') { moveCrosshair(state, 0, step); event.preventDefault(); }
  else if (event.key === 'Enter' || event.key === ' ') {
    if (state.status === 'playing') {
      afterAction(clickAt(state, state.crosshair.x, state.crosshair.y));
      event.preventDefault();
    }
  } else if (event.key === 'h' || event.key === 'H') {
    if (useHint(state)) refreshHud();
  } else if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
    const next = togglePause(state);
    if (next === 'paused') showOverlay('paused');
    else if (next === 'playing') hideOverlay();
    refreshHud();
  } else if (event.key === 'r' || event.key === 'R') {
    startLevel(state, state.levelIndex);
    hideOverlay();
    refreshHud();
  } else if (event.key === 'n' || event.key === 'N') {
    if (state.status === 'won') $('overlayBtn').click();
  } else if (event.key === 'm' || event.key === 'M') {
    $('soundBtn').click();
  } else if (event.key === '1' || event.key === '2' || event.key === '3') {
    startLevel(state, Number(event.key) - 1);
    hideOverlay();
    refreshHud();
  }
});

function frame(now) {
  const dt = Math.min(0.25, (now - lastTick) / 1000);
  lastTick = now;
  tick(state, dt);
  if (state.status === 'lost' && !$('overlay').classList.contains('show')) showOverlay('lost');
  if (state.status === 'playing' && state.timeLeft <= 10 && Math.floor(now / 1000) !== Math.floor((now - dt * 1000) / 1000)) sfx.tick();
  drawPanels(leftCtx, rightCtx, state);
  refreshHud();
  requestAnimationFrame(frame);
}

// Screenshot mode: ?shot=cover|cafe|harbor|win stages a real mid-game frame
// and hides the title overlay so the shot shows the game itself.
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, state);
  hideOverlay();
} else {
  showOverlay('title');
}
refreshHud();
requestAnimationFrame(frame);
