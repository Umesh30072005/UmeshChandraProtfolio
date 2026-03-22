// ===== Preloader =====
let siteReady = false;
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    siteReady = true;
  }, 2400);
});

// ===== Mouse Glow =====
const mouseGlow = document.getElementById('mouseGlow');
let glowX = 0, glowY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  if (!siteReady) return;
  glowX = e.clientX;
  glowY = e.clientY;
  mouseGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
  mouseGlow.classList.remove('active');
});

(function glowLoop() {
  curX += (glowX - curX) * 0.12;
  curY += (glowY - curY) * 0.12;
  mouseGlow.style.transform = `translate(${curX - 300}px, ${curY - 300}px)`;
  requestAnimationFrame(glowLoop);
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Full Hero Typewriter =====
const typewriterConfig = [
  { elementId: 'heroGreeting', text: "Hello, I'm", speed: 60, pause: 300 },
  { elementId: 'heroName', text: "UmeshChandraPrasad .K", speed: 50, pause: 200 },
  { elementId: 'heroRoles', text: "Android App Developer | ML Engineer", speed: 45, pause: 200 },
  { elementId: 'heroSubtitle', text: "Building seamless mobile experiences & intelligent ML solutions with Kotlin, Java & Python", speed: 25, pause: 0 }
];

const cursor = document.getElementById('cursor');

function typeText(elementId, text, speed) {
  return new Promise(resolve => {
    const el = document.getElementById(elementId);
    if (!el) { resolve(); return; }

    // Move cursor next to this element
    el.appendChild(cursor);
    let i = 0;

    function type() {
      if (i < text.length) {
        const char = text[i];
        if (char === '\n') {
          el.insertBefore(document.createElement('br'), cursor);
        } else {
          el.insertBefore(document.createTextNode(char), cursor);
        }
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTypewriter() {
  // Wait for preloader to finish
  while (!siteReady) await wait(100);
  await wait(300);

  for (const step of typewriterConfig) {
    await typeText(step.elementId, step.text, step.speed);
    await wait(step.pause);
  }

  // Hide cursor after typing is done
  cursor.style.animation = 'none';
  await wait(400);
  cursor.style.display = 'none';

  // Reveal elements in sequence
  const heroStats = document.getElementById('heroStats');
  if (heroStats) {
    heroStats.classList.add('hero-visible');
    animateCounters();
  }
  await wait(300);
  document.getElementById('heroCta').classList.add('hero-visible');
  await wait(200);
  document.getElementById('heroSocials').classList.add('hero-visible');
  await wait(200);
  const phoneMockup = document.getElementById('phoneMockup');
  if (phoneMockup) phoneMockup.classList.add('hero-visible');
  await wait(300);
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) scrollIndicator.classList.add('hero-visible');
}

// Stats counter animation
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Scroll-triggered animations
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

animateElements.forEach(el => observer.observe(el));

// Start the hero typewriter
runTypewriter();

// ===== Project Filter Tabs =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('filter-hidden');
      } else {
        card.classList.add('filter-hidden');
      }
    });
  });
});

// Smooth active link highlighting
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});
