// ============================================================
//  PROJECT MR PREZ — Galaxy Script
// ============================================================

// ── STARFIELD ─────────────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: randomBetween(0, W),
        y: randomBetween(0, H),
        r: randomBetween(0.3, 1.8),
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

    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 18;
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
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks.querySelectorAll('.nav-link');

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
    indicator.style.opacity = gone ? '0' : '1';
    indicator.style.pointerEvents = gone ? 'none' : 'auto';
    indicator.style.transition = 'opacity 0.5s ease';
  }, { passive: true });
})();


// ── REVEAL ON SCROLL ──────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.stat-card, .section-header, .tribute-inner, .reveal, .tool-card, .story-text-card'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();


// ── COUNTER ANIMATION ─────────────────────────────────────
(function initCounters() {
  // Dynamic "Days of Leadership" calculation: Aug 1, 2025 - Current
  const start = new Date('2025-08-01T00:00:00');
  const now = new Date();

  // Normalize both to midnight to count pure days
  const d1 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = Math.max(0, d2 - d1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const leadCounter = document.querySelector('#stat-1 .stat-number');
  if (leadCounter) leadCounter.dataset.target = diffDays;

  const counters = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
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
  // Each message is an ARRAY of paragraph strings.
  // Add as many paragraphs as you like — each becomes its own <p> block.
  const MESSAGES = [
    [
      "Hey Khaled!",
      "I just wanted to say thank you for all the effort you put into the GDC.",
      "The events you organize are always really creative, and it truly shows how much work you put in.",
      "I also really appreciate how understanding and respectful you are as a president. You always take everyone’s well-being into consideration, which makes the club feel comfortable for all of us. You’ve made things a lot easier for everyone, and it doesn’t go unnoticed, So ..",
      "THANKYOU!!"
    ],
    [
      "Khaled- you are an amazing President for the club and an inspiration for many.",
      "GD club was the silver lining for this semester for me, as it was really hard- doing what I love, which was designing and being appreciated for it, helped me even more!",
      "May God bless you 💖"
    ],
    [
      "Kind Sir",
      "You're a great leader & great person, you ensured GD club was a safe space for everyone.",
      "you carried the weight none of us saw, and still managed to keep that sunshine energy.",
      "you ensured we were heard and seen, that we were cared for and most importantly, you made us feel like we belonged.",
      "A year from now, a decade from now, I'll still be saying: I once had a leader like Khaled.",
      "A leader that taught me beyond what any club can offer, taught how to be human, how to be kind, how to care, how to lead with heart and mind alike.",
      "That's your legacy.",
      " ~ ~ ~ ",
      "Thank you for making GDC the rose amongst the thorns",
      "Thank you for being you"
    ],
    [
      "My brother from another mother, I still remember the first time we met in 10th grade right after the online classes ended.",
      "Back then, I never thought that you would become one of my best friends, or that you’d be one of the main reasons I chose this uni.",
      "I just want to say thank you for everything from your leadership at RIT to being the brother I needed most when times were tough. Inshallah this friendship will last forever.",
      "Thank you, even though it doesn't reflect the weight of your brotherhood."
    ],
    [
      "We've had our differences but I am glad that I was able to join the club under your presidency allowing me to start a new chapter in my life.",
      "Thank you"
    ],
    [
      "To Khaled, President of RIT’s Graphic Design Club, and a brother from another mother:",
      "Thank you for all the work you put in. From sorting out every little chaos that pops up to always having my back, you've poured real effort into this club and turned it into something solid and enjoyable for all of us.",
      "You’ve made everything smoother and way more fun for all of us. I'm glad you're the one steering the ship",
      "Honestly, I'm even luckier to have you as a real friend."
    ],
    [
      "Behind the great and humble leader you are today is a great and humble friend, one you strive to be to anyone.",
      "You bring out the best in people, like you brought out the best in me. I never sought validation, yet I got it anyway, and believe me; you have reached so many hearts.",
      "Keep going, Mr. Prez"
    ],
    [
      "I don't think anyone in the club can imagine GDC to be where it is without you, or talk about GDC without instantly mentioning you.",
      "Ofcourse everyone puts in their effort, but it takes an amazing leader as yourself to truly bring it to life.",
      "I love how you're always motivating and encouraging everyone, and alwayss whipping out new stuff to make our work even a tad bit easier.",
      "I genuinely dont think any other president out there goes to such lengths for their club members. Youuu are unrivaled and I wish you keep thriving!!",
      " I will always take great pride in knowing I have such an amazing person to call as President of my club. May Allah shower you with even more blessings and grant you even greater success ✨✨"
    ],
    [
      "Hello Khaled",
      "I hope you have many memorable, warm and fulfilling experiences ahead, just like how you created the vibe and experience for us club members.",
      "Wishing you the best for your future endeavors."
    ],
    [
      "Khaled, the club has seen major success this year, and I believe that YOU were the biggest factor to its success.",
      "Thank you"
    ],
    [
      "Khaled, ive seen you jump into the abandoned position of presidency and since that day all you wanted moving on was for the club's benefit.",
      "you were one of the few people who took it very seriously since day one, and put so much commitment and effort into it. even during the few months in summer when you were still the vice president.",
      "you didn't take a break, you jumped to planning. and you put so much love and dedication into every though and decision regarding the club.",
      "im not the only one who felt pride in seeing the club grow under your leadership, you have read what jillian and leen and sabrina said as well. even emaan kept keeping up with the club after she graduated and completely left uni, sharing how impressed she is about the club's progress after designathon.",
      "many students appreciate the club and enjoy attending it's events and reading the comics and magazines. you single handedly carried this club from under the ground to above the sky. you might think that you efforts were not appreciated, and they may have not been in the eyes of those who dont care. those who didnt join the club for passion.",
      "but believe me, in the eyes of every student who joined this club with passion, you are a hero. in the eyes of everyone who is writing you a message you are batman. shut down those who dont care, because they dont matter. and amplify the voices of those who do appreciate you. even if little, they care alot, and they truly love your leadership"
    ],
    [
      "I wanted to thank you Khaled for being such a supportive president.",
      "It’s awesome how you appreciate everyone’s hard work and always go the extra mile for us.",
      "Plus, keeping the club so organized and creating those tools has made things so much easier at RIT…",
      "It's seriously impressive!"
    ],
    [
      "Hello Khaled,",
      "I appreciate your leadership and all the work you do to ensure that the graphic design club thrives.",
      "Thank you for leading this amazing club!"
    ],
    [
      "I just wanted to take a moment to say thank you for everything you do for the club.",
      "Even though we’ve been online and I never really got to see you in person, I could always tell how much effort you put into making everyone feel included.",
      "You always made space for our opinions.",
      "You’ve been such a great leader, and I’m really grateful to be part of a club where the person running it genuinely cares",
      "Thank you for being so welcoming and supportive. It honestly made the whole experience so much better."
    ],
    [
      "Most people wouldn’t have handled half of what you did, Khaled.",
      "You had so much on your shoulders and somehow you still made sure we were all okay first. You carried things so quietly that we almost forgot how heavy it all was.",
      "That kind of selflessness doesn’t go unnoticed. It’s the reason some of us look up to you more than you’ll ever know.",
      "Even though it was never expressed, having a leader like you has been a privilege.",
      "May Allah reward you with tenfold of everything you gave us and more."
    ],
    [
      "Having worked alongside you over the past two years, it's been inspiring to see how the club has grown...especially this year under your presidency.",
      "It's been great working with you, and I truly appreciate the direction and clarity you've brought to the club.",
      "I'm really glad to see how many successful collaborations and events have come to life under your leadership.",
      "Looking forward to seeing the club grow even more. ✨"
    ],
    [
      "Hey! I just wanted to take a moment to say thank you for everything you do as president of the Graphic Design Club.",
      "You've been so nice, understanding, and accommodating, and your leadership really makes a difference.",
      "It's genuinely a pleasure being part of a club led by someone like you! 🎨"
    ],
    [
      "Hello Khaled Miari.",
      "Trust me",
      "This",
      "Is a situtaion",
      "Where more is less."
    ],
    [
      "I just wanted to say I really appreciate how accommodating you've been throughout the club.",
      "You never made me feel overburdened or uncomfortable, and I respect that you've always been mindful of my personal space.",
      "It made the experience a lot better for me, so thank you for that.",
      "Also the candy was a nice touch, not gonna lie"
    ]
  ];

  // Shuffle so order is different each visit
  const pool = [...MESSAGES].sort(() => Math.random() - 0.5);
  let index = 0;
  let busy = false;

  const skyStage = document.getElementById('sky-stage');
  const impactGlow = document.getElementById('impact-glow');
  const caughtCard = document.getElementById('caught-card');
  const caughtText = document.getElementById('caught-text');
  const catchBtn = document.getElementById('catch-btn');
  const catchLabel = document.getElementById('catch-label');
  const catchIcon = document.getElementById('catch-star-icon');
  const catchProg = document.getElementById('catch-progress');
  const catcher = document.getElementById('star-catcher');

  // Reveal the widget when the section scrolls into view
  const section = document.getElementById('messages');
  const sectionObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => catcher.classList.add('ready'), 350);
      sectionObs.disconnect();
    }
  }, { threshold: 0.25 });
  sectionObs.observe(section);

  let typingSession = 0;

  // ── Cinematic Decode Effect ──
  // Each paragraph types out sequentially into its own element.
  // The final paragraph gets the accent color class.
  function decodeText(container, paragraphs) {
    container.innerHTML = '';
    const currentSession = ++typingSession;

    // The scrollable ancestor is .caught-display
    const scrollPane = container.closest('.caught-display');

    let pIdx = 0;

    function typeNextParagraph() {
      if (pIdx >= paragraphs.length || currentSession !== typingSession) return;

      const isLast = pIdx === paragraphs.length - 1;
      const el = document.createElement('p');
      el.classList.add(isLast ? 'caught-para-last' : 'caught-para');
      if (pIdx > 0) el.style.marginTop = '0.9em';
      container.appendChild(el);

      let text = paragraphs[pIdx];
      if (pIdx === 0) text = `“${text}`;
      if (isLast) text = `${text}”`;
      let charIdx = 0;

      function type() {
        if (currentSession !== typingSession) return;

        if (charIdx < text.length) {
          el.classList.add('typing');
          const char = text.charAt(charIdx++);
          if (isLast && charIdx === text.length) {
            const span = document.createElement('span');
            span.style.color = 'var(--white)';
            span.style.textShadow = 'none';
            span.textContent = char;
            el.appendChild(span);
          } else {
            el.appendChild(document.createTextNode(char));
          }

          // Smoothly chase the scroll bottom
          if (scrollPane) {
            const targetScroll = scrollPane.scrollHeight - scrollPane.clientHeight;
            if (scrollPane.scrollTop < targetScroll) {
              // Add a tiny bit of "chase" logic for smoothness
              scrollPane.scrollTop += (targetScroll - scrollPane.scrollTop) * 0.15;
            }
          }
          setTimeout(type, 40);
        } else {
          el.classList.remove('typing');
          pIdx++;
          // Small pause between paragraphs
          setTimeout(typeNextParagraph, 450);
        }
      }
      type();
    }

    typeNextParagraph();
  }

  // ── Launch a comet straight down the sky stage ──
  function launchComet() {
    const comet = document.createElement('div');
    comet.classList.add('comet');

    // Random horizontal position, but falls dead straight
    const startX = 15 + Math.random() * 70;         // 15–85% horizontal
    const fallDist = (skyStage.offsetHeight || 480) + 160;

    comet.style.left = `${startX}%`;
    comet.style.setProperty('--fall-dist', `${fallDist}px`);

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
            catchLabel.textContent = "That's all the stars for tonight";
            catchIcon.style.display = 'none';
            catchBtn.classList.add('finished');
            catchProg.textContent = `You've caught all ${pool.length} stars ✧`;
          } else {
            catchLabel.textContent = 'Catch another one?';
            catchProg.textContent = `${index} of ${pool.length} stars caught`;
            catchBtn.disabled = false;
          }
          busy = false;
        }, 350);

      }, 150); // tiny delay so burst and bloom feel synchronised

    }, 1130); // must match cometFall CSS duration (1.1s)
  });

})();


