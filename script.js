'u`s`e strict';

// ╔═══════════════════════════════════════════╗
// ║  ✏️  EASY CUSTOMIZATION SECTION          ║
// ╚═══════════════════════════════════════════╝
const CONFIG = {
  firstName: "AARADHY",
  lastName:  "GAUR.",

  skills: [
    { name: 'React / Next.js', pct: 85 },
    { name: 'Python',          pct: 78 },
    { name: 'Tailwind CSS',    pct: 90 },
    { name: 'TypeScript',      pct: 70 },
    { name: 'C++',             pct: 62 },
    { name: 'LangChain',       pct: 72 },
    { name: 'Node.js',         pct: 68 },
  ],

  // Particle count — lower if laggy on mobile
  PARTICLE_COUNT: 1600,

  // Color progression by scroll (0–1)
  // hue in degrees (0=red, 120=green, 240=blue)
  energyColors: [
    { at: 0.00, hue: 220, sat: 20, lit: 15 },  // Sleep: Deep Charcoal
    { at: 0.30, hue: 250, sat: 60, lit: 50 },  // Awakening: Indigo
    { at: 0.60, hue: 180, sat: 70, lit: 45 },  // Focus: Teal/Cyan
    { at: 1.00, hue: 75,  sat: 85, lit: 60 },  // Overdrive: Electric Lime
  ],
};

// ─────────────────────────────────────────────
//  INJECT HERO NAME FROM CONFIG
// ─────────────────────────────────────────────
document.getElementById('hero-first-name').textContent = CONFIG.firstName;
const lastEl = document.getElementById('hero-last-name');
lastEl.textContent = CONFIG.lastName;
lastEl.setAttribute('data-g', CONFIG.lastName);

// ─────────────────────────────────────────────
//  BUILD SKILL BARS
// ─────────────────────────────────────────────
const skillContainer = document.getElementById('skill-bars-container');
if (skillContainer) {
  CONFIG.skills.forEach(s => {
    skillContainer.insertAdjacentHTML('beforeend', `
      <div class="skill-row">
        <span class="skill-name">${s.name}</span>
        <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>
        <span class="skill-pct">${s.pct}%</span>
      </div>
    `);
  });
}

// ─────────────────────────────────────────────
//  CUSTOM CURSOR
// ─────────────────────────────────────────────
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

document.querySelectorAll('a,button,.bcard,.btn,.social-link').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

(function cursorLoop() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  if (dot) {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  }
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(cursorLoop);
})();

// ─────────────────────────────────────────────
//  SCROLL REVEAL
// ─────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Skill bar trigger
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(el => {
        setTimeout(() => { el.style.width = el.dataset.pct + '%'; }, 200);
      });
      skillObs.disconnect();
    }
  }, { threshold: 0.3 });
  skillObs.observe(skillsSection);
}

