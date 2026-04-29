/* ============================================================
   SHREYA'S BIRTHDAY — script.js
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */
let musicPlaying = true; // music starts automatically on first click
let typingDone   = false;

/* ── Full birthday message ─────────────────────────────────── */
const BIRTHDAY_MESSAGE = `Happy 20th Birthday, Shreya ❤️

I don't think I say this enough, but you mean so much to me.
Every moment with you, whether it's something small or something special, stays with me.

You've made my life lighter, happier, and honestly just better in ways I didn't expect.

I'm really grateful for you—for your smile, your presence, and just you being you.

I hope this year brings you everything you deserve and more.

And no matter what happens, just know… it's always you ❤️`;

/* ── Landing → Main transition ────────────────────────────── */
function beginJourney() {
  const landing  = document.getElementById('landing');
  const mainSite = document.getElementById('mainSite');

  // Auto-play music on first user interaction (satisfies browser autoplay policy)
  const audio = document.getElementById('bgMusic');
  if (audio) {
    audio.volume = 0.7;
    audio.play().then(() => {
      musicPlaying = true;
      const btn   = document.getElementById('musicToggle');
      const label = document.getElementById('musicLabel');
      if (btn)   btn.classList.add('playing');
      if (label) label.textContent = 'Pause';
    }).catch(() => { musicPlaying = false; });
  }

  // Fade out landing
  landing.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  landing.style.opacity    = '0';
  landing.style.transform  = 'scale(1.04)';

  setTimeout(() => {
    landing.style.display = 'none';
    mainSite.classList.remove('hidden');

    // Trigger reflow, then scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Start typing after a short delay
    setTimeout(() => startTyping(), 600);
  }, 820);
}

/* ── Typewriter Effect ─────────────────────────────────────── */
function startTyping() {
  const target = document.getElementById('typingTarget');
  if (!target || typingDone) return;

  target.classList.add('typing-cursor');
  let i = 0;
  const chars = BIRTHDAY_MESSAGE.split('');

  function type() {
    if (i < chars.length) {
      target.textContent += chars[i];
      i++;
      // Vary typing speed for a human feel
      const delay = chars[i - 1] === '\n' ? 220 : Math.random() * 35 + 22;
      setTimeout(type, delay);
    } else {
      // Typing done — keep cursor blinking briefly then remove it
      setTimeout(() => {
        target.classList.remove('typing-cursor');
        typingDone = true;
      }, 2500);
    }
    // Auto-scroll within the message box
    target.scrollTop = target.scrollHeight;
  }

  type();
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── Music Toggle ──────────────────────────────────────────── */
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');

  if (!audio) {
    // No audio element yet — guide user
    showMusicNote();
    return;
  }

  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
    btn.classList.remove('playing');
    label.textContent = 'Play';
  } else {
    audio.play().catch(() => {});
    musicPlaying = true;
    btn.classList.add('playing');
    label.textContent = 'Pause';
  }
}

function showMusicNote() {
  // Gentle note if no music file added yet
  const note = document.createElement('div');
  note.textContent = '🎵 Add a music file to enable playback (see HTML comments)';
  Object.assign(note.style, {
    position:   'fixed',
    bottom:     '2rem',
    left:       '50%',
    transform:  'translateX(-50%)',
    background: 'rgba(255,255,255,0.92)',
    border:     '1px solid rgba(242,191,191,0.6)',
    borderRadius: '50px',
    padding:    '0.7rem 1.6rem',
    fontFamily: "'Lato', sans-serif",
    fontSize:   '0.85rem',
    color:      '#6B4F5C',
    boxShadow:  '0 4px 20px rgba(200,140,160,0.2)',
    zIndex:     '9999',
    opacity:    '0',
    transition: 'opacity 0.4s ease',
  });
  document.body.appendChild(note);
  setTimeout(() => (note.style.opacity = '1'), 10);
  setTimeout(() => {
    note.style.opacity = '0';
    setTimeout(() => note.remove(), 400);
  }, 3500);
}

/* ── Floating Hearts Canvas ───────────────────────────────── */
(function initHearts() {
  const canvas = document.getElementById('heartsCanvas');
  const ctx    = canvas.getContext('2d');
  let   hearts = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const HEART_COLORS = [
    'rgba(242,191,191,',
    'rgba(201,184,232,',
    'rgba(232,117,138,',
    'rgba(255,192,203,',
    'rgba(220,180,220,',
  ];

  function createHeart() {
    return {
      x:       Math.random() * canvas.width,
      y:       canvas.height + 30,
      size:    Math.random() * 16 + 8,
      speed:   Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.45 + 0.1,
      drift:   (Math.random() - 0.5) * 0.6,
      color:   HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      wobble:  Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  // Seed initial hearts spread across the screen
  for (let i = 0; i < 28; i++) {
    const h = createHeart();
    h.y = Math.random() * canvas.height;
    hearts.push(h);
  }

  function drawHeart(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle   = `${color}${opacity})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size / 4, x - size / 2, y - size / 2, x - size / 2, y - size / 4);
    ctx.bezierCurveTo(x - size / 2, y - size, x,         y - size * 0.75, x, y - size * 0.6);
    ctx.bezierCurveTo(x,         y - size * 0.75, x + size / 2, y - size,      x + size / 2, y - size / 4);
    ctx.bezierCurveTo(x + size / 2, y - size / 2, x,         y - size / 4, x, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new hearts
    if (hearts.length < 40 && Math.random() < 0.04) {
      hearts.push(createHeart());
    }

    hearts = hearts.filter((h) => h.y > -50);

    hearts.forEach((h) => {
      h.wobble += h.wobbleSpeed;
      h.x      += Math.sin(h.wobble) * h.drift;
      h.y      -= h.speed;

      drawHeart(ctx, h.x, h.y, h.size, h.color, h.opacity);
    });

    requestAnimationFrame(animate);
  }

  animate();
})();

/* ── Init on DOM ready ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Reveal observer activates after landing → main transition
  // We initialise it now but the elements aren't visible yet; it will fire once they are.
  initReveal();

  // Smooth active nav link highlight on scroll
  const sections = document.querySelectorAll('.section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${entry.target.id}`
              ? 'var(--rose)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => navObserver.observe(s));
});
