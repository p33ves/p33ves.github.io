/* ─── Particle network background ────────────────────────────────── */
const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');

const ACCENT      = [96, 165, 250];
const COUNT       = 55;
const MAX_DIST    = 160;

let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }
  reset(rand) {
    this.x  = rand ? Math.random() * W : (Math.random() < 0.5 ? 0 : W);
    this.y  = rand ? Math.random() * H : Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.5 + 0.8;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT.join(',')}, 0.55)`;
    ctx.fill();
  }
}

function initParticles() {
  resize();
  particles = Array.from({ length: COUNT }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) {
        const alpha = (1 - d / MAX_DIST) * 0.22;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${ACCENT.join(',')}, ${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resize();
  particles.forEach(p => {
    if (p.x > W) p.x = W;
    if (p.y > H) p.y = H;
  });
}, { passive: true });

initParticles();
animateParticles();

/* ─── Typing animation ───────────────────────────────────────────── */
const roles    = ['Data Engineer', 'ML Engineer', 'Spark Developer', 'Problem Solver'];
let roleIndex  = 0, charIndex = 0, deleting = false;
const typedEl  = document.querySelector('.typed-text');

function type() {
  const current = roles[roleIndex];
  typedEl.textContent = deleting
    ? current.slice(0, --charIndex)
    : current.slice(0, ++charIndex);

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(type, 2200);
    return;
  }
  if (deleting && charIndex === 0) {
    deleting  = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, deleting ? 50 : 95);
}
type();

/* ─── Counter animation ──────────────────────────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  let count    = 0;
  const step   = Math.max(1, Math.ceil(target / 45));
  const timer  = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 32);
}

/* ─── Intersection observers ─────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ─── Mobile menu ────────────────────────────────────────────────── */
const toggle   = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ─── Nav scroll shadow ──────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40
    ? '0 4px 40px rgba(0,0,0,0.5)'
    : 'none';
}, { passive: true });