// ─────────────────────────────────────────────
//  THREE.JS PARTICLE SYSTEM
// ─────────────────────────────────────────────
const canvas = document.getElementById('bg');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 420;

  const N = CONFIG.PARTICLE_COUNT;
  const positions   = new Float32Array(N * 3);
  const colors      = new Float32Array(N * 3);
  const basePosArr  = new Float32Array(N * 3);
  const vx = new Float32Array(N), vy = new Float32Array(N), vz = new Float32Array(N);
  const col = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 100 + Math.pow(Math.random(), 0.7) * 320;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions[i3] = basePosArr[i3] = x;
    positions[i3+1] = basePosArr[i3+1] = y;
    positions[i3+2] = basePosArr[i3+2] = z;

    vx[i] = (Math.random() - 0.5) * 0.4;
    vy[i] = (Math.random() - 0.5) * 0.4;
    vz[i] = (Math.random() - 0.5) * 0.15;

    col.setHSL(0.65, 0.75, 0.35 + Math.random() * 0.2);
    colors[i3] = col.r; colors[i3+1] = col.g; colors[i3+2] = col.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.0, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // ─────────────────────────────────────────────
  //  ENERGY / SCROLL SYSTEM
  // ─────────────────────────────────────────────
  const eBarFill = document.getElementById('energy-bar-fill');
  const ePctEl   = document.getElementById('e-pct');
  const bpmEl    = document.getElementById('bpm-val');
  const modeBadge= document.getElementById('mode-badge');
  const mgEl     = document.getElementById('mg-val');
  const cupsEl   = document.getElementById('cup-icons');
  const opsEl    = document.getElementById('ops-val');

  let energy    = 0;   // 0–1
  let targetBpm = 58;
  let smoothBpm = 58;
  let mouseNX   = 0, mouseNY = 0;

  const STAGES = [
    { at:0,    name:'DORMANT',     bpm:58,  barCol:'#4444dd', badge:false },
    { at:0.20, name:'AWAKENING',   bpm:75,  barCol:'#00aaff', badge:false },
    { at:0.40, name:'FOCUSED',     bpm:98,  barCol:'#ffe566', badge:true  },
    { at:0.60, name:'CAFFEINATED', bpm:132, barCol:'#ccff00', badge:true  },
    { at:0.80, name:'HYPERFOCUS',  bpm:172, barCol:'#ff00aa', badge:true  },
  ];

  function getStage(e) {
    let s = STAGES[0];
    for (const st of STAGES) { if (e >= st.at) s = st; }
    return s;
  }

  function lerpColor(a, b, t) {
    return { hue: a.hue + (b.hue - a.hue)*t, sat: a.sat + (b.sat-a.sat)*t, lit: a.lit + (b.lit-a.lit)*t };
  }
  function energyToColor(e) {
    const ec = CONFIG.energyColors;
    for (let i = 0; i < ec.length - 1; i++) {
      if (e >= ec[i].at && e <= ec[i+1].at) {
        const t = (e - ec[i].at) / (ec[i+1].at - ec[i].at);
        return lerpColor(ec[i], ec[i+1], t);
      }
    }
    return ec[ec.length - 1];
  }

  document.addEventListener('mousemove', e => {
    mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    energy = Math.min(1, window.scrollY / scrollable);

    const pct   = Math.round(energy * 100);
    const stage = getStage(energy);

    if (ePctEl) ePctEl.textContent = String(pct).padStart(3,'0');
    if (eBarFill) {
      eBarFill.style.width      = pct + '%';
      eBarFill.style.background = stage.barCol;
    }
    targetBpm = stage.bpm + Math.random() * 4 - 2;

    if (modeBadge) {
      modeBadge.style.opacity    = stage.badge ? '1' : '0';
      modeBadge.textContent      = stage.name;
      modeBadge.style.color      = stage.barCol;
      modeBadge.style.borderColor= stage.barCol;
    }

    if (mgEl) {
      const mg = Math.round(energy * 440);
      mgEl.textContent  = mg;
      const cups = Math.min(5, Math.floor(mg / 88));
      if (cupsEl) cupsEl.textContent = '☕'.repeat(cups) + '⬜'.repeat(5 - cups);
    }

    document.body.classList.toggle('max-energy', energy >= 0.78);
  });

  // BPM smooth lerp + OPS counter
  let frameCount = 0;
  setInterval(() => {
    smoothBpm += (targetBpm - smoothBpm) * 0.08;
    if (bpmEl) bpmEl.textContent = Math.round(smoothBpm);
    const baseOps = Math.round(energy * 8000 + 120);
    if (opsEl) opsEl.textContent = (baseOps + Math.floor(Math.random() * 80 - 40)).toLocaleString();
  }, 120);

  // ─────────────────────────────────────────────
  //  DATA STREAM EFFECT (high energy)
  // ─────────────────────────────────────────────
  const streamEl = document.getElementById('data-stream');
  const hexChars = '0123456789ABCDEF';
  function randomHex(len) {
    return Array.from({length: len}, () => hexChars[Math.floor(Math.random()*16)]).join('');
  }
  setInterval(() => {
    if (!streamEl || energy < 0.75) return;
    const line = document.createElement('div');
    line.textContent = `0x${randomHex(8)} → ${randomHex(4)}:${randomHex(4)}`;
    streamEl.appendChild(line);
    if (streamEl.children.length > 30) streamEl.removeChild(streamEl.firstChild);
  }, 80);

  // ─────────────────────────────────────────────
  //  ANIMATION LOOP
  // ─────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    frameCount++;

    const delta   = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();
    const speed   = 1 + energy * 11;
    const c       = energyToColor(energy);

    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;

    const mxW = mouseNX * 350;
    const myW = mouseNY * 350;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;

      // Move
      posAttr.array[i3]   += vx[i] * speed * delta * 60;
      posAttr.array[i3+1] += vy[i] * speed * delta * 60;
      posAttr.array[i3+2] += vz[i] * speed * delta * 60;

      // Elastic return to home
      const pull = 0.0018 + energy * 0.004;
      vx[i] += (basePosArr[i3]   - posAttr.array[i3])   * pull;
      vy[i] += (basePosArr[i3+1] - posAttr.array[i3+1]) * pull;
      vz[i] += (basePosArr[i3+2] - posAttr.array[i3+2]) * pull;

      // Damping
      const damp = 0.984;
      vx[i] *= damp; vy[i] *= damp; vz[i] *= damp;

      // Mouse repel
      const dx = posAttr.array[i3]   - mxW;
      const dy = posAttr.array[i3+1] - myW;
      const dSq = dx*dx + dy*dy;
      const repR = (80 + energy * 80);
      if (dSq < repR*repR && dSq > 0.01) {
        const dist = Math.sqrt(dSq);
        const f = (repR - dist) / repR * 1.8;
        vx[i] += (dx/dist) * f;
        vy[i] += (dy/dist) * f;
      }

      // Color: base hue + per-particle variation + energy-driven shimmer
      const pHue  = ((c.hue + (i / N) * 40 + Math.sin(elapsed * 1.5 + i * 0.08) * 15) % 360) / 360;
      const pSat  = c.sat / 100;
      const pLit  = (c.lit + Math.sin(elapsed * 2 + i * 0.12) * 5) / 100;
      col.setHSL(pHue, pSat, pLit);
      colAttr.array[i3]   = col.r;
      colAttr.array[i3+1] = col.g;
      colAttr.array[i3+2] = col.b;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Rotate field
    pts.rotation.y += delta * (0.04 + energy * 0.25);
    pts.rotation.x += delta * (0.015 + energy * 0.08);

    // Camera breathe
    camera.position.x = Math.sin(elapsed * 0.18) * 12 * (1 + energy);
    camera.position.y = Math.cos(elapsed * 0.13) * 9  * (1 + energy);

    // Size + opacity scale with energy
    mat.size    = 1.6 + energy * 3.0;
    mat.opacity = 0.55 + energy * 0.4;

    // Cursor dot + ring tint at high energy
    if (energy > 0.55) {
      const hDeg = Math.round(((c.hue % 360) + 360) % 360);
      const hslCol  = `hsl(${hDeg},100%,70%)`;
      if (dot) dot.style.background   = hslCol;
      if (ring) ring.style.borderColor = hslCol;
    } else {
      if (dot) dot.style.background   = '#fff';
      if (ring) ring.style.borderColor = 'rgba(255,255,255,0.7)';
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Initial reveal trigger for hero
setTimeout(() => {
  document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('in'));
}, 100);

