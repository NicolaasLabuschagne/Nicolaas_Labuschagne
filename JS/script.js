window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback);
        }
    );
})();

function effectMatrix(canvas) {
    var screen = window.screen;
    var width = 1920; // Width of a 1080p screen
    var height = 1080; // Height of a 1080p screen
    var fontScale = Math.sqrt(screen.width * screen.height) / Math.sqrt(width * height);
    canvas.width = screen.width;
    canvas.height = screen.height;
    var columns = Math.floor(screen.width / (10 * fontScale));

    // minimal change: staggered start positions so columns don't all move together
    var letters = new Array(columns);
    for (var i = 0; i < columns; i++) {
        // start some above view, some within view; keeps the original units (pixels)
        letters[i] = -Math.random() * canvas.height * 0.5 + Math.random() * (canvas.height * 0.25);
    }
    function getThemeColor() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--creative1') || '';
  const hex = raw.trim().toLowerCase();
  return hex ;
}

    var c = canvas.getContext("2d");

    var drawMatrix = function() {
        const bgCss = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
        c.fillStyle = "rgba(0,0,0,.25)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        const color = getThemeColor();
        c.fillStyle = color;
        c.font = `${fontScale * 20}px monospace`;

        for (var i = 0; i < columns; i++) {
            var text = Math.random() < 0.5 ? "0" : "1"; // Display only 0s and 1s
            var position_y = letters[i];
            var position_x = i * 10 * fontScale;
            c.fillText(text, position_x, position_y);

            if (position_y > (canvas.height / 2) + Math.random() * 1e4) {
                letters[i] = -Math.random() * canvas.height * 0.5; // restart above view with randomness
            } else {
                // minimal change: slow the fall by reducing the increment
                letters[i] += 10 * fontScale * 0.25; // originally 10 * fontScale
            }
        }
    };
    setInterval(drawMatrix, 60);
}

