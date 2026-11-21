// The three hand-drawn scenes. Each scene draws itself twice: variant 0 is the
// original (left panel), variant 1 is the changed copy (right panel). The
// differences list gives the click target of every change, in panel pixels
// (each panel is 560 x 420). Nothing here is copied from any existing game:
// the market, the cafe and the harbour are all drawn from scratch.
import { rr, disc, star, text } from './draw.js';

function nightSky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 420);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 420);
}

function drawCat(ctx, x, y, scale, fill) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.beginPath(); // body
  ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath(); // head
  ctx.arc(13, -12, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath(); // ears
  ctx.moveTo(6, -18); ctx.lineTo(8, -26); ctx.lineTo(12, -18);
  ctx.moveTo(14, -19); ctx.lineTo(17, -27); ctx.lineTo(20, -18);
  ctx.fill();
  ctx.beginPath(); // tail
  ctx.moveTo(-14, 2);
  ctx.quadraticCurveTo(-26, -6, -20, -16);
  ctx.quadraticCurveTo(-15, -8, -10, -2);
  ctx.fill();
  ctx.fillStyle = '#1c1426';
  ctx.beginPath(); ctx.arc(15, -13, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawLantern(ctx, x, y, r, color, lit) {
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 2, x, y, r * 2.2);
    glow.addColorStop(0, 'rgba(255, 190, 90, 0.55)');
    glow.addColorStop(1, 'rgba(255, 190, 90, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
  }
  ctx.fillStyle = '#3a2a12';
  ctx.fillRect(x - 1, y - r - 6, 2, 6);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.72, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(60, 20, 0, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.4, r, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffd23e';
  ctx.fillRect(x - 3, y - r - 2, 6, 3);
  ctx.fillRect(x - 3, y + r - 1, 6, 3);
}

function drawStall(ctx, x, awningColors, signGlyph, signColor, goods) {
  // posts and counter
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x + 6, 185, 8, 115);
  ctx.fillRect(x + 136, 185, 8, 115);
  ctx.fillStyle = '#8a5a30';
  rr(ctx, x, 240, 150, 60, 6);
  ctx.fill();
  ctx.fillStyle = '#6e4525';
  ctx.fillRect(x, 240, 150, 10);
  // striped awning
  const n = awningColors.length;
  for (let i = 0; i < n; i += 1) {
    ctx.fillStyle = awningColors[i];
    ctx.fillRect(x + (i * 150) / n, 150, 150 / n, 34);
  }
  ctx.fillStyle = awningColors[0];
  ctx.beginPath();
  ctx.moveTo(x, 184);
  for (let i = 0; i < n; i += 1) ctx.arc(x + (i * 150) / n + 150 / n / 2, 184, 150 / n / 2, 0, Math.PI);
  ctx.fill();
  // hanging round sign
  ctx.strokeStyle = '#3a2a12';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 75, 118); ctx.lineTo(x + 75, 126); ctx.stroke();
  disc(ctx, x + 75, 140, 17, signColor);
  ctx.strokeStyle = '#ffd98a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x + 75, 140, 17, 0, Math.PI * 2); ctx.stroke();
  text(ctx, signGlyph, x + 75, 141, 17, '#fff');
  goods(ctx, x);
}

function marketGoodsTea(ctx, x) {
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = '#e8f2f0';
    ctx.beginPath(); ctx.arc(x + 35 + i * 38, 232, 13, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#7fb069';
    ctx.fillRect(x + 28 + i * 38, 226, 14, 4);
  }
  text(ctx, 'TEA', x + 75, 285, 13, '#ffd98a');
}

function marketGoodsFruit(ctx, x) {
  const spots = [[40, 228], [62, 220], [84, 228], [52, 236], [76, 236]];
  for (const [dx, dy] of spots) disc(ctx, x + dx, dy, 10, '#ff8c42');
  disc(ctx, x + 62, 210, 9, '#ff6b35');
  ctx.fillStyle = '#4e9b47';
  ctx.fillRect(x + 60, 198, 3, 8);
  text(ctx, 'FRUIT', x + 75, 285, 13, '#ffd98a');
}

