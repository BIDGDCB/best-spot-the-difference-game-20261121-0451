// Draws both panels for the current state: the original on the left, the
// changed copy on the right, then the found markers, the hint pulse, the
// wrong-click flashes, the floating score popups and the keyboard crosshair.
import { disc } from './draw.js';

export function drawPanels(leftCtx, rightCtx, state) {
  const scene = state.level.scene;
  scene.draw(leftCtx, 0);
  scene.draw(rightCtx, 1);
  drawMarkers(leftCtx, state);
  drawMarkers(rightCtx, state);
  drawFlashes(leftCtx, state);
  drawFlashes(rightCtx, state);
  drawHintPulse(leftCtx, state);
  drawHintPulse(rightCtx, state);
  drawFloaters(leftCtx, state);
  drawFloaters(rightCtx, state);
  drawCrosshair(leftCtx, state);
  drawCrosshair(rightCtx, state);
}

function drawMarkers(ctx, state) {
  const found = state.found;
  state.level.scene.differences.forEach((diff, index) => {
    if (!found.has(index)) return;
    const pulse = 1 + 0.06 * Math.sin(performance.now() / 300);
    ctx.save();
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#37d67a';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    disc(ctx, diff.x, diff.y - diff.r - 2, 11, '#37d67a');
    ctx.fillStyle = '#062b16';
    ctx.font = '700 13px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(index + 1), diff.x, diff.y - diff.r - 2);
  });
}

function drawFlashes(ctx, state) {
  const now = performance.now();
  state.flashes = state.flashes.filter((f) => now - f.at < 450);
  for (const flash of state.flashes) {
    const age = (now - flash.at) / 450;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#ff5d5d';
    ctx.lineWidth = 4;
    const s = 12 + age * 6;
    ctx.beginPath();
    ctx.moveTo(flash.x - s, flash.y - s); ctx.lineTo(flash.x + s, flash.y + s);
    ctx.moveTo(flash.x + s, flash.y - s); ctx.lineTo(flash.x - s, flash.y + s);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHintPulse(ctx, state) {
  if (state.hint === null) return;
  const age = (performance.now() - state.hint.at) / 1000;
  if (age > 2.5) return;
  const diff = state.level.scene.differences[state.hint.index];
  const pulse = 1 + 0.35 * Math.sin(age * 8);
  ctx.save();
  ctx.strokeStyle = '#ffd23e';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.9;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r * pulse + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFloaters(ctx, state) {
  const now = performance.now();
  state.floaters = state.floaters.filter((f) => now - f.at < 1100);
  for (const floater of state.floaters) {
    const age = (now - floater.at) / 1100;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    ctx.font = '800 20px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = floater.color;
    ctx.fillText(floater.text, floater.x, floater.y - age * 34);
    ctx.restore();
  }
}

function drawCrosshair(ctx, state) {
  if (state.status !== 'playing' || !state.crosshair.visible) return;
  const { x, y } = state.crosshair;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 210, 62, 0.95)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 19, y); ctx.lineTo(x - 7, y);
  ctx.moveTo(x + 7, y); ctx.lineTo(x + 19, y);
  ctx.moveTo(x, y - 19); ctx.lineTo(x, y - 7);
  ctx.moveTo(x, y + 7); ctx.lineTo(x, y + 19);
  ctx.stroke();
  ctx.restore();
}