window.onload = function () {
    var matrixCanvas = document.getElementById("matrix-canvas");
    effectMatrix(matrixCanvas);
};

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const blockedEmail = 'Zhaques2001@gmail.com'; // Replace with your actual email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const letterRegex = /[a-zA-Z]/;

    success.hidden = true;

    // Validation checks
    if (!name || !email || !message) {
      success.textContent = 'Please fill in all fields.';
      success.hidden = false;
      return;
    }
    if (!letterRegex.test(name)) {
      success.textContent = 'Please use letters to write your Name.';
      success.hidden = false;
      return;
    }

    if (!emailRegex.test(email)) {
      success.textContent = 'Please enter a valid email address.';
      success.hidden = false;
      return;
    }

    if (email.toLowerCase() === blockedEmail.toLowerCase()) {
      success.textContent = 'Nice try. Please use a different email address.';
      success.hidden = false;
      return;
    }

    // Send email if validation passes
    emailjs.sendForm('service_zznwqah', 'template_78ww9gj', this)
      .then(() => {
        success.textContent = 'Thanks — message sent.';
        success.hidden = false;
        form.reset();
        setTimeout(() => { success.hidden = true; }, 4000);
      }, (error) => {
        success.textContent = 'Something went wrong. Please try again.';
        success.hidden = false;
        console.error('EmailJS error:', error);
      });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const strapEl = document.getElementById('strap-text');
  const phrases = [
  "Rise above the noise.",
  "Score beyond limits.",
  "Outwork every doubt."
];

  let pIndex = 0;
  let cIndex = 0;
  let deleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 40;
  const pauseAfterFull = 1100;
  const pauseAfterEmpty = 300;

  function loopType() {
    const phrase = phrases[pIndex];
    if (!deleting) {
      cIndex++;
      strapEl.textContent = phrase.slice(0, cIndex);
      if (cIndex === phrase.length) {
        deleting = true;
        setTimeout(loopType, pauseAfterFull);
        return;
      }
      setTimeout(loopType, typeSpeed + Math.random() * 60);
    } else {
      cIndex--;
      strapEl.textContent = phrase.slice(0, cIndex);
      if (cIndex === 0) {
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        setTimeout(loopType, pauseAfterEmpty);
        return;
      }
      setTimeout(loopType, deleteSpeed + Math.random() * 30);
    }
  }

  // start only if element exists
  if (strapEl) loopType();
});
document.addEventListener('DOMContentLoaded', function () {
  const textElement = document.getElementById('type-text');
  const phrases = [
    "Always learning.",
    "Always building.",
    "Always pushing the limits."
  ];

  let currentPhrase = 0;
  let currentChar = 0;
  let isDeleting = false;

  function typeLoop() {
    const phrase = phrases[currentPhrase];
    const speed = isDeleting ? 40 : 100;

    textElement.textContent = phrase.substring(0, currentChar);

    if (!isDeleting && currentChar < phrase.length) {
      currentChar++;
    } else if (isDeleting && currentChar > 0) {
      currentChar--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        currentPhrase = (currentPhrase + 1) % phrases.length;
      }
    }

    setTimeout(typeLoop, speed);
  }

  typeLoop();
});
document.addEventListener('DOMContentLoaded', () => {
  const chatFeed = document.getElementById('chat-feed');

  const messages = [
    { text: "Nicolaas was one of the students that excelled in university. He really made it hard to compete with him. He is relentless if he sets his mind to it.", author: "Patrick Bailey · Fellow Student (2023)" },
    { text: "Nicolaas is really one of the best and brightest I’ve seen.", author: "Jolene Jansen Van Rensburg · Junior Developer (2024)" },
    { text: "Great developer, even better person. Nicolaas is the kind of guy you want on your team when the pressure is on.", author: "Michael du Toit · Technical Lead (2024)" },
    { text: "Nicolaas helped me build my first website. He’s patient, kind, and explains things in a way that makes sense.", author: "Sipho Mokoena · Junior Developer (2025)" },
    { text: "He’s fast, thoughtful, and always delivers something better than expected. His property tools saves us hours every week.", author: "JD · Property Manager (2025)" },
    { text: "He sees the big picture, and understands how to make things work for users. A pleasure to work with.", author: "Taryn Jacobs · UX Designer (2024)" }
  ];

  let index = 0;
  let autoplay = true;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 6500;
  const FADE_MS = 420;

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }

  function createCard(msg) {
  const el = document.createElement('article');
  el.className = 'testimonial card';
  el.setAttribute('role','article');
  // build initials for avatar
  const initials = msg.author.split(' ')[0].slice(0,1) + (msg.author.split(' ')[1] ? msg.author.split(' ')[1].slice(0,1) : '');
  el.innerHTML = `
    <div class="quote-wrap">
      <div class="quote-mark" aria-hidden="true">“</div>
      <div class="msg">${escapeHtml(msg.text)}</div>
      <div class="meta"><span class="who">${escapeHtml(msg.author)}</span></div>
    </div>
  `;
  return el;
}

  // crossfade: fade out old, fade in new; clean up after transition
  async function crossfadeTo(newIndex) {
    const oldCard = chatFeed.querySelector('.testimonial');
    index = (newIndex + messages.length) % messages.length;
    const newCard = createCard(messages[index]);

    // position and append new card (hidden by default)
    chatFeed.appendChild(newCard);
    // force a paint so transitions apply reliably
    // eslint-disable-next-line no-unused-expressions
    newCard.offsetHeight;
    newCard.classList.add('visible');

    if (oldCard) {
      // fade out old
      oldCard.classList.remove('visible');
      // wait for fade duration, then remove
      await new Promise(res => setTimeout(res, FADE_MS));
      if (oldCard.parentNode) oldCard.parentNode.removeChild(oldCard);
    } else {
      // if no old card, ensure we still wait tiny bit
      await new Promise(res => setTimeout(res, 10));
    }

    resetAutoplay();
  }

  function next() { crossfadeTo(index + 1); }
  function startAutoplay() {
    stopAutoplay();
    if (!autoplay) return;
    autoplayTimer = setInterval(next, AUTOPLAY_INTERVAL);
  }
  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  function resetAutoplay() { stopAutoplay(); if (autoplay) autoplayTimer = setInterval(next, AUTOPLAY_INTERVAL); }

  // hover / focus pause
  chatFeed.addEventListener('mouseenter', () => { stopAutoplay(); });
  chatFeed.addEventListener('mouseleave', () => { if (autoplay) startAutoplay(); });
  chatFeed.addEventListener('focusin', () => { stopAutoplay(); });
  chatFeed.addEventListener('focusout', () => { if (autoplay) startAutoplay(); });

  // keyboard navigation
  chatFeed.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') crossfadeTo(index + 1);
    if (e.key === 'ArrowLeft') crossfadeTo(index - 1);
    if (e.key === ' ') { e.preventDefault(); autoplay = !autoplay; if (autoplay) startAutoplay(); else stopAutoplay(); }
  });

  // touch swipe
  let touchStartX = 0;
  chatFeed.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  chatFeed.addEventListener('touchend', (e) => {
    const diff = (e.changedTouches[0].clientX - touchStartX);
    if (diff > 40) crossfadeTo(index - 1);
    if (diff < -40) crossfadeTo(index + 1);
  }, { passive: true });

  // initial mount
  function mountInitial() {
    chatFeed.innerHTML = '';
    const first = createCard(messages[index]);
    chatFeed.appendChild(first);
    // force paint, then show
    // eslint-disable-next-line no-unused-expressions
    first.offsetHeight;
    first.classList.add('visible');
    chatFeed.removeAttribute('aria-hidden');
    startAutoplay();
  }
  mountInitial();

  window.Testimonials = {
    push(msg) {
      messages.push(msg);
    }
  };
});

