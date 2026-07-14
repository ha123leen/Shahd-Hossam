/* =========================================================
   ALI & MAHA — WEDDING INVITATION
   Vanilla JS — bilingual + theme toggle + guest book
   ========================================================= */
(() => {
  'use strict';

  const WEDDING_DATE = new Date('2026-07-24T20:00:00');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     LANGUAGE TOGGLE (AR default, EN available)
  --------------------------------------------------------- */
  const langToggle = document.getElementById('lang-toggle');
  const langCurrentLabel = langToggle.querySelector('.lang-current');
  let currentLang = 'en';

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dataset.lang = lang;
    langCurrentLabel.textContent = lang === 'ar' ? 'EN' : 'ع';

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
      el.setAttribute('placeholder', lang === 'ar' ? el.dataset.arPlaceholder : el.dataset.enPlaceholder);
    });
  }

  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'ar' ? 'en' : 'ar');
  });

  applyLang('en');

  /* ---------------------------------------------------------
     THEME TOGGLE (day / night)
  --------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  // Respect system preference on first load, default to light (soft/day) otherwise
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark');
  });

  /* ---------------------------------------------------------
     PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 1400);
  });
  setTimeout(() => preloader && preloader.classList.add('hidden'), 4000);

  /* ---------------------------------------------------------
     HERO REVEAL SEQUENCE
  --------------------------------------------------------- */
  requestAnimationFrame(() => document.body.classList.add('hero-playing'));

  /* ---------------------------------------------------------
     OPEN INVITATION
  --------------------------------------------------------- */
  const openBtn = document.getElementById('open-invitation');
  const siteNav = document.getElementById('site-nav');

  openBtn.addEventListener('click', () => {
    document.body.classList.add('invitation-open');
    siteNav.classList.add('visible');
    attemptPlayMusic();
    setTimeout(() => {
      document.getElementById('main-content').scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }, 250);
  });

  /* ---------------------------------------------------------
     BACKGROUND MUSIC (gentle, autoplay attempt + fallback)
  --------------------------------------------------------- */
  const music = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let musicIsPlaying = false;

  function setMusicUI(playing) {
    musicIsPlaying = playing;
    musicToggle.classList.toggle('playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
  }

  function attemptPlayMusic() {
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setMusicUI(true)).catch(() => setMusicUI(false));
    }
  }

  musicToggle.addEventListener('click', () => {
    if (musicIsPlaying) {
      music.pause();
      setMusicUI(false);
    } else {
      music.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
    }
  });

  window.addEventListener('load', () => {
    music.volume = 0.4; // gentle, soft background level
    attemptPlayMusic();
  });

  /* ---------------------------------------------------------
     NAV visibility on scroll
  --------------------------------------------------------- */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('invitation-open')) return;
    const current = window.scrollY;
    if (current < 80 || current < lastScroll) {
      siteNav.classList.add('visible');
    } else {
      siteNav.classList.remove('visible');
    }
    lastScroll = current;
  }, { passive: true });

  /* ---------------------------------------------------------
     COUNTDOWN TIMER
  --------------------------------------------------------- */
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const pad = n => String(n).padStart(2, '0');

  function tickCountdown() {
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  function observeReveals() {
    document.querySelectorAll('.reveal-on-scroll, .gallery-item').forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     GALLERY — real venue photo + generated placeholder frames
  --------------------------------------------------------- */
  const galleryData = [
    { ar: 'قاعة فيكتوريا', en: 'Victoria Hall', image: 'assets/images/victoria-hall.png' },
    { ar: 'لحظة الخطوبة', en: 'The Engagement', glyph: 'ring' },
    { ar: 'ساعة ذهبية', en: 'Golden Hour', glyph: 'sun' },
    { ar: 'معًا للأبد', en: 'Together Forever', glyph: 'heart' },
    { ar: 'باقة الورد', en: 'The Bouquet', glyph: 'flower' },
    { ar: 'بداية جديدة', en: 'A New Beginning', glyph: 'crown' },
  ];

  const glyphPaths = {
    ring: '<circle cx="50" cy="55" r="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 35 L44 20 L56 20 Z" fill="currentColor"/>',
    sun: '<circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="2"><line x1="50" y1="18" x2="50" y2="28"/><line x1="50" y1="72" x2="50" y2="82"/><line x1="18" y1="50" x2="28" y2="50"/><line x1="72" y1="50" x2="82" y2="50"/><line x1="27" y1="27" x2="34" y2="34"/><line x1="66" y1="66" x2="73" y2="73"/><line x1="73" y1="27" x2="66" y2="34"/><line x1="34" y1="66" x2="27" y2="73"/></g>',
    heart: '<path d="M50 78 C20 55 15 35 30 25 C40 18 50 27 50 35 C50 27 60 18 70 25 C85 35 80 55 50 78 Z" fill="none" stroke="currentColor" stroke-width="2"/>',
    flower: '<g fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="50" cy="34" rx="9" ry="16"/><ellipse cx="50" cy="66" rx="9" ry="16"/><ellipse cx="34" cy="50" rx="16" ry="9"/><ellipse cx="66" cy="50" rx="16" ry="9"/><circle cx="50" cy="50" r="6"/></g>',
    crown: '<path d="M22 62 L28 34 L42 50 L50 28 L58 50 L72 34 L78 62 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="22" y1="62" x2="78" y2="62" stroke="currentColor" stroke-width="2"/>',
  };

  const galleryGrid = document.getElementById('gallery-grid');
  const gradients = ['linear-gradient(155deg,#171412,#0d0c0a 60%)', 'linear-gradient(155deg,#181410,#0a0908 60%)', 'linear-gradient(155deg,#141210,#0f0d0b 60%)'];

  function frameVisualHTML(item, index) {
    if (item.image) {
      return `<div class="frame-visual" style="background-image:url('${item.image}');"></div>`;
    }
    return `<div class="frame-visual" style="background:${gradients[index % gradients.length]}; color:var(--accent);">
      <svg width="34%" viewBox="0 0 100 100">${glyphPaths[item.glyph]}</svg>
    </div>`;
  }

  galleryData.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.dataset.index = String(i);
    el.innerHTML = `
      ${frameVisualHTML(item, i)}
      <span class="zoom-hint">&#10021;</span>
      <span class="gallery-caption" data-ar="${item.ar}" data-en="${item.en}">${currentLang === 'ar' ? item.ar : item.en}</span>
    `;
    galleryGrid.appendChild(el);
  });

  observeReveals();

  /* ---------------------------------------------------------
     LIGHTBOX
  --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxFrame = document.getElementById('lightbox-frame');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentIndex = 0;

  function renderLightbox(index) {
    const total = galleryData.length;
    currentIndex = (index + total) % total;
    const item = galleryData[currentIndex];
    lightboxFrame.innerHTML = frameVisualHTML(item, currentIndex);
  }

  function openLightbox(index) {
    renderLightbox(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryGrid.addEventListener('click', (e) => {
    const target = e.target.closest('.gallery-item');
    if (target) openLightbox(Number(target.dataset.index));
  });
  galleryGrid.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('gallery-item')) {
      e.preventDefault();
      openLightbox(Number(e.target.dataset.index));
    }
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => renderLightbox(currentIndex - 1));
  lightboxNext.addEventListener('click', () => renderLightbox(currentIndex + 1));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderLightbox(currentIndex + (currentLang === 'ar' ? 1 : -1));
    if (e.key === 'ArrowRight') renderLightbox(currentIndex + (currentLang === 'ar' ? -1 : 1));
  });

  /* ---------------------------------------------------------
     GUEST BOOK — Netlify Forms compatible + local live wall
  --------------------------------------------------------- */
  const guestForm = document.getElementById('guestbook-form');
  const guestWall = document.getElementById('guest-wall');
  const formStatus = document.getElementById('form-status');

  function encodeForm(data) {
    return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
  }

  function addGuestCard(name, message) {
    const card = document.createElement('div');
    card.className = 'guest-card';
    const safeName = document.createElement('div');
    safeName.className = 'guest-name';
    safeName.textContent = name;
    const safeMsg = document.createElement('div');
    safeMsg.className = 'guest-message';
    safeMsg.textContent = message;
    card.appendChild(safeName);
    card.appendChild(safeMsg);
    guestWall.prepend(card);
  }

  guestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value.trim();
    const message = document.getElementById('guest-message').value.trim();
    if (!name || !message) return;

    const formData = new FormData(guestForm);
    const payload = {};
    formData.forEach((v, k) => { payload[k] = v; });

    // Attempt Netlify Forms submission (no-op / silently ignored off Netlify)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm(payload),
    }).catch(() => { /* not deployed on Netlify — safe to ignore */ });

    addGuestCard(name, message);
    formStatus.textContent = currentLang === 'ar' ? 'شكرًا لك! تم إرسال تهنئتك 💛' : 'Thank you! Your wishes have been sent 💛';
    guestForm.reset();
    setTimeout(() => { formStatus.textContent = ''; }, 4000);
  });

  /* ---------------------------------------------------------
     HERO PARTICLES CANVAS
  --------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-particles');
  const heroCtx = heroCanvas.getContext('2d');
  let heroParticles = [];

  function sizeCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getAmbientColor() {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue('--ambient-color').trim() || '212,175,55';
  }

  function initHeroParticles() {
    heroCanvas.style.width = '100%';
    heroCanvas.style.height = '100%';
    sizeCanvas(heroCanvas);
    const count = window.innerWidth < 700 ? 50 : 100;
    heroParticles = Array.from({ length: count }, () => ({
      x: Math.random() * heroCanvas.clientWidth,
      y: Math.random() * heroCanvas.clientHeight,
      r: Math.random() * 1.8 + 0.4,
      speedY: Math.random() * 0.35 + 0.08,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      flicker: Math.random() * 0.02 + 0.005,
    }));
  }

  function drawHeroParticles() {
    const w = heroCanvas.clientWidth, h = heroCanvas.clientHeight;
    const color = getAmbientColor();
    heroCtx.clearRect(0, 0, w, h);
    heroParticles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.drift;
      p.alpha += Math.sin(Date.now() * p.flicker) * 0.004;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      heroCtx.beginPath();
      heroCtx.fillStyle = `rgba(${color},${Math.max(0.08, Math.min(0.85, p.alpha))})`;
      heroCtx.shadowBlur = 6;
      heroCtx.shadowColor = `rgba(${color},0.8)`;
      heroCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      heroCtx.fill();
    });
    requestAnimationFrame(drawHeroParticles);
  }

  initHeroParticles();
  if (!prefersReducedMotion) requestAnimationFrame(drawHeroParticles);

  /* ---------------------------------------------------------
     AMBIENT "VIDEO-LIKE" BACKGROUND
     Day: slow warm bokeh · Night: livelier blue bokeh + twinkles
  --------------------------------------------------------- */
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  let ambientLights = [];
  let twinkles = [];
  let petals = [];

  function isNight() { return document.body.classList.contains('theme-dark'); }

  function getPetalColor() {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue('--petal-color').trim() || '201,123,132';
  }

  function initAmbient() {
    ambientCanvas.style.width = '100%';
    ambientCanvas.style.height = '100%';
    sizeCanvas(ambientCanvas);
    const w = ambientCanvas.clientWidth, h = ambientCanvas.clientHeight;
    const count = window.innerWidth < 700 ? 16 : 30;
    ambientLights = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 60 + 30,
      speed: Math.random() * 0.15 + 0.03,
      alpha: Math.random() * 0.05 + 0.02,
    }));
    const twinkleCount = window.innerWidth < 700 ? 30 : 60;
    twinkles = Array.from({ length: twinkleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
    }));

    const petalCount = window.innerWidth < 700 ? 14 : 26;
    petals = Array.from({ length: petalCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 5 + 3,
      fallSpeed: Math.random() * 0.35 + 0.15,
      drift: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: Math.random() * 0.01 - 0.005,
      swayPhase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.35 + 0.25,
    }));
  }

  function drawAmbient() {
    const w = ambientCanvas.clientWidth, h = ambientCanvas.clientHeight;
    const color = getAmbientColor();
    const night = isNight();
    ambientCtx.clearRect(0, 0, w, h);

    ambientLights.forEach(l => {
      l.y -= l.speed * (night ? 1.6 : 1);
      if (l.y < -l.r) { l.y = h + l.r; l.x = Math.random() * w; }
      const grad = ambientCtx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
      grad.addColorStop(0, `rgba(${color},${l.alpha * (night ? 1.6 : 1)})`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ambientCtx.fillStyle = grad;
      ambientCtx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
    });

    if (night) {
      twinkles.forEach(t => {
        t.phase += t.speed;
        const a = (Math.sin(t.phase) + 1) / 2;
        ambientCtx.beginPath();
        ambientCtx.fillStyle = `rgba(${color},${0.25 + a * 0.55})`;
        ambientCtx.shadowBlur = 5;
        ambientCtx.shadowColor = `rgba(${color},0.9)`;
        ambientCtx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ambientCtx.fill();
      });
    } else {
      const petalColor = getPetalColor();
      petals.forEach(p => {
        p.y += p.fallSpeed;
        p.swayPhase += 0.015;
        p.x += p.drift + Math.sin(p.swayPhase) * 0.3;
        p.rotation += p.rotSpeed;
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ambientCtx.save();
        ambientCtx.translate(p.x, p.y);
        ambientCtx.rotate(p.rotation);
        ambientCtx.beginPath();
        ambientCtx.fillStyle = `rgba(${petalColor},${p.alpha})`;
        ambientCtx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
        ambientCtx.fill();
        ambientCtx.restore();
      });
    }
    requestAnimationFrame(drawAmbient);
  }

  initAmbient();
  if (!prefersReducedMotion) requestAnimationFrame(drawAmbient);

  /* ---------------------------------------------------------
     FIREWORKS (near Thank You section)
  --------------------------------------------------------- */
  const fwCanvas = document.getElementById('fireworks-canvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fireworkParticles = [];
  let fireworksRunning = false;

  function sizeFwCanvas() {
    fwCanvas.style.width = '100%';
    fwCanvas.style.height = '100%';
    sizeCanvas(fwCanvas);
  }
  sizeFwCanvas();

  function spawnBurst(cx, cy) {
    const color = getAmbientColor();
    const count = 46;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 2.6 + 1.2;
      fireworkParticles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        size: Math.random() * 2 + 1,
        color,
      });
    }
  }

  function runFireworks() {
    if (fireworksRunning) return;
    fireworksRunning = true;
    const w = fwCanvas.clientWidth;
    const bursts = [[w * 0.25, 140], [w * 0.75, 100], [w * 0.5, 190], [w * 0.15, 220], [w * 0.85, 170]];
    bursts.forEach((pos, i) => setTimeout(() => spawnBurst(pos[0], pos[1]), i * 420));
  }

  function animateFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.clientWidth, fwCanvas.clientHeight);
    fireworkParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.alpha -= p.decay;
      if (p.alpha > 0) {
        fwCtx.beginPath();
        fwCtx.fillStyle = `rgba(${p.color},${p.alpha})`;
        fwCtx.shadowBlur = 8;
        fwCtx.shadowColor = `rgba(${p.color},0.9)`;
        fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fwCtx.fill();
      }
    });
    fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);
    requestAnimationFrame(animateFireworks);
  }
  if (!prefersReducedMotion) requestAnimationFrame(animateFireworks);

  const thanksSection = document.getElementById('thanks');
  const fireworksObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !prefersReducedMotion) {
        runFireworks();
        fireworksObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  fireworksObserver.observe(thanksSection);

  /* ---------------------------------------------------------
     RESIZE
  --------------------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initHeroParticles();
      initAmbient();
      sizeFwCanvas();
    }, 200);
  });

})();
