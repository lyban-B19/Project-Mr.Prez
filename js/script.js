// ============================================================
//  PROJECT MR PREZ — Galaxy Script
// ============================================================

// ── STARFIELD ─────────────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let stars    = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     randomBetween(0, W),
        y:     randomBetween(0, H),
        r:     randomBetween(0.3, 1.8),
        alpha: randomBetween(0.2, 1),
        speed: randomBetween(0.0003, 0.002),
        phase: randomBetween(0, Math.PI * 2),
        color: Math.random() < 0.2 ? (Math.random() < 0.5 ? '#c084fc' : '#00d2ff') : '#ffffff',
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const twinkle = 0.55 + 0.45 * Math.sin(t * s.speed * 1000 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  let lastT = 0;
  function loop(t) {
    if (t - lastT > 30) {
      drawStars(t);
      lastT = t;
    }
    requestAnimationFrame(loop);
  }

  resize();
  createStars(280);
  requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    resize();
    createStars(280);
  });
})();


// ── FLOATING PARTICLES ────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  const COUNT = 22;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size     = Math.random() * 3 + 1;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 18;
    const duration = Math.random() * 15 + 12;

    p.style.cssText = `
      width:             ${size}px;
      height:            ${size}px;
      left:              ${left}%;
      bottom:            -${size}px;
      animation-duration: ${duration}s;
      animation-delay:    ${delay}s;
      opacity:            0;
    `;
    container.appendChild(p);
  }
})();


// ── NAVBAR SCROLL ─────────────────────────────────────────
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const links     = navLinks.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = navLinks.querySelector(`[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


// ── SCROLL INDICATOR FADE ─────────────────────────────────
(function initScrollIndicator() {
  const indicator = document.getElementById('scroll-indicator');
  window.addEventListener('scroll', () => {
    const gone = window.scrollY > 60;
    indicator.style.opacity       = gone ? '0' : '1';
    indicator.style.pointerEvents = gone ? 'none' : 'auto';
    indicator.style.transition    = 'opacity 0.5s ease';
  }, { passive: true });
})();


// ── REVEAL ON SCROLL ──────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.stat-card, .section-header, .tribute-inner'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx      = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();


// ── COUNTER ANIMATION ─────────────────────────────────────
(function initCounters() {
  // Dynamic "Days of Leadership" calculation
  const startDate = new Date('2025-08-01');
  const today     = new Date();
  const diffTime  = Math.max(0, today - startDate);
  const diffDays  = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const leadCounter = document.querySelector('#stat-1 .stat-number');
  if (leadCounter) leadCounter.dataset.target = diffDays;

  const counters = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target   = +el.dataset.target;
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ── PARALLAX NEBULAE ON MOUSE MOVE ────────────────────────
(function initParallax() {
  const nebulae = document.querySelectorAll('.nebula');

  window.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;

    nebulae.forEach((n, i) => {
      const depth = (i + 1) * 10;
      n.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  }, { passive: true });
})();


// ── STAR CATCHER ──────────────────────────────────────────
(function initStarCatcher() {

  // Hard-coded anonymous messages (shuffled each visit)
  const MESSAGES = [
    "You made every room feel lighter just by walking in. Thank you for being our anchor.",
    "The way you listened — really listened — made all the difference. We didn't just feel heard, we felt seen.",
    "You carried so much on your shoulders and never let it show. That's not a small thing. That's everything.",
    "I used to dread our meetings. Then you came along and somehow turned them into the highlight of my week.",
    "You led with your heart first. That's rare, Khaled. Please don't ever stop.",
    "The quiet things you did — the ones nobody noticed — those were actually the most impressive.",
    "A year from now, a decade from now, I'll still be saying: I once had a leader like Khaled. That's your legacy.",
    "You always found a way to make everyone's win feel like a shared win. That is a gift not everyone has.",
    "Thank you for the late nights you took on so we wouldn't have to. We noticed. We always noticed.",
    "You made us believe this little group of ours could do something that actually mattered. We still believe it.",
  ];

  // Shuffle so order is different each visit
  const pool = [...MESSAGES].sort(() => Math.random() - 0.5);
  let index  = 0;
  let busy   = false;

  const skyStage   = document.getElementById('sky-stage');
  const impactGlow = document.getElementById('impact-glow');
  const caughtCard = document.getElementById('caught-card');
  const caughtText = document.getElementById('caught-text');
  const catchBtn   = document.getElementById('catch-btn');
  const catchLabel = document.getElementById('catch-label');
  const catchIcon  = document.getElementById('catch-star-icon');
  const catchProg  = document.getElementById('catch-progress');
  const catcher    = document.getElementById('star-catcher');

  // Reveal the widget when the section scrolls into view
  const section = document.getElementById('messages');
  const sectionObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => catcher.classList.add('ready'), 350);
      sectionObs.disconnect();
    }
  }, { threshold: 0.25 });
  sectionObs.observe(section);
  
  // ── Cinematic Decode Effect ──
  function decodeText(el, text) {
    el.textContent = "";
    let i = 0;
    const speed = 25; // ms per char
    
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // ── Launch a comet across the sky stage ──
  function launchComet() {
    const comet = document.createElement('div');
    comet.classList.add('comet');

    const startX   = 12 + Math.random() * 76;       // 12–88 % horizontal
    const driftX   = (Math.random() - 0.5) * 160;    // wider diagonal
    const angle    = (driftX / 160) * 15;            // slightly tilt the comet
    const fallDist = (skyStage.offsetHeight || 420) + 140;

    comet.style.left = `${startX}%`;
    comet.style.setProperty('--drift-x',    `${driftX}px`);
    comet.style.setProperty('--fall-dist',  `${fallDist}px`);
    comet.style.setProperty('--comet-angle', `${angle}deg`);

    skyStage.appendChild(comet);
    return comet;
  }

  // ── Button click handler ──
  catchBtn.addEventListener('click', () => {
    if (busy || index >= pool.length) return;
    busy = true;
    catchBtn.disabled = true;

    // Hide any previous message instantly
    caughtCard.classList.remove('show');

    // Fire the star
    const comet = launchComet();

    // After comet animation (~1.15 s) → impact + message
    setTimeout(() => {
      comet.remove();

      // Cinematic vibration + impact burst
      skyStage.classList.add('impact-vibration');
      impactGlow.classList.add('burst');

      setTimeout(() => {
        skyStage.classList.remove('impact-vibration');
        impactGlow.classList.remove('burst');
      }, 800);

      // Trigger decoding effect + card bloom
      setTimeout(() => {
        caughtCard.classList.add('show');
        decodeText(caughtText, pool[index]);
        index++;

        // Update controls after card has partially bloomed
        setTimeout(() => {
          if (index >= pool.length) {
            catchLabel.textContent  = "That's all the stars for tonight";
            catchIcon.style.display = 'none';
            catchBtn.classList.add('finished');
            catchProg.textContent   = `You've caught all ${pool.length} stars ✧`;
          } else {
            catchLabel.textContent = 'Catch another one?';
            catchProg.textContent  = `${index} of ${pool.length} stars caught`;
            catchBtn.disabled      = false;
          }
          busy = false;
        }, 350);

      }, 150); // tiny delay so burst and bloom feel synchronised

    }, 1130); // must match cometFall CSS duration (1.1s)
  });

})();