const themes = {
  green: "#39FF14",
  copper: "#B87333",
  molten: "#FF6A00",
  yellow: "#FFD700",
  acid: "#E000E0",
  red: "#FF0033",
  purple: "#8A2BE2",
  cyan: "#00CED1",
  glitch: "#FF00FF",
};

function setTheme(theme) {
  if (!themes[theme]) return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  renderPaletteButtons(theme);
}

function renderPaletteButtons(activeTheme) {
  const switcher = document.querySelector('.palette-switcher');
  if (!switcher) return;

  if (!switcher.querySelector('.palette-question')) {
    const q = document.createElement('div');
    q.className = 'palette-question';
    q.setAttribute('role', 'note');
    q.textContent = "Don’t like the colour? Why not change it.";
    const btns = switcher.querySelector('.palette-buttons');
    if (btns) switcher.insertBefore(q, btns);
    else switcher.prepend(q);
  }

  let buttonsContainer = switcher.querySelector('.palette-buttons');
  if (!buttonsContainer) {
    buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'palette-buttons';
    buttonsContainer.setAttribute('role', 'group');
    buttonsContainer.setAttribute('aria-label', 'Colour options');
    switcher.appendChild(buttonsContainer);
  }

  buttonsContainer.innerHTML = '';

  const keys = Object.keys(themes);
  const startIndex = keys.indexOf(activeTheme);
  const visible = [];
  for (let i = 1; visible.length < 3 && i < keys.length + 1; i++) {
    const candidate = keys[(startIndex + i) % keys.length];
    if (candidate !== activeTheme) visible.push(candidate);
  }

  visible.forEach(name => {
    const color = themes[name];
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.dataset.theme = name;
    btn.style.background = color;
    btn.setAttribute('aria-label', name);
    btn.title = name.charAt(0).toUpperCase() + name.slice(1);
    buttonsContainer.appendChild(btn);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const keys = Object.keys(themes);
  const saved = localStorage.getItem('theme');

  // Helper: pick a random key different from `exclude` (tries up to N times)
  const pickRandomDifferent = (exclude) => {
    if (!exclude) return keys[Math.floor(Math.random() * keys.length)];
    if (keys.length === 1) return keys[0];
    let pick;
    const maxTries = 8;
    let tries = 0;
    do {
      pick = keys[Math.floor(Math.random() * keys.length)];
      tries++;
    } while (pick === exclude && tries < maxTries);
    // If still same after attempts (unlikely), pick next key in array
    if (pick === exclude) {
      const idx = keys.indexOf(exclude);
      pick = keys[(idx + 1) % keys.length];
    }
    return pick;
  };

  // If you want "random each visit but not the same as last", use this:
  const initialTheme = pickRandomDifferent(saved);
  setTheme(initialTheme);

  // Delegated click handler for palette buttons
  const switcher = document.querySelector('.palette-switcher');
  if (switcher && !switcher.__paletteHandlerAttached) {
    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.palette-btn');
      if (!btn) return;
      const theme = btn.getAttribute('data-theme');
      if (theme) setTheme(theme);
    });
    switcher.__paletteHandlerAttached = true;
  }
});

