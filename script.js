/* ============================================================
   OMKAR PRIYADARSAN — PORTFOLIO SCRIPT
   - Network canvas background
   - Loader animation
   - Custom cursor
   - Typewriter effect
   - Scroll reveal + skill bars + stat counters
   - EmailJS contact form (fully functional)
   ============================================================ */

/* ═══════════════════════════════════════════════════════
   ██ CONFIGURATION — Update these before deploying ██
   ═══════════════════════════════════════════════════════ */
const CONFIG = {
  // ── Your EmailJS credentials ──────────────────────────────────
  // 1. Go to https://www.emailjs.com → sign up (free)
  // 2. Add a new EMAIL SERVICE (Gmail recommended) → copy Service ID
  // 3. Create an EMAIL TEMPLATE with variables:
  //      {{from_name}}, {{from_email}}, {{subject}}, {{message}}
  //    Set "To Email" = omkarpriyadarsan2@gmail.com
  //    Set "Reply To" = {{from_email}}
  // 4. Copy your Public Key from Account → API Keys
  emailjs: {
    publicKey:  'VTNl__Neb5NOMkl56',      // Replace with your EmailJS public key
    serviceId:  'service_90234mc',      // Replace with your EmailJS service ID
    templateId: 'template_5aie2wg',     // Replace with your EmailJS template ID
  },

  // ── Social links ─────────────────────────────────────────────
  github:   'https://github.com/omkarpriyadarsan',     // Replace with your GitHub URL
  linkedin: 'https://linkedin.com/in/omkar-priyadarsan-58b224309', // Replace with your LinkedIn URL

  // ── Typewriter roles ─────────────────────────────────────────
  roles: [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
    'Tech Explorer',
  ],
};

/* ═══════════════════════════════════════════════════════
   1. LOADER
   ═══════════════════════════════════════════════════════ */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const fill    = document.getElementById('loaderFill');
  const pct     = document.getElementById('loaderPct');
  let progress  = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      pct.textContent  = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroAnimations();
      }, 500);
    } else {
      fill.style.width = progress + '%';
      pct.textContent  = Math.floor(progress) + '%';
    }
  }, 80);
})();

function triggerHeroAnimations() {
  document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4')
    .forEach(el => el.classList.add('animated'));
  startTypewriter();
}

/* ═══════════════════════════════════════════════════════
   2. NETWORK CANVAS
   ═══════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('networkCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, nodes, mouse = { x: -9999, y: -9999 };

  const NODE_COUNT   = window.innerWidth < 768 ? 60 : 110;
  const MAX_DIST     = 150;
  const NODE_RADIUS  = 1.8;
  const NODE_COLOR   = 'rgba(0,200,255,';
  const MOUSE_RADIUS = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.02;

      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // Mouse repel
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS * 0.6;
        n.vx += (dx / d) * force;
        n.vy += (dy / d) * force;
        n.vx = Math.max(-2, Math.min(2, n.vx));
        n.vy = Math.max(-2, Math.min(2, n.vy));
      }

      const alpha = 0.4 + 0.2 * Math.sin(n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR + alpha + ')';
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = NODE_COLOR + alpha + ')';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    nodes.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RADIUS) {
        const alpha = (1 - d / MOUSE_RADIUS) * 0.6;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,255,157,${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  draw();
})();

/* ═══════════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════ */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');

  let ox = 0, oy = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';

    ox += (e.clientX - ox) * 0.12;
    oy += (e.clientY - oy) * 0.12;
    outline.style.left = ox + 'px';
    outline.style.top  = oy + 'px';
  });

  function animateCursor() {
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => outline.style.transform = 'translate(-50%,-50%) scale(1.4)');
    el.addEventListener('mouseleave', () => outline.style.transform = 'translate(-50%,-50%) scale(1)');
  });
})();

/* ═══════════════════════════════════════════════════════
   4. NAV SCROLL EFFECT
   ═══════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   5. TYPEWRITER
   ═══════════════════════════════════════════════════════ */
function startTypewriter() {
  const el    = document.getElementById('typeText');
  const roles = CONFIG.roles;
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = word.slice(0, ci);

    if (!deleting) {
      if (ci < word.length) { ci++; setTimeout(tick, 90); }
      else { deleting = true; setTimeout(tick, 1600); }
    } else {
      if (ci > 0) { ci--; setTimeout(tick, 45); }
      else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 400); }
    }
  }

  tick();
}

/* ═══════════════════════════════════════════════════════
   6. SCROLL REVEAL
   ═══════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const items = document.querySelectorAll('.scroll-reveal');
  let skillsAnimated = false;
  let statsAnimated  = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));

  // Skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-item').forEach(item => {
          const level = item.dataset.level;
          const fill  = item.querySelector('.skill-fill');
          setTimeout(() => { fill.style.width = level + '%'; }, 300);
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.querySelector('.skills-categories');
  if (skillsSection) skillObserver.observe(skillsSection);

  // Stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll('.stat-num').forEach(el => {
          const target = +el.dataset.target;
          animateCount(el, 0, target, 1800);
        });
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.querySelector('.about-stats');
  if (aboutSection) statObserver.observe(aboutSection);
})();

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════
   7. PROFILE PHOTO — auto-hide placeholder if image loads
   ═══════════════════════════════════════════════════════ */
