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
  if (hex === '#7c4d8a') return '#ff00ff';
  return hex || '#ff00ff';
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

    emailjs.sendForm('service_zznwqah', 'template_78ww9gj', this)
      .then(() => {
        success.hidden = false;
        success.textContent = 'Thanks — message sent.';
        form.reset();
        setTimeout(() => { success.hidden = true; }, 4000);
      }, (error) => {
        success.hidden = false;
        success.textContent = 'Something went wrong. Please try again.';
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

  // public API
  window.Testimonials = {
    push(msg) {
      messages.push(msg);
    }
  };
});

const themes = {
  green: "#39FF14",
  red: "#FF3B3B",
  purple: "#6A0DAD",
  copper: "#B87333"
};

function setTheme(theme) {
  if (!themes[theme]) return; // guard: ignore unknown names
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  renderPaletteButtons(theme);
}

function renderPaletteButtons(activeTheme) {
  const switcher = document.querySelector('.palette-switcher');
  if (!switcher) return;

  // Ensure the question exists (defensive)
  if (!switcher.querySelector('.palette-question')) {
    const q = document.createElement('div');
    q.className = 'palette-question';
    q.setAttribute('role', 'note');
    q.textContent = "Don’t like the colour? Why not change it.";
    // insert at top, before buttons container
    const btns = switcher.querySelector('.palette-buttons');
    if (btns) switcher.insertBefore(q, btns);
    else switcher.prepend(q);
  }

  // Ensure there is a dedicated container for buttons
  let buttonsContainer = switcher.querySelector('.palette-buttons');
  if (!buttonsContainer) {
    buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'palette-buttons';
    buttonsContainer.setAttribute('role', 'group');
    buttonsContainer.setAttribute('aria-label', 'Colour options');
    switcher.appendChild(buttonsContainer);
  }

  // Only clear the buttons container (safe)
  buttonsContainer.innerHTML = '';

  // Compute visible themes (next 3 after active)
  const keys = Object.keys(themes);
  const startIndex = keys.indexOf(activeTheme);
  const visible = [];
  for (let i = 1; visible.length < 3 && i < keys.length + 1; i++) {
    const candidate = keys[(startIndex + i) % keys.length];
    if (candidate !== activeTheme) visible.push(candidate);
  }

  // Create buttons inside the buttons container
  visible.forEach(name => {
    const color = themes[name];
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.dataset.theme = name;                // used by delegated listener
    btn.style.background = color;
    btn.setAttribute('aria-label', name);
    btn.title = name.charAt(0).toUpperCase() + name.slice(1);
    buttonsContainer.appendChild(btn);
  });
}

// Replace initialization that calls setTheme with this (single source)
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'purple';
  const initial = themes[saved] ? saved : 'purple';
  // setTheme will call renderPaletteButtons(initial)
  setTheme(initial);

  // Delegated click handler: attach once and only once
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

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme') || 'purple';
  // If saved theme not found in themes, fallback to 'purple'
  const initial = themes[saved] ? saved : 'purple';
  setTheme(initial);
});

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.querySelector('.palette-switcher');
  if (!switcher) return;

  switcher.addEventListener('click', (e) => {
    const btn = e.target.closest('.palette-btn');
    if (!btn) return;
    const theme = btn.getAttribute('data-theme');
    if (theme) setTheme(theme);
  });

});