(function(){
  
  const CHAR_POOL = ['1','0'];

  function randomChar(){
    return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
  }

  function spawnDrop(cloud){
    const e = document.createElement('div');
    e.classList.add('drop');

    const r = Math.random();
    if (r < 0.25) e.classList.add('small');
    else if (r < 0.7) e.classList.add('medium');
    else e.classList.add('large');

    e.innerText = randomChar();

    const cloudRect = cloud.getBoundingClientRect();
    const left = Math.floor(Math.random() * Math.max(1, cloudRect.width));
    e.style.left = left + 'px';

    const duration = 1.2 + Math.random() * 1.0;
    e.style.animationDuration = duration + 's';

    const horiz = (Math.random() > 0.5 ? 8 : -8) * (0.5 + Math.random());
    e.style.setProperty('--horizontal-movement', horiz + 'px');

    cloud.appendChild(e);
    e.addEventListener('animationend', () => {
      if (e.parentNode) e.parentNode.removeChild(e);
    }, { once: true });
  }

  function startRain(){
    const cloud = document.querySelector('.cloud');
    if (!cloud) return;

    const baseInterval = (window.innerWidth < 700) ? 90 : 40;

    let last = 0;
    setInterval(() => {
      if (Math.random() < 0.85) spawnDrop(cloud);
      else if (Math.random() < 0.25) spawnDrop(cloud);
    }, baseInterval);
  }

  // run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRain);
  } else {
    startRain();
  }
})();
const popup = document.getElementById('theme-popup');
if (popup) {
  setTimeout(() => {
    popup.classList.add('show');

    // Auto-hide after 11 seconds (total visible time = 14s)
    setTimeout(() => {
      popup.classList.remove('show');
    }, 11000);
  }, 3000); // Delay before showing
}

// Helper: return index of current theme, or 0 if not found
function getCurrentThemeIndex() {
  const keys = Object.keys(themes);
  const current = document.documentElement.getAttribute('data-theme');
  const idx = keys.indexOf(current);
  return idx >= 0 ? idx : 0;
}

// Cycle to previous or next theme by offset (-1 or +1)
function cycleTheme(offset) {
  const keys = Object.keys(themes);
  if (keys.length === 0) return;
  const currentIndex = getCurrentThemeIndex();
  const nextIndex = (currentIndex + offset + keys.length) % keys.length;
  const nextTheme = keys[nextIndex];
  setTheme(nextTheme);
}

// Keyboard handler
function onThemeKeydown(e) {
  // Ignore if any modifier keys are pressed
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

  // Ignore when typing in inputs, textareas, or contenteditable elements
  const tag = document.activeElement && document.activeElement.tagName;
  const isEditable = document.activeElement && (
    document.activeElement.isContentEditable ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT'
  );
  if (isEditable) return;

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    cycleTheme(-1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    cycleTheme(1);
  }
}

// Attach once (safe guard)
if (!window.__themeKeyboardAttached) {
  window.addEventListener('keydown', onThemeKeydown);
  window.__themeKeyboardAttached = true;
}