// ── CINEMATIC INTRO ───────────────────────────────────────
(function initIntro() {
  const overlay  = document.getElementById('intro-overlay');
  if (!overlay) return;

  const canvas   = document.getElementById('intro-canvas');
  const ctx      = canvas.getContext('2d');
  const cbTop    = overlay.querySelector('.cb-top');
  const cbBottom = overlay.querySelector('.cb-bottom');
  const invLines = overlay.querySelectorAll('.invite-line');
  const warpMsgs = overlay.querySelectorAll('.warp-msg');
  const skipBtn  = document.getElementById('intro-skip');

  let W, H, animating = true, raf;
  let warpSpeed = 0;
  let stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  function buildStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        spd:  0.2 + Math.random() * 1.0,
        alp:  0.15 + Math.random() * 0.45,
        w:    0.2 + Math.random() * 0.9,
        col:  Math.random() < 0.4 ? (Math.random() < 0.5 ? '180,150,255' : '0,210,255') : '210,200,255',
      });
    }
  }
  buildStars();

  // ── Render loop ──
  function draw() {
    // Slow, dreamy fade — long soft trails at peak
    const fade = 0.18 + warpSpeed * 0.28;
    ctx.fillStyle = `rgba(2, 0, 12, ${fade})`;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      const vel   = s.spd * (1 + warpSpeed * 7);
      s.y -= vel;
      if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }

      const trail = vel * warpSpeed * 1.8;
      if (trail > 2) {
        const g = ctx.createLinearGradient(s.x, s.y + trail, s.x, s.y);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.4, `rgba(${s.col},${(s.alp * 0.25).toFixed(2)})`);
        g.addColorStop(1,   `rgba(${s.col},${(s.alp * 0.7).toFixed(2)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth   = s.w;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y + trail);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(s.w * 0.5, 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col},${(s.alp * 0.8).toFixed(2)})`;
        ctx.fill();
      }
    });

    if (animating) raf = requestAnimationFrame(draw);
  }
  draw();

  // ── Helpers ──
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function lerpWarp(to, ms) {
    const from = warpSpeed, t0 = performance.now();
    return new Promise(r => {
      (function tick(now) {
        const t   = Math.min((now - t0) / ms, 1);
        warpSpeed = from + (to - from) * (1 - Math.pow(1 - t, 3));
        t < 1 ? requestAnimationFrame(tick) : r();
      })(t0);
    });
  }

  function showMsg(el, hold = 1200) {
    return new Promise(async r => {
      el.classList.add('glow');
      await wait(hold);
      el.classList.remove('glow');
      await wait(550);
      r();
    });
  }

  // ── Falling star → bloom transition ──
  function runFallingStarTransition(targetX, targetY) {
    return new Promise(r => {
      let phase = 'blackout';
      let t0    = performance.now();
      let starY = -30;
      let bloomR = 0;

      function step(now) {
        const elapsed = now - t0;

        if (phase === 'blackout') {
          // Fade to full black over 1.4s
          const p = Math.min(elapsed / 1400, 1);
          ctx.fillStyle = `rgba(2, 0, 12, ${(0.05 + p * 0.95).toFixed(3)})`;
          ctx.fillRect(0, 0, W, H);
          if (p >= 1) { phase = 'falling'; t0 = now; }
          requestAnimationFrame(step);

        } else if (phase === 'falling') {
          // Gentle fall over 4.4s with ease-in-out
          const p = Math.min(elapsed / 4400, 1);
          const e = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2) / 2;
          starY = -30 + (targetY + 30) * e;

          // Soft persist — draws gentle trail
          ctx.fillStyle = 'rgba(2, 0, 12, 0.18)';
          ctx.fillRect(0, 0, W, H);

          // Wispy tail above the star
          const tail = ctx.createLinearGradient(targetX, starY - 60, targetX, starY);
          tail.addColorStop(0, 'transparent');
          tail.addColorStop(1, 'rgba(200,170,255,0.22)');
          ctx.strokeStyle = tail;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(targetX, starY - 60);
          ctx.lineTo(targetX, starY);
          ctx.stroke();

          // Soft outer glow
          const glow = ctx.createRadialGradient(targetX, starY, 0, targetX, starY, 24);
          glow.addColorStop(0,    'rgba(255,255,255,0.88)');
          glow.addColorStop(0.35, 'rgba(205,170,255,0.45)');
          glow.addColorStop(1,    'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(targetX, starY, 24, 0, Math.PI * 2);
          ctx.fill();

          // Bright pinpoint core
          ctx.fillStyle = 'rgba(255,255,255,0.97)';
          ctx.beginPath();
          ctx.arc(targetX, starY, 2, 0, Math.PI * 2);
          ctx.fill();

          if (p >= 1) { phase = 'bloom'; t0 = now; bloomR = 0; }
          requestAnimationFrame(step);

        } else if (phase === 'bloom') {
          // Soft radial bloom expands & fades over 1.5s
          const p     = Math.min(elapsed / 1500, 1);
          const eased = 1 - Math.pow(1 - p, 2);
          bloomR      = eased * Math.hypot(W, H) * 0.9;
          const bA    = 1 - p;

          ctx.fillStyle = `rgba(2, 0, 12, ${(0.55 + p * 0.35).toFixed(2)})`;
          ctx.fillRect(0, 0, W, H);

          const bloom = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, bloomR);
          bloom.addColorStop(0,   `rgba(225,195,255,${(bA * 0.9).toFixed(2)})`);
          bloom.addColorStop(0.3, `rgba(150,100,225,${(bA * 0.45).toFixed(2)})`);
          bloom.addColorStop(0.7, `rgba(70,20,130,${(bA * 0.18).toFixed(2)})`);
          bloom.addColorStop(1,   'transparent');
          ctx.fillStyle = bloom;
          ctx.beginPath();
          ctx.arc(targetX, targetY, bloomR, 0, Math.PI * 2);
          ctx.fill();

          if (p >= 1) r();
          else requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    });
  }

  // ── Stop draw loop ──
  function stopDrawLoop() {
    animating = false;
    cancelAnimationFrame(raf);
  }

  // ── Fade overlay, page blooms through ──
  function fadeOutOverlay() {
    overlay.style.transition = 'opacity 1.5s ease';
    overlay.style.opacity    = '0';
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 1550);
  }

  // Skip — instant exit
  skipBtn.addEventListener('click', () => { stopDrawLoop(); fadeOutOverlay(); });
  document.body.style.overflow = 'hidden';

  // ── Cinematic timeline ──
  (async () => {
    // Phase 1 — invitation fades in, staggered
    await wait(500);
    invLines[0].classList.add('visible');
    await wait(620);
    invLines[1].classList.add('visible');

    // Letterbox bars + gentle drift
    await wait(3300);          // +2s
    cbTop.classList.add('open');
    cbBottom.classList.add('open');
    lerpWarp(0.12, 1000);

    // Invitation fades out
    await wait(2950);          // +2s
    invLines.forEach(l => l.classList.remove('visible'));
    await wait(600);

    // Warp rises to a soft cinematic drift
    lerpWarp(0.48, 3000);
    await wait(3000);          // +2s

    // Four cinematic messages glow in
    await showMsg(warpMsgs[0], 3400); // +2s hold
    await showMsg(warpMsgs[1], 3400); // +2s hold
    await showMsg(warpMsgs[2], 3250); // +2s hold
    await showMsg(warpMsgs[3], 3250); // +2s hold

    // Warp eases back to stillness
    await wait(350);
    lerpWarp(0, 1100);
    await wait(2900);          // +2s

    // Hand off to falling-star transition
    stopDrawLoop();

    // Land exactly at screen centre
    const dotX = W / 2;
    const dotY = H / 2;

    // The star falls → blooms → page reveals
    await runFallingStarTransition(dotX, dotY);
    fadeOutOverlay();
  })();

  window.addEventListener('resize', () => { resize(); buildStars(); });
})();