// ─────────────────────────────────────────────
//  CONTACT FORM → DISCORD WEBHOOK
// ─────────────────────────────────────────────
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1501888883326189598/mF9LJTFmlkmQIaEWiqm5kI-vdxdgVAs3KbufVMwW5JqepVhA-5VC2AVYJtBTsgJ_mbQ3';

const contactForm  = document.getElementById('contact-form');
const cfSubmitBtn  = document.getElementById('cf-submit');
const cfStatusDiv  = document.getElementById('cf-status');

function showFormStatus(msg, isError = false) {
  cfStatusDiv.textContent = msg;
  cfStatusDiv.style.color   = isError ? '#f87171' : '#E0FB41';
  cfStatusDiv.style.opacity = '1';
  setTimeout(() => { cfStatusDiv.style.opacity = '0'; }, 5000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── HONEYPOT CHECK ──────────────────────────────
    // Bots fill this hidden field; real users never see it.
    const honeypot = document.getElementById('cf-website').value;
    if (honeypot) {
      // Silently "succeed" so bots don't know they were blocked
      showFormStatus('✓ Message sent. I\'ll get back to you soon.');
      contactForm.reset();
      return;
    }

    // ── RATE LIMIT CHECK ────────────────────────────
    // Allow max 1 submission per 5 minutes per browser.
    const RATE_LIMIT_MS  = 5 * 60 * 1000; // 5 minutes
    const lastSent       = parseInt(localStorage.getItem('cf_last_sent') || '0', 10);
    const now            = Date.now();
    const timeSinceLast  = now - lastSent;

    if (lastSent && timeSinceLast < RATE_LIMIT_MS) {
      const secsLeft = Math.ceil((RATE_LIMIT_MS - timeSinceLast) / 1000);
      const minsLeft = Math.ceil(secsLeft / 60);
      showFormStatus(
        `✗ Slow down — you can send another message in ${minsLeft} min.`,
        true
      );
      return;
    }

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-msg').value.trim();

    if (!name || !email || !message) return;

    // Disable button while sending
    cfSubmitBtn.disabled    = true;
    cfSubmitBtn.textContent = '⏳ Sending...';

    const nowDate   = new Date();
    const timestamp = nowDate.toISOString();
    const timeStr   = nowDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

    const payload = {
      username:   'Portfolio Contact',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      embeds: [{
        title:     '📬 New Message from Portfolio',
        color:     0xE0FB41,
        timestamp: timestamp,
        fields: [
          { name: '👤 Name',       value: `\`\`\`${name}\`\`\``,    inline: false },
          { name: '📧 Email',      value: `\`\`\`${email}\`\`\``,   inline: false },
          { name: '💬 Message',    value: `\`\`\`${message}\`\`\``, inline: false },
          { name: '🕐 Time (IST)', value: timeStr,                   inline: true  },
          { name: '🔗 Reply',      value: `[Send Email](mailto:${email})`, inline: true },
        ],
        footer: { text: 'aaradhygaur.portfolio → contact.sh' },
      }],
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        // Record the successful send timestamp
        localStorage.setItem('cf_last_sent', String(Date.now()));
        showFormStatus('✓ Message sent. I\'ll get back to you soon.');
        contactForm.reset();
      } else {
        showFormStatus('✗ Something went wrong. Try emailing directly.', true);
      }
    } catch (err) {
      showFormStatus('✗ Network error. Try emailing directly.', true);
    } finally {
      cfSubmitBtn.disabled    = false;
      cfSubmitBtn.textContent = '→ Send It';
    }
  });
}

