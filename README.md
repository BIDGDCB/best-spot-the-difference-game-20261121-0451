[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/BIDGDCB/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/BIDGDCB/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Spot the Difference — Lantern Nights

A complete, original spot-the-difference game that plays offline in a desktop
browser from its own static files. Two near-identical pictures hang side by
side; find every hidden change before the lanterns burn down.

## The game

Three hand-drawn scenes (all art drawn in code with the Canvas 2D API — no
image files, no network, no copied assets):

1. **Lantern Market** — a festival street at dusk, 7 differences
2. **Cat Café** — rain on the window, cats on the sofa, 8 differences
3. **Harbor Dawn** — first light over the fishing boats, 9 differences

Each scene hides fair-but-sneaky changes: a missing lantern, a sign that
changed its mind, a cat that wandered off, a clock showing a different hour,
a lighthouse lamp gone dark.

## How to play

- **Click** a difference on either picture (or move the crosshair with the
  arrow keys and press **Enter**).
- Found differences get a green ring and a number on both pictures; the
  counter at the top shows how many are still hiding.
- **H** spends a hint (a gold ring pulses around one difference still
  unfound). A wrong click costs 3 seconds and resets your combo.
- Beat the timer to clear a level; leftover time becomes bonus points and
  stars. **P** pauses, **R** restarts, **1–3** switch levels, **M** mutes.

## Run it

```sh
node serve.ts        # then open http://localhost:8080
```

Or open `game/index.html` directly — everything is static files under
`game/`, with no build step and no network requests.

## Layout

- `game/` — the playable game (`index.html`, `styles.css`, `src/`)
  - `src/main.js` — boot, DOM wiring, input, animation loop
  - `src/game.js` — state, rules, timer, scoring, hints
  - `src/scenes.js` — the three hand-drawn scenes and their differences
  - `src/render.js` — both panels, markers, hint pulse, crosshair
  - `src/levels.js` — level metadata
  - `src/audio.js` — synthesised WebAudio sounds (no audio files)
  - `src/draw.js` — small canvas helpers
  - `src/shots.js` — `?shot=` presets that stage real mid-game frames
- `screenshots/` — real renders of the game's own code
- `main.ts` — the make.fun entrypoint: copies `game/` + `screenshots/` to
  `/output` and writes `dossier.json`
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

## Screenshots

`?shot=cover|cafe|harbor|win` stages a real mid-game frame (real level, real
found set, real HUD) for screenshotting — the same code path a player
reaches by playing.

## License

MIT — see [LICENSE](LICENSE).
