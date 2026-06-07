/* ─── Particle network background ────────────────────────────────── */
const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');

const ACCENT   = [96, 165, 250];
const COUNT    = 50;
const MAX_DIST = 150;

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
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.4 + 0.7;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT.join(',')}, 0.45)`;
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
        const alpha = (1 - d / MAX_DIST) * 0.18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${ACCENT.join(',')}, ${alpha})`;
        ctx.lineWidth   = 0.5;
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
  particles.forEach(p => { if (p.x > W) p.x = W; if (p.y > H) p.y = H; });
}, { passive: true });

initParticles();
animateParticles();

/* ─── Typing animation ───────────────────────────────────────────── */
const roles   = ['Data Engineer', 'Analytics Engineer', 'Data Architect', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.querySelector('.typed-text');

function type() {
  const current = roles[roleIndex];
  typedEl.textContent = deleting
    ? current.slice(0, --charIndex)
    : current.slice(0, ++charIndex);

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(type, 2000);
    return;
  }
  if (deleting && charIndex === 0) {
    deleting  = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

/* ─── Dynamic years of experience ───────────────────────────────── */
const CAREER_START = 2017;
const yearsExp = new Date().getFullYear() - CAREER_START;
document.querySelectorAll('.exp-years').forEach(el => { el.textContent = yearsExp; });

/* ─── Counter animation ──────────────────────────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  let count    = 0;
  const step   = Math.max(1, Math.ceil(target / 50));
  const timer  = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 28);
}

/* ─── Scroll progress bar ────────────────────────────────────────── */
const progressBar = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ─── Nav: scroll shadow + active section ────────────────────────── */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  const scrollY = window.scrollY;

  nav.classList.toggle('scrolled', scrollY > 40);
  updateScrollProgress();

  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

/* ─── Intersection observers ─────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

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

/* ─── Stat card auto-height ──────────────────────────────────────── */
function fitStatCards() {
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach(card => { card.querySelector('.stat-card-inner').style.height = ''; });

  let maxH = 0;

  cards.forEach(card => {
    const w = card.offsetWidth;

    function measureFace(face) {
      const clone = face.cloneNode(true);
      Object.assign(clone.style, {
        position: 'fixed', top: '-9999px', left: '-9999px',
        right: 'auto', bottom: 'auto',
        width: w + 'px', height: 'auto',
        transform: 'none', visibility: 'hidden'
      });
      document.body.appendChild(clone);
      const h = clone.offsetHeight;
      document.body.removeChild(clone);
      return h;
    }

    const h = Math.max(
      measureFace(card.querySelector('.stat-card-front')),
      measureFace(card.querySelector('.stat-card-back'))
    );
    maxH = Math.max(maxH, h);
  });

  cards.forEach(card => {
    card.querySelector('.stat-card-inner').style.height = maxH + 'px';
  });
}

window.addEventListener('resize', fitStatCards);
const _runFit = () => requestAnimationFrame(() => requestAnimationFrame(fitStatCards));
if (document.fonts) {
  document.fonts.ready.then(_runFit);
} else {
  _runFit();
}
window.addEventListener('load', _runFit);

/* ─── Stat card flip (click for mobile) ─────────────────────────── */
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('click', () => {
    const wasFlipped = card.classList.contains('flipped');
    document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('flipped'));
    if (!wasFlipped) card.classList.add('flipped');
  });
});

/* ─── Headshot lightbox ──────────────────────────────────────────── */
const headshotOverlay = document.getElementById('headshotOverlay');
const navLogo = document.querySelector('.nav-logo');

navLogo.addEventListener('click', e => {
  if (window.scrollY < 60) {
    e.preventDefault();
    headshotOverlay.classList.add('active');
  }
});

headshotOverlay.addEventListener('click', () => {
  headshotOverlay.classList.remove('active');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') headshotOverlay.classList.remove('active');
});

/* ─── Mobile menu ────────────────────────────────────────────────── */
const toggle    = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.nav-links');

toggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileNav.classList.remove('open'))
);
