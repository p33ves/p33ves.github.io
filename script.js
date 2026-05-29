/* ─── Typing animation ───────────────────────────────────────────── */
const roles = ['Data Engineer', 'ML Engineer', 'Cloud Developer', 'Problem Solver'];
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
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, deleting ? 55 : 100);
}
type();

/* ─── Counter animation ──────────────────────────────────────────── */
function animateCounter(el) {
  const target = +el.dataset.target;
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 45));
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count;
    if (count >= target) clearInterval(timer);
  }, 35);
}

/* ─── Intersection observers ─────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

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
  nav.style.boxShadow = window.scrollY > 40 ? '0 4px 30px rgba(0,0,0,0.35)' : 'none';
}, { passive: true });