// ── CINEMATIC INTRO ───────────────────────────────────────
(function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  const cbTop = overlay.querySelector('.cb-top');
  const cbBottom = overlay.querySelector('.cb-bottom');
  const invLines = overlay.querySelectorAll('.invite-line');
  const warpMsgs = overlay.querySelectorAll('.warp-msg');
  const skipBtn = document.getElementById('intro-skip');

  let W, H, animating = true, raf;
  let warpSpeed = 0;
  let stars = [];
  let introSkipped = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  function buildStars() {
    stars = [];
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        spd: 0.2 + Math.random() * 1.0,
        alp: 0.15 + Math.random() * 0.45,
        w: 0.2 + Math.random() * 0.9,
        col: Math.random() < 0.4 ? (Math.random() < 0.5 ? '180,150,255' : '0,210,255') : '210,200,255',
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
      const vel = s.spd * (1 + warpSpeed * 7);
      s.y -= vel;
      if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }

      const trail = vel * warpSpeed * 1.8;
      if (trail > 2) {
        const g = ctx.createLinearGradient(s.x, s.y + trail, s.x, s.y);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.4, `rgba(${s.col},${(s.alp * 0.25).toFixed(2)})`);
        g.addColorStop(1, `rgba(${s.col},${(s.alp * 0.7).toFixed(2)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = s.w;
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
        const t = Math.min((now - t0) / ms, 1);
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
      let t0 = performance.now();
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
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
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
          glow.addColorStop(0, 'rgba(255,255,255,0.88)');
          glow.addColorStop(0.35, 'rgba(205,170,255,0.45)');
          glow.addColorStop(1, 'transparent');
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
          const p = Math.min(elapsed / 1500, 1);
          const eased = 1 - Math.pow(1 - p, 2);
          bloomR = eased * Math.hypot(W, H) * 0.9;
          const bA = 1 - p;

          ctx.fillStyle = `rgba(2, 0, 12, ${(0.55 + p * 0.35).toFixed(2)})`;
          ctx.fillRect(0, 0, W, H);

          const bloom = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, bloomR);
          bloom.addColorStop(0, `rgba(225,195,255,${(bA * 0.9).toFixed(2)})`);
          bloom.addColorStop(0.3, `rgba(150,100,225,${(bA * 0.45).toFixed(2)})`);
          bloom.addColorStop(0.7, `rgba(70,20,130,${(bA * 0.18).toFixed(2)})`);
          bloom.addColorStop(1, 'transparent');
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
  function fadeOutOverlay(isTimelineEnd = false) {
    // If skip was pressed, don't let the timeline call this again
    if (isTimelineEnd && introSkipped) return;

    overlay.style.transition = 'opacity 1.5s ease';
    overlay.style.opacity = '0';
    document.body.style.overflow = '';
    // Force top of page on reveal
    window.scrollTo(0, 0);
    setTimeout(() => overlay.remove(), 1550);
  }

  // Skip — instant exit
  skipBtn.addEventListener('click', () => {
    introSkipped = true;
    stopDrawLoop();
    fadeOutOverlay();
  });
  document.body.style.overflow = 'hidden';

  // ── Cinematic timeline ──
  (async () => {
    // Phase 1 — invitation fades in, staggered
    await wait(500); if (introSkipped) return;
    invLines[0].classList.add('visible');
    await wait(620); if (introSkipped) return;
    invLines[1].classList.add('visible');

    // Letterbox bars + gentle drift
    await wait(3300); if (introSkipped) return;
    cbTop.classList.add('open');
    cbBottom.classList.add('open');
    lerpWarp(0.12, 1000);

    // Invitation fades out
    await wait(2950); if (introSkipped) return;
    invLines.forEach(l => l.classList.remove('visible'));
    await wait(600); if (introSkipped) return;

    // Warp rises to a soft cinematic drift
    lerpWarp(0.48, 3000);
    await wait(3000); if (introSkipped) return;

    // Four cinematic messages glow in
    if (!introSkipped) await showMsg(warpMsgs[0], 3400);
    if (!introSkipped) await showMsg(warpMsgs[1], 3400);
    if (!introSkipped) await showMsg(warpMsgs[2], 3250);
    if (!introSkipped) await showMsg(warpMsgs[3], 3250);

    // Warp eases back to stillness
    await wait(350); if (introSkipped) return;
    lerpWarp(0, 1100);
    await wait(2900); if (introSkipped) return;

    // Hand off to falling-star transition
    stopDrawLoop();

    // Land exactly at screen centre
    const dotX = W / 2;
    const dotY = H / 2;

    // The star falls → blooms → page reveals
    if (!introSkipped) await runFallingStarTransition(dotX, dotY);
    fadeOutOverlay(true);
  })();

  window.addEventListener('resize', () => { resize(); buildStars(); });
})();


// ── CUSTOM CINEMATIC CURSOR ──────────────────────────────
(function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let glowX = 0, glowY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    // Smooth lerp for dot
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

    // Slower lerp for glow to create "lagging" trail effect
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;

    requestAnimationFrame(tick);
  }
  tick();

  // ── Star-Paws Cursor Trail ──
  let lastPawTime = 0;
  window.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('meow-off')) return;

    const now = performance.now();
    if (now - lastPawTime > 150) { // Every 150ms
      const paw = document.createElement('div');
      paw.className = 'cursor-paw';
      paw.innerHTML = '🐾';
      paw.style.left = e.clientX + 'px';
      paw.style.top = e.clientY + 'px';
      document.body.appendChild(paw);
      setTimeout(() => paw.remove(), 2000);
      lastPawTime = now;
    }
  });

  // Handle pointer states
  const interactables = 'a, button, .stat-card, .nav-toggle, .btn, .space-cat';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
  });
})();


// ── SPACE CATS ───────────────────────────────────────────
(function initSpaceCats() {

  function revealOnScroll(id, threshold) {
    const el = document.getElementById(id);
    if (!el || !el.parentElement) return;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) el.classList.add('visible');
    }, { threshold: threshold || 0.15 }).observe(el.parentElement);
  }

  revealOnScroll('cat-reaching', 0.05);
  revealOnScroll('cat-reaching-mirror', 0.05);

  // ── Meow Toggle Logic ──
  const meowBtn = document.getElementById('meow-toggle');
  const catReaching = document.getElementById('cat-reaching');
  const catMirror = document.getElementById('cat-reaching-mirror');
  const peeker = document.getElementById('cat-peeker');

  let peekerInterval = null;

  function spawnSparkles(count = 40) {
    const container = document.createElement('div');
    container.classList.add('sparkle-container');
    document.body.appendChild(container);

    const chars = ['✦', '✧', '★', '☆'];

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.classList.add('sparkle');
      s.textContent = chars[Math.floor(Math.random() * chars.length)];

      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 3 + Math.random() * 3;
      const size = 0.7 + Math.random() * 1.5;
      const topOffset = Math.random() * 100; // Vary the start height slightly

      s.style.cssText = `
        left: ${left}%;
        top: -${60 + topOffset}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        font-size: ${size}rem;
      `;
      container.appendChild(s);
    }

    setTimeout(() => container.remove(), 6000);
  }

  function doRandomPeek() {
    if (!peeker || peeker.classList.contains('cats-hidden')) return;

    // Remove any previous side classes
    peeker.classList.remove('peek-bottom', 'peek-left', 'peek-right', 'visible');

    const sides = ['peek-bottom', 'peek-left', 'peek-right'];
    const chosenSide = sides[Math.floor(Math.random() * sides.length)];

    peeker.classList.add(chosenSide);

    // Small delay to ensure styles are applied
    setTimeout(() => {
      peeker.classList.add('visible');

      // Stay for 5 seconds as requested
      setTimeout(() => {
        peeker.classList.remove('visible');
      }, 5000);
    }, 100);
  }

  function startPeekerLoop() {
    if (peekerInterval) return;
    // Initial peek soon
    setTimeout(doRandomPeek, 2000);
    // Then every 12-20 seconds
    peekerInterval = setInterval(doRandomPeek, 12000 + Math.random() * 8000);
  }

  function stopPeekerLoop() {
    clearInterval(peekerInterval);
    peekerInterval = null;
    if (peeker) peeker.classList.remove('visible');
  }

  if (meowBtn) {
    // Pun toggling helper
    function updatePuns(isActive) {
      document.querySelectorAll('.cat-pun-toggle').forEach(el => {
        el.textContent = isActive ? el.dataset.pun : el.dataset.normal;
      });
    }

    // Check if it's active by default (it's not anymore)
    const isActiveOnLoad = meowBtn.classList.contains('active');
    document.body.classList.toggle('meow-off', !isActiveOnLoad);
    updatePuns(isActiveOnLoad);

    if (isActiveOnLoad) {
      startPeekerLoop();
    }


    meowBtn.addEventListener('click', () => {
      const isActive = meowBtn.classList.toggle('active');

      // Play meow sound
      const sfx = document.getElementById('meow-sfx');
      if (sfx) {
        sfx.currentTime = 0;
        sfx.play().catch(err => console.log('Audio playback prevented:', err));
      }

      document.body.classList.toggle('meow-off', !isActive);
      updatePuns(isActive);

      if (isActive) {
        spawnSparkles();
        startPeekerLoop();
      } else {
        stopPeekerLoop();
      }
    });
  }

  // ── Cosmic Purr Hearts ──
  function spawnHearts(e) {
    if (document.body.classList.contains('meow-off')) return;
    const count = 3;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-sparkle';
      heart.innerHTML = '💖';
      heart.style.left = (e.clientX + (Math.random() * 40 - 20)) + 'px';
      heart.style.top = (e.clientY + (Math.random() * 40 - 20)) + 'px';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }
  }

  [catReaching, catMirror, peeker].forEach(cat => {
    if (cat) {
      cat.addEventListener('mouseenter', spawnHearts);
      cat.addEventListener('mousedown', spawnHearts);
    }
  });



})();
