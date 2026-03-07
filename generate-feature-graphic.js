// Generate Play Store feature graphic (1024x500)
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1024, H = 500;
const BG = '#0a0a1a';
const CYAN = '#00eeff';

function drawShip(ctx, cx, cy, sz) {
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = sz * 0.8;
    // Thrust flame
    ctx.beginPath();
    ctx.moveTo(cx - sz * 0.35, cy + sz * 0.3);
    ctx.lineTo(cx, cy + sz * 1.3);
    ctx.lineTo(cx + sz * 0.35, cy + sz * 0.3);
    ctx.closePath();
    const tg = ctx.createLinearGradient(cx, cy + sz * 0.3, cx, cy + sz * 1.3);
    tg.addColorStop(0, '#ffcc00');
    tg.addColorStop(0.5, '#ff6600');
    tg.addColorStop(1, 'rgba(255,102,0,0)');
    ctx.fillStyle = tg;
    ctx.fill();
    // Ship
    ctx.beginPath();
    ctx.moveTo(cx, cy - sz);
    ctx.lineTo(cx - sz * 0.7, cy + sz * 0.7);
    ctx.lineTo(cx, cy + sz * 0.3);
    ctx.lineTo(cx + sz * 0.7, cy + sz * 0.7);
    ctx.closePath();
    ctx.fillStyle = CYAN;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, sz * 0.04);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Dark background
ctx.fillStyle = BG;
ctx.fillRect(0, 0, W, H);

// Subtle cave-like terrain (bottom)
ctx.beginPath();
ctx.moveTo(0, H);
for (let x = 0; x <= W; x += 20) {
    const y = H - 40 - Math.sin(x * 0.015) * 25 - Math.sin(x * 0.037) * 15 - Math.sin(x * 0.007) * 30;
    ctx.lineTo(x, y);
}
ctx.lineTo(W, H);
ctx.closePath();
ctx.fillStyle = '#1a1a2e';
ctx.fill();
ctx.strokeStyle = '#333355';
ctx.lineWidth = 2;
ctx.stroke();

// Ceiling terrain (top)
ctx.beginPath();
ctx.moveTo(0, 0);
for (let x = 0; x <= W; x += 20) {
    const y = 30 + Math.sin(x * 0.012 + 1) * 20 + Math.sin(x * 0.03 + 2) * 12 + Math.sin(x * 0.008) * 25;
    ctx.lineTo(x, y);
}
ctx.lineTo(W, 0);
ctx.closePath();
ctx.fillStyle = '#1a1a2e';
ctx.fill();
ctx.strokeStyle = '#333355';
ctx.lineWidth = 2;
ctx.stroke();

// Central radial glow
const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 300);
grad.addColorStop(0, 'rgba(0, 238, 255, 0.06)');
grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// Scattered particles/stars
for (let i = 0; i < 60; i++) {
    const px = Math.random() * W;
    const py = 80 + Math.random() * (H - 160);
    const pr = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.3})`;
    ctx.fill();
}

// Small enemy ships (background)
const enemies = [
    { x: 180, y: 200, sz: 18, angle: 0.4 },
    { x: 800, y: 280, sz: 16, angle: -0.3 },
    { x: 650, y: 150, sz: 12, angle: 0.6 },
];
for (const e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(0, -e.sz);
    ctx.lineTo(-e.sz * 0.7, e.sz * 0.7);
    ctx.lineTo(0, e.sz * 0.3);
    ctx.lineTo(e.sz * 0.7, e.sz * 0.7);
    ctx.closePath();
    ctx.fillStyle = '#ff4444';
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
}

// Some bullet trails
ctx.globalAlpha = 0.6;
for (const b of [{x:350,y:220,a:-0.3},{x:420,y:260,a:0.1},{x:580,y:190,a:-0.5}]) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.a);
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = 6;
    ctx.fillRect(-8, -1.5, 16, 3);
    ctx.shadowBlur = 0;
    ctx.restore();
}
ctx.globalAlpha = 1;

// Main ship (hero, center-left)
drawShip(ctx, W * 0.45, H * 0.48, 50);

// Title text
ctx.shadowColor = CYAN;
ctx.shadowBlur = 20;
ctx.font = 'bold 72px "Courier New", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#ffffff';
ctx.fillText('THRUSTFALL', W / 2, H * 0.48);
ctx.shadowBlur = 0;

// Subtitle
ctx.font = '22px "Courier New", monospace';
ctx.fillStyle = '#88aacc';
ctx.fillText('CAVE COMBAT  •  ONLINE PVP  •  SURVIVAL', W / 2, H * 0.62);

// Output
const outPath = path.join(__dirname, 'icons', 'feature-graphic.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log(`Feature graphic: ${outPath} (${W}x${H})`);