function marketGoodsFlowers(ctx, x) {
  const cols = ['#ff6b9d', '#c77dff', '#ffd23e'];
  for (let i = 0; i < 3; i += 1) {
    ctx.strokeStyle = '#4e9b47';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + 35 + i * 38, 238); ctx.lineTo(x + 35 + i * 38, 214); ctx.stroke();
    disc(ctx, x + 35 + i * 38, 208, 11, cols[i]);
    disc(ctx, x + 35 + i * 38, 208, 4, '#fff');
  }
  text(ctx, 'FLOWERS', x + 75, 285, 12, '#ffd98a');
}

export const SCENE_MARKET = {
  id: 'market',
  name: 'Lantern Market',
  subtitle: 'A festival street at dusk',
  parSeconds: 150,
  differences: [
    { x: 80, y: 62, r: 26, label: "Moon's craters" },
    { x: 280, y: 80, r: 16, label: 'Lantern on the string' },
    { x: 280, y: 168, r: 30, label: 'Middle awning colour' },
    { x: 518, y: 136, r: 22, label: 'Cat on the roof' },
    { x: 95, y: 140, r: 20, label: 'Tea-house sign' },
    { x: 118, y: 355, r: 28, label: 'Crate stack' },
    { x: 516, y: 72, r: 18, label: 'Balloon colour' },
  ],
  draw(ctx, v) {
    nightSky(ctx, '#241640', '#c65a3c');
    for (const [sx, sy, sr] of [[200, 40, 2], [340, 28, 1.6], [430, 55, 2], [150, 90, 1.5], [520, 30, 1.8], [60, 130, 1.4]]) {
      star(ctx, sx, sy, sr, '#ffe9a8');
    }
    // moon: craters on the left, plain on the right
    disc(ctx, 80, 62, 26, '#ffe9a8');
    if (v === 0) {
      disc(ctx, 72, 56, 5, '#e8c979');
      disc(ctx, 88, 68, 4, '#e8c979');
      disc(ctx, 84, 52, 3, '#e8c979');
    }
    // distant rooftops
    ctx.fillStyle = '#2c1c40';
    ctx.fillRect(0, 250, 560, 60);
    for (const [rx, rw] of [[30, 90], [180, 110], [360, 120]]) {
      ctx.beginPath();
      ctx.moveTo(rx, 250); ctx.lineTo(rx + rw / 2, 218); ctx.lineTo(rx + rw, 250);
      ctx.closePath(); ctx.fill();
    }
    // street
    ctx.fillStyle = '#3a2a20';
    ctx.fillRect(0, 310, 560, 110);
    ctx.fillStyle = 'rgba(255, 217, 138, 0.25)';
    for (let i = 0; i < 14; i += 1) disc(ctx, 30 + i * 40, 340 + (i % 3) * 22, 3, 'rgba(255, 217, 138, 0.25)');
    // string of lanterns across the top; the middle one is missing on the right
    ctx.strokeStyle = '#1c1426';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 34); ctx.quadraticCurveTo(280, 62, 560, 34); ctx.stroke();
    const lanternXs = [60, 170, 280, 390, 500];
    lanternXs.forEach((lx, i) => {
      if (v === 1 && i === 2) return;
      drawLantern(ctx, lx, 76, 13, ['#ff5d5d', '#ffb347', '#ff5d5d', '#37d67a', '#ff5d5d'][i], true);
    });
    // three stalls
    drawStall(ctx, 20, ['#e63946', '#f4ead8', '#e63946', '#f4ead8'], v === 0 ? '茶' : '酒', '#a4133c', marketGoodsTea);
    drawStall(ctx, 205, v === 0 ? ['#2a9d8f', '#f4ead8', '#2a9d8f', '#f4ead8'] : ['#e76f51', '#f4ead8', '#e76f51', '#f4ead8'], '果', '#146b5d', marketGoodsFruit);
    drawStall(ctx, 390, ['#e9c46a', '#f4ead8', '#e9c46a', '#f4ead8'], '花', '#8a6d00', marketGoodsFlowers);
    // cat on the right stall's roof, clear of its sign — gone on the right
    if (v === 0) drawCat(ctx, 518, 136, 0.9, '#2b2b3a');
    // crates, bottom left: three on the left, two on the right
    ctx.fillStyle = '#a4713b';
    ctx.fillRect(88, 352, 34, 34); ctx.fillRect(124, 352, 34, 34);
    if (v === 0) ctx.fillRect(106, 318, 34, 34);
    ctx.strokeStyle = '#6e4525'; ctx.lineWidth = 2;
    ctx.strokeRect(88, 352, 34, 34); ctx.strokeRect(124, 352, 34, 34);
    if (v === 0) ctx.strokeRect(106, 318, 34, 34);
    // balloons, top right: the top one swaps red for blue
    ctx.strokeStyle = '#1c1426';
    ctx.beginPath(); ctx.moveTo(516, 92); ctx.quadraticCurveTo(500, 130, 512, 168); ctx.stroke();
    disc(ctx, 500, 58, 13, '#37d67a');
    disc(ctx, 532, 62, 13, '#ffd23e');
    disc(ctx, 516, 72, 14, v === 0 ? '#ff5d5d' : '#4a90e2');
    // paper lantern resting on the street
    drawLantern(ctx, 350, 372, 15, '#ff5d5d', true);
    text(ctx, 'LANTERN MARKET', 280, 405, 12, 'rgba(255, 217, 138, 0.85)');
  },
};

