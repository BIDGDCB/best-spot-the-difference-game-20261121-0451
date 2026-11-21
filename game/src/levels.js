// Level metadata: the human-facing facts the HUD, the tabs and the win
// screen read. The pictures themselves live in scenes.js.
import { SCENES } from './scenes.js';

export const LEVELS = SCENES.map((scene, index) => ({
  index,
  scene,
  name: `${index + 1} · ${scene.name}`,
  total: scene.differences.length,
  parSeconds: scene.parSeconds,
  hints: 3,
  wrongPenaltySeconds: 3,
  findPoints: 100,
  hintCost: 50,
  comboBonus: 25,
}));

export function levelLabel(index) {
  return LEVELS[index].name;
}