// ─────────────────────────────────────────────
//  LIVE STATUS ROTATOR
// ─────────────────────────────────────────────
const STATUS_MESSAGES = [
  'Solving a hydration error in Next.js...',
  'Debugging a RAG pipeline at 2am...',
  'Prompting Gemini to write better prompts...',
  'Untangling async/await spaghetti...',
  'Reading docs I should have read first...',
  'git commit -m "fix: it works, don\'t ask why"',
  'Optimizing a vector DB query...',
  'Accidentally broke prod. Fixed it. Nobody saw.',
  'Writing a useEffect that useEffects too much...',
  'Hallucination detected. Adding guardrails...',
  'Coffee → Code → Commit → Repeat.',
  'Convincing an LLM to stay on-topic...',
];

const statusEl    = document.getElementById('live-status');
const caffeineEl  = document.getElementById('live-caffeine');

if (statusEl) {
  let statusIdx = 0;
  let caffeineMg = 400;

  // Cycle status message with a typewriter fade
  setInterval(() => {
    statusIdx = (statusIdx + 1) % STATUS_MESSAGES.length;
    statusEl.style.opacity = '0';
    statusEl.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      statusEl.textContent = STATUS_MESSAGES[statusIdx];
      statusEl.style.opacity = '1';
    }, 420);
  }, 5000);

  // Slowly tick caffeine up (resets after 600mg — that's a problem)
  setInterval(() => {
    caffeineMg = caffeineMg >= 600 ? 80 : caffeineMg + Math.floor(Math.random() * 3 + 1);
    if (caffeineEl) caffeineEl.textContent = caffeineMg;
  }, 8000);
}