function drawPlant(ctx, x, y, leaves) {
  ctx.fillStyle = '#c96f4a';
  rr(ctx, x - 12, y, 24, 16, 3); ctx.fill();
  ctx.strokeStyle = '#4e9b47';
  ctx.lineWidth = 3;
  for (let i = 0; i < leaves; i += 1) {
    const dx = (i - (leaves - 1) / 2) * 10;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx, y - 18, x + dx * 1.4, y - 26); ctx.stroke();
    disc(ctx, x + dx * 1.4, y - 26, 5, '#5fb85a');
  }
}

function drawBookRow(ctx, x, y, colors) {
  let cx = x;
  for (const c of colors) {
    ctx.fillStyle = c;
    ctx.fillRect(cx, y, 12, 34);
    cx += 14;
  }
}

export const SCENE_CAFE = {
  id: 'cafe',
  name: 'Cat Café',
  subtitle: 'Rain on the window, cats on the sofa',
  parSeconds: 150,
  differences: [
    { x: 470, y: 72, r: 28, label: 'Clock hands' },
    { x: 420, y: 55, r: 18, label: 'Plant leaves' },
    { x: 330, y: 312, r: 24, label: "Sofa cat's coat" },
    { x: 485, y: 206, r: 12, label: 'Cherry on the cake' },
    { x: 200, y: 272, r: 14, label: 'Book spine colour' },
    { x: 120, y: 120, r: 30, label: 'Raindrops' },
    { x: 290, y: 395, r: 26, label: 'Rug stripe' },
    { x: 470, y: 150, r: 26, label: 'Wall picture' },
  ],
  draw(ctx, v) {
    ctx.fillStyle = '#f2dfc0';
    ctx.fillRect(0, 0, 560, 420);
    ctx.fillStyle = '#c99a5b';
    ctx.fillRect(0, 330, 560, 90);
    ctx.strokeStyle = 'rgba(120, 70, 20, 0.35)';
    ctx.lineWidth = 1;
    for (let y = 350; y < 420; y += 18) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(560, y); ctx.stroke(); }
    // window with night rain
    rr(ctx, 40, 40, 180, 180, 10);
    ctx.fillStyle = '#1d2b4a';
    ctx.fill();
    ctx.save();
    rr(ctx, 40, 40, 180, 180, 10);
    ctx.clip();
    disc(ctx, 190, 70, 16, '#ffe9a8');
    star(ctx, 80, 70, 2, '#fff');
    star(ctx, 140, 55, 1.6, '#fff');
    star(ctx, 100, 100, 1.5, '#fff');
    ctx.fillStyle = 'rgba(180, 220, 255, 0.85)';
    const drops = v === 0 ? [[70, 110], [110, 90], [150, 130], [90, 160], [170, 90]] : [[70, 110], [150, 130], [170, 90]];
    for (const [dx, dy] of drops) { ctx.beginPath(); ctx.ellipse(dx, dy, 3, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = '#8a5a30';
    ctx.lineWidth = 6;
    rr(ctx, 40, 40, 180, 180, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(130, 40); ctx.lineTo(130, 220); ctx.moveTo(40, 130); ctx.lineTo(220, 130); ctx.stroke();
    // shelf with plants
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(300, 78, 240, 10);
    drawPlant(ctx, 330, 62, 3);
    drawPlant(ctx, 420, 62, v === 0 ? 3 : 2);
    drawPlant(ctx, 510, 62, 3);
    // wall clock: 3:00 on the left, 4:30 on the right
    disc(ctx, 470, 72, 28, '#fff');
    ctx.strokeStyle = '#2b2b3a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(470, 72, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(470, 72);
    if (v === 0) { ctx.lineTo(470, 54); ctx.moveTo(470, 72); ctx.lineTo(488, 72); }
    else { ctx.lineTo(484, 84); ctx.moveTo(470, 72); ctx.lineTo(470, 90); }
    ctx.stroke();
    disc(ctx, 470, 72, 3, '#e63946');
    // framed picture: a cat on the left, a fish on the right
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(438, 122, 64, 56);
    ctx.fillStyle = '#bfe3f0';
    ctx.fillRect(444, 128, 52, 44);
    if (v === 0) drawCat(ctx, 466, 158, 0.7, '#e67e22');
    else {
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath(); ctx.ellipse(470, 150, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(484, 150); ctx.lineTo(494, 142); ctx.lineTo(494, 158); ctx.closePath(); ctx.fill();
      disc(ctx, 460, 148, 2, '#1c1426');
    }
    // bookshelf under the window; one spine swaps red for green
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(40, 240, 180, 90);
    ctx.fillStyle = '#f2dfc0';
    ctx.fillRect(48, 248, 164, 34);
    ctx.fillRect(48, 290, 164, 32);
    drawBookRow(ctx, 56, 250, ['#e63946', '#2a9d8f', '#e9c46a', '#7c6bb0', '#e76f51', '#4a90e2', '#37d67a', '#c77dff', '#ff8c42', '#2a9d8f']);
    drawBookRow(ctx, 56, 292, ['#2a9d8f', '#e9c46a', v === 0 ? '#e63946' : '#37d67a', '#7c6bb0', '#ff8c42', '#4a90e2', '#e63946', '#c77dff']);
    // rug: one stripe is missing on the right
    const rugCols = ['#e63946', '#f4ead8', '#2a9d8f', '#f4ead8', '#e9c46a', '#f4ead8', '#e63946'];
    for (let i = 0; i < rugCols.length; i += 1) {
      if (v === 1 && i === 3) continue;
      ctx.fillStyle = rugCols[i];
      ctx.fillRect(190 + i * 26, 382, 26, 30);
    }
    ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 2;
    ctx.strokeRect(190, 382, 182, 30);
    // sofa with two cats
    ctx.fillStyle = '#b56576';
    rr(ctx, 180, 290, 220, 70, 12); ctx.fill();
    ctx.fillStyle = '#9c4f63';
    rr(ctx, 180, 290, 220, 26, 12); ctx.fill();
    ctx.fillStyle = '#d98a9b';
    ctx.fillRect(196, 316, 188, 10);
    drawCat(ctx, 250, 312, 1, '#e67e22');
    drawCat(ctx, 330, 312, 1, v === 0 ? '#8d99ae' : '#f4ead8');
    // counter with a cake stand
    ctx.fillStyle = '#6e4525';
    ctx.fillRect(430, 250, 110, 130);
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(430, 250, 110, 12);
    ctx.strokeStyle = '#c9b8e8';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(485, 250); ctx.lineTo(485, 232); ctx.stroke();
    ctx.fillStyle = '#e8f2f0';
    ctx.beginPath(); ctx.ellipse(485, 232, 34, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4a7b9';
    ctx.beginPath(); ctx.arc(485, 222, 14, Math.PI, 0); ctx.fill();
    ctx.fillRect(471, 222, 28, 6);
    if (v === 0) disc(ctx, 485, 206, 5, '#e63946');
    ctx.fillStyle = '#7fb069';
    ctx.fillRect(483, 198, 3, 5);
    // pendant lamp
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(280, 0); ctx.lineTo(280, 44); ctx.stroke();
    const lampGlow = ctx.createRadialGradient(280, 60, 2, 280, 60, 46);
    lampGlow.addColorStop(0, 'rgba(255, 210, 62, 0.5)');
    lampGlow.addColorStop(1, 'rgba(255, 210, 62, 0)');
    ctx.fillStyle = lampGlow;
    ctx.fillRect(234, 14, 92, 92);
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.moveTo(258, 44); ctx.lineTo(302, 44); ctx.lineTo(292, 66); ctx.lineTo(268, 66); ctx.closePath(); ctx.fill();
    disc(ctx, 280, 68, 7, '#ffd23e');
    text(ctx, 'CAT CAFÉ', 280, 405, 12, 'rgba(120, 70, 20, 0.8)');
  },
};

function drawGull(ctx, x, y) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x - 4, y - 8, x, y);
  ctx.quadraticCurveTo(x + 4, y - 8, x + 10, y);
  ctx.stroke();
}

export const SCENE_HARBOR = {
  id: 'harbor',
  name: 'Harbor Dawn',
  subtitle: 'First light over the fishing boats',
  parSeconds: 180,
  differences: [
    { x: 90, y: 100, r: 20, label: 'Lighthouse lamp' },
    { x: 335, y: 205, r: 26, label: 'Sail stripe' },
    { x: 460, y: 100, r: 14, label: 'Seagull' },
    { x: 200, y: 320, r: 16, label: 'Buoy colour' },
    { x: 480, y: 70, r: 34, label: 'Sun rays' },
    { x: 260, y: 300, r: 18, label: 'Jumping fish' },
    { x: 352, y: 148, r: 14, label: 'Boat flag' },
    { x: 90, y: 180, r: 12, label: 'Lighthouse window' },
    { x: 170, y: 375, r: 24, label: 'Pier crates' },
  ],
  draw(ctx, v) {
    nightSky(ctx, '#ff9d76', '#ffe9b8');
    // sun: rays on the left, bare disc on the right
    if (v === 0) {
      ctx.strokeStyle = '#ff8c42';
      ctx.lineWidth = 4;
      for (let i = 0; i < 8; i += 1) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(480 + Math.cos(a) * 36, 70 + Math.sin(a) * 36);
        ctx.lineTo(480 + Math.cos(a) * 48, 70 + Math.sin(a) * 48);
        ctx.stroke();
      }
    }
    disc(ctx, 480, 70, 30, '#ffd23e');
    // clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (const [cx, cy] of [[120, 60], [300, 44]]) {
      disc(ctx, cx, cy, 18, 'rgba(255, 255, 255, 0.9)');
      disc(ctx, cx + 22, cy + 4, 14, 'rgba(255, 255, 255, 0.9)');
      disc(ctx, cx - 22, cy + 5, 13, 'rgba(255, 255, 255, 0.9)');
    }
    // sea
    const sea = ctx.createLinearGradient(0, 250, 0, 420);
    sea.addColorStop(0, '#4a90c2');
    sea.addColorStop(1, '#1d4e6e');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 250, 560, 170);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    for (const [wx, wy, wl] of [[40, 280, 60], [180, 300, 70], [360, 285, 60], [90, 350, 80], [300, 360, 70], [460, 340, 60], [220, 395, 90]]) {
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy); ctx.stroke();
    }
    // gulls: three on the left, two on the right
    drawGull(ctx, 430, 80);
    if (v === 0) drawGull(ctx, 460, 100);
    drawGull(ctx, 410, 110);
    // lighthouse
    ctx.fillStyle = '#f4ead8';
    ctx.beginPath();
    ctx.moveTo(66, 280); ctx.lineTo(74, 110); ctx.lineTo(106, 110); ctx.lineTo(114, 280);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e63946';
    ctx.fillRect(70, 200, 40, 26);
    ctx.fillRect(73, 140, 34, 22);
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(64, 104, 52, 8);
    ctx.fillRect(72, 88, 36, 16);
    // lamp: glowing on the left, dark on the right
    if (v === 0) {
      const glow = ctx.createRadialGradient(90, 96, 2, 90, 96, 44);
      glow.addColorStop(0, 'rgba(255, 240, 150, 0.9)');
      glow.addColorStop(1, 'rgba(255, 240, 150, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(46, 52, 88, 88);
    }
    ctx.fillStyle = v === 0 ? '#fff3a0' : '#5a5a6e';
    ctx.fillRect(76, 90, 28, 14);
    // lighthouse window: lit on the left, dark on the right
    ctx.fillStyle = v === 0 ? '#ffd23e' : '#2b2b3a';
    ctx.fillRect(84, 172, 12, 16);
    // pier with crates: two on the left, three on the right
    ctx.fillStyle = '#6e4525';
    ctx.fillRect(0, 360, 220, 60);
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(0, 360, 220, 10);
    ctx.fillStyle = '#a4713b';
    ctx.fillRect(120, 336, 26, 26);
    ctx.fillRect(150, 336, 26, 26);
    if (v === 1) ctx.fillRect(135, 310, 26, 26);
    ctx.strokeStyle = '#5a3a22'; ctx.lineWidth = 2;
    ctx.strokeRect(120, 336, 26, 26); ctx.strokeRect(150, 336, 26, 26);
    if (v === 1) ctx.strokeRect(135, 310, 26, 26);
    // buoy: orange on the left, white on the right
    ctx.fillStyle = v === 0 ? '#ff6b35' : '#f4ead8';
    ctx.beginPath(); ctx.moveTo(200, 304); ctx.lineTo(214, 322); ctx.lineTo(186, 322); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2b2b3a';
    ctx.fillRect(198, 298, 4, 8);
    // jumping fish: there on the left, gone on the right
    if (v === 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath(); ctx.arc(260, 306, 14, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = '#7fb069';
      ctx.beginPath(); ctx.ellipse(260, 292, 12, 6, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(270, 290); ctx.lineTo(278, 286); ctx.lineTo(276, 294); ctx.closePath(); ctx.fill();
    }
    // sailboat
    ctx.fillStyle = '#7a4a21';
    ctx.beginPath();
    ctx.moveTo(296, 300); ctx.lineTo(384, 300); ctx.lineTo(368, 322); ctx.lineTo(312, 322);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a22';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(340, 300); ctx.lineTo(340, 160); ctx.stroke();
    // sail: red stripe on the left, yellow on the right
    ctx.fillStyle = '#f4ead8';
    ctx.beginPath(); ctx.moveTo(344, 168); ctx.lineTo(344, 292); ctx.lineTo(392, 292); ctx.closePath(); ctx.fill();
    ctx.fillStyle = v === 0 ? '#e63946' : '#ffd23e';
    ctx.beginPath(); ctx.moveTo(344, 200); ctx.lineTo(344, 224); ctx.lineTo(374, 224); ctx.lineTo(366, 200); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4ead8';
    ctx.beginPath(); ctx.moveTo(336, 180); ctx.lineTo(336, 292); ctx.lineTo(306, 292); ctx.closePath(); ctx.fill();
    // flag on the mast: there on the left, gone on the right
    if (v === 0) {
      ctx.fillStyle = '#e63946';
      ctx.beginPath(); ctx.moveTo(340, 160); ctx.lineTo(364, 166); ctx.lineTo(340, 172); ctx.closePath(); ctx.fill();
    }
    text(ctx, 'HARBOR DAWN', 400, 405, 12, 'rgba(255, 255, 255, 0.85)');
  },
};

export const SCENES = [SCENE_MARKET, SCENE_CAFE, SCENE_HARBOR];