(function initPhoto() {
  const photo       = document.getElementById('profilePhoto');
  const placeholder = document.getElementById('photoPlaceholder');

  photo.addEventListener('load', () => {
    photo.classList.add('loaded');
    placeholder.style.display = 'none';
  });

  photo.addEventListener('error', () => {
    photo.style.display = 'none';
    placeholder.style.display = 'flex';
  });
})();

/* ═══════════════════════════════════════════════════════
   8. SOCIAL LINKS — injected from CONFIG
   ═══════════════════════════════════════════════════════ */
(function injectLinks() {
  const githubIds   = ['githubLink', 'githubLink2', 'githubLink3', 'githubLink4'];
  const linkedinIds = ['linkedinLink', 'linkedinLink2', 'linkedinLink3'];

  githubIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.github;
  });

  linkedinIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.linkedin;
  });

  // Update display text for contact section
  const gl3 = document.getElementById('githubLink3');
  if (gl3) gl3.textContent = CONFIG.github.replace('https://', '');
  const ll2 = document.getElementById('linkedinLink2');
  if (ll2) ll2.textContent = CONFIG.linkedin.replace('https://', '');
})();

/* ═══════════════════════════════════════════════════════
   9. EMAILJS CONTACT FORM
   ── How it works:
      • EmailJS sends the email FROM user's email TO yours.
      • The user's email is set as the Reply-To field.
      • Subject line becomes the email subject.
      • Message/purpose is the email body.
   ═══════════════════════════════════════════════════════ */
(function initContactForm() {

  // Initialize EmailJS with your public key
  emailjs.init(CONFIG.emailjs.publicKey);

  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const statusEl   = document.getElementById('formStatus');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoader  = submitBtn.querySelector('.btn-loader');
  const btnIcon    = submitBtn.querySelector('.btn-icon');

  // Input references
  const fields = {
    name:    { el: document.getElementById('userName'),    errEl: document.getElementById('nameError') },
    email:   { el: document.getElementById('userEmail'),   errEl: document.getElementById('emailError') },
    subject: { el: document.getElementById('userSubject'), errEl: document.getElementById('subjectError') },
    message: { el: document.getElementById('userMessage'), errEl: document.getElementById('messageError') },
  };

  // ── Validation ──────────────────────────────────────────────
  function validate() {
    let valid = true;

    Object.values(fields).forEach(f => {
      f.el.classList.remove('error');
      f.errEl.textContent = '';
    });

    if (!fields.name.el.value.trim()) {
      fields.name.errEl.textContent = 'Name is required.';
      fields.name.el.classList.add('error');
      valid = false;
    }

    const emailVal = fields.email.el.value.trim();
    if (!emailVal) {
      fields.email.errEl.textContent = 'Email is required.';
      fields.email.el.classList.add('error');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      fields.email.errEl.textContent = 'Please enter a valid email.';
      fields.email.el.classList.add('error');
      valid = false;
    }

    if (!fields.subject.el.value.trim()) {
      fields.subject.errEl.textContent = 'Subject is required.';
      fields.subject.el.classList.add('error');
      valid = false;
    }

    if (!fields.message.el.value.trim()) {
      fields.message.errEl.textContent = 'Message is required.';
      fields.message.el.classList.add('error');
      valid = false;
    }

    return valid;
  }

  // ── Submit ──────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Disable button & show loader
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'inline';
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';

    const templateParams = {
      from_name:  fields.name.el.value.trim(),
      from_email: fields.email.el.value.trim(),
      subject:    fields.subject.el.value.trim(),
      message:    fields.message.el.value.trim(),
      to_email:   'omkarpriyadarsan2@gmail.com',
      reply_to:   fields.email.el.value.trim(),
    };

    try {
      await emailjs.send(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        templateParams
      );

      // Success
      statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
      statusEl.className = 'form-status success';
      form.reset();

    } catch (err) {
      console.error('EmailJS error:', err);
      statusEl.textContent = '✗ Oops! Something went wrong. Please try emailing me directly at omkarpriyadarsan2@gmail.com';
      statusEl.className = 'form-status error-msg';
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      btnIcon.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  });

  // ── Clear errors on input ────────────────────────────────────
  Object.values(fields).forEach(({ el, errEl }) => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      errEl.textContent = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   10. FOOTER YEAR
   ═══════════════════════════════════════════════════════ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════
   11. SMOOTH ACTIVE NAV LINK HIGHLIGHT
   ═══════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
