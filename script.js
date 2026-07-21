const screens = [...document.querySelectorAll('.screen')];
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const noHint = document.querySelector('#no-hint');
const finalButton = document.querySelector('#final-button');
const replayButton = document.querySelector('#replay-button');
let escapeCount = 0;

function showScreen(id) {
  const next = document.querySelector(id);
  const current = document.querySelector('.screen--active');
  if (current === next) return;
  current.classList.remove('screen--active');
  setTimeout(() => {
    current.hidden = true;
    next.hidden = false;
    requestAnimationFrame(() => next.classList.add('screen--active'));
  }, 300);
}

function escapeNoButton() {
  escapeCount += 1;
  const messages = ['Hmm… pas si vite.', 'Trop tard, il est parti en cavale.', 'Tu sais que tu veux cliquer sur Oui.', 'Mission impossible : attraper ce bouton.', 'Allez Enzo, le message t’attend.'];
  noHint.textContent = messages[Math.min(escapeCount - 1, messages.length - 1)];
  noButton.style.position = 'fixed';
  noButton.style.zIndex = '10';
  noButton.style.margin = '0';
  noButton.style.transform = 'none';
  noButton.style.transition = 'left .18s ease, top .18s ease';
  const { width, height } = noButton.getBoundingClientRect();
  const maxX = Math.max(0, window.innerWidth - width);
  const maxY = Math.max(0, window.innerHeight - height);
  noButton.style.left = `${Math.floor(Math.random() * maxX)}px`;
  noButton.style.top = `${Math.floor(Math.random() * maxY)}px`;
}

noButton.addEventListener('mouseover', escapeNoButton);
noButton.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); escapeNoButton(); } });
yesButton.addEventListener('click', () => { noButton.style.display = 'none'; showScreen('#message'); celebrate(85); });
finalButton.addEventListener('click', () => { showScreen('#final'); celebrate(110); });
replayButton.addEventListener('click', () => showScreen('#message'));

const canvas = document.querySelector('#confetti');
const ctx = canvas.getContext('2d');
let pieces = [];
function resizeCanvas() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
addEventListener('resize', resizeCanvas); resizeCanvas();
function celebrate(amount) {
  const colors = ['#d7a748', '#b8322e', '#f5dfb4', '#70452f', '#ffffff'];
  pieces.push(...Array.from({ length: amount }, () => ({ x: Math.random() * innerWidth, y: -15 - Math.random() * 80, vx: (Math.random()-.5)*2.1, vy: 1.5 + Math.random()*3.2, s: 4 + Math.random()*5, r: Math.random()*Math.PI, vr: (Math.random()-.5)*.16, c: colors[Math.floor(Math.random()*colors.length)] })));
}
function renderConfetti() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces = pieces.filter(p => p.y < innerHeight + 20);
  pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .025; p.r += p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66); ctx.restore(); });
  requestAnimationFrame(renderConfetti);
}
celebrate(28); renderConfetti();
