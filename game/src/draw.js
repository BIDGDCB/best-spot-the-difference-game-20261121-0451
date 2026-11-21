// Tiny canvas helpers shared by every scene: rounded boxes, discs, stars and text.
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function disc(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function text(ctx, str, x, y, size, fill, align = 'center', weight = '700') {
  ctx.font = `${weight} ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
}

export function stripeAwning(ctx, x, y, w, h, colors) {
  const n = colors.length;
  const sw = w / n;
  for (let i = 0; i < n; i += 1) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(x + i * sw, y, sw, h);
  }
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  for (let i = 0; i < n; i += 1) {
    ctx.arc(x + i * sw + sw / 2, y + h, sw / 2, 0, Math.PI);
  }
  ctx.fillStyle = colors[0];
  ctx.fill();
}
