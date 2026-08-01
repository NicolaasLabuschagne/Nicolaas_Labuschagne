
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    const symbolChars = ['★', '•', '✎', '➤', '❖'];
    const gridSize = 65;

    let easedMouseX = 0;
    let easedMouseY = 0;
    const easing = 0.08;

    let primaryColor = [190, 242, 100];
    let textColor = [0, 0, 0];

    function updateColors() {
        const style = getComputedStyle(document.body);

        const pRGB = style.getPropertyValue('--primary-color-rgb') || '190, 242, 100';
        primaryColor = pRGB.split(',').map(c => parseInt(c.trim()));

        const tRGB = style.getPropertyValue('--text-color-rgb') || '0, 0, 0';
        textColor = tRGB.split(',').map(c => parseInt(c.trim()));
    }

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        p.noStroke();
        p.textFont('Montserrat');

        updateColors();
        initSymbols();

        window.addEventListener('themeChanged', updateColors);
    };

    function initSymbols() {
        symbols = [];
        for (let x = 0; x < p.width; x += gridSize) {
            for (let y = 0; y < p.height; y += gridSize) {
                symbols.push({
                    x: x + p.random(-10, 10),
                    y: y + p.random(-10, 10),
                    char: p.random(symbolChars),
                    angle: p.random(p.TWO_PI),
                    size: p.random(10, 18)
                });
            }
        }
    }

    p.draw = () => {
        p.clear();

        easedMouseX = p.lerp(easedMouseX, p.mouseX, easing);
        easedMouseY = p.lerp(easedMouseY, p.mouseY, easing);

        symbols.forEach(s => {
            const dx = easedMouseX - s.x;
            const dy = easedMouseY - s.y;
            const distSq = dx*dx + dy*dy;

            let dist = 250;
            let alpha;
            let color;
            let offset = 0;

            // Only calculate square root and complex logic if within 400px
            if (distSq < 160000) {
                dist = p.sqrt(distSq);

                if (dist < 250) {
                    offset = p.map(dist, 0, 250, 15, 0);
                }

                if (dist < 200) {
                    alpha = p.map(dist, 0, 200, 150, 2);
                    color = primaryColor;
                } else {
                    alpha = p.map(p.min(dist, 400), 0, 400, 30, 2);
                    color = textColor;
                }
            } else {
                alpha = 2;
                color = textColor;
            }

            p.fill(color[0], color[1], color[2], alpha);
            p.textSize(s.size);
            p.push();
            p.translate(s.x, s.y);
            p.rotate(s.angle + dist * 0.002);
            p.text(s.char, offset, offset);
            p.pop();
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initSymbols();
    };
};

new p5(sketch);

/* ===========================
   Analytics Engine: User Behavior Tracking
   =========================== */
const AnalyticsEngine = {
    startTime: performance.now(),

    init() {
        this.trackClicks();
        this.trackThemeChanges();
        this.trackSessionDuration();
    },

    trackClicks() {
        // Track specific important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                const text = target.innerText.trim().toUpperCase();
                const href = target.getAttribute('href');

                if (text.includes('HIRE ME')) {
                    this.logEvent('click_hire_me', { location: href && href.includes('mailto') ? 'email' : 'nav' });
                } else if (text === 'VIEW DOSSIER') {
                    this.logEvent('click_view_dossier');
                } else if (text === 'STACK') {
                    this.logEvent('click_the_stack');
                } else if (href && href.includes('paypal.com')) {
                    this.logEvent('click_paypal_coffee');
                }
            }

            // Track all clicks for future development (heatmap/behavioral analysis)
            const rawTarget = e.target;
            this.logEvent('raw_click', {
                tag: rawTarget.tagName,
                id: rawTarget.id || 'none',
                class: rawTarget.className || 'none',
                x: e.pageX,
                y: e.pageY
            });
        });
    },

    trackThemeChanges() {
        window.addEventListener('themeChanged', (e) => {
            this.logEvent('theme_change', { theme: e.detail });
        });
    },

    trackSessionDuration() {
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                const duration = Math.round((performance.now() - this.startTime) / 1000);
                this.logEvent('session_duration', { duration_seconds: duration });
            }
        });
    },

    logEvent(name, params = {}) {
        if (typeof gtag === 'function') {
            gtag('event', name, params);
        }
        //console.log(`[Analytics] Event: ${name}`, params);
    }
};

/* ===========================
   GitHub Cache: short-lived response cache for the (unauthenticated,
   60-requests/hour-per-IP) GitHub API. Reusing a recent response instead of
   re-fetching is what actually protects against the rate limit here — a
   token can't safely live in shipped client-side JS on a static site.
   =========================== */
const GitHubCache = {
    ttlMs: 10 * 60 * 1000, // 10 minutes

    async fetch(url) {
        const key = `gh_cache:${url}`;
        try {
            const cached = JSON.parse(sessionStorage.getItem(key));
            if (cached && Date.now() - cached.time < this.ttlMs) {
                return cached.data;
            }
        } catch (_) {
            // Missing or corrupt cache entry — fall through to a real fetch.
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
        const data = await res.json();

        try {
            sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
        } catch (_) {
            // Storage full or unavailable (e.g. private browsing) — not fatal, just skip caching.
        }

        return data;
    }
};

/* ===========================
   Contrast Engine: auto text color from brand color luminance
   =========================== */
const ContrastEngine = {
    // ITU-R BT.709 relative luminance
    getLuminance(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    getReadableTextColor(r, g, b, darkText, lightText) {
        return this.getLuminance(r, g, b) <= 128 ? lightText : darkText;
    },

    update() {
        // Brand colors live on body.theme-creative, not :root — read/write there
        // so the computed value reflects light vs. dark and inline style wins the cascade.
        // Only "accent" is auto-computed: primary/secondary have curated on-brand text
        // colors (e.g. Sage Gray-Green on Banana Yellow) that a luminance check would override.
        const target = document.body;
        const style = getComputedStyle(target);
        const isDark = document.documentElement.classList.contains('dark');
        const darkText = isDark ? '#0a0a0a' : '#4A4A4A';
        const lightText = '#ffffff';

        ['accent'].forEach(name => {
            const raw = style.getPropertyValue(`--${name}-color-rgb`).trim();
            if (!raw) return;
            const [r, g, b] = raw.split(',').map(n => parseInt(n.trim(), 10));
            target.style.setProperty(`--on-${name}-color`, this.getReadableTextColor(r, g, b, darkText, lightText));
        });
    }
};

/* ===========================
   Hue Shift Engine: scroll-driven color cycling, dark mode only
   =========================== */
const HueShiftEngine = {
    // Base hue/sat/light for each rotating swatch, tuned to reproduce the
    // existing vivid dark palette (lime / yellow / pink) at scroll position 0.
    swatches: {
        primary:   { h: 83,  s: 85,  l: 67 },
        secondary: { h: 48,  s: 100, l: 62 },
        accent:    { h: 340, s: 100, l: 71 },
    },

    hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    },

    // True while something else (a manual terminal color pick, rainbow mode) owns
    // the color variables — scroll-driven rotation backs off until this clears.
    paused: false,
    // True once the visitor explicitly picked a color via the terminal — keeps
    // scroll-driven rotation off even after rainbow mode (which also pauses this) ends.
    manualOverride: false,

    // Core primitive: rotate every swatch to a given absolute offset and write it
    // to the DOM. Shared by scroll-driven rotation and the terminal's rainbow mode —
    // deliberately has no theme check, since rainbow mode runs in either theme.
    applyOffset(offsetDegrees) {
        const body = document.body;

        Object.entries(this.swatches).forEach(([name, base]) => {
            const hue = (base.h + offsetDegrees) % 360;
            const [r, g, b] = this.hslToRgb(hue, base.s, base.l);
            const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
            body.style.setProperty(`--${name}-color`, hex);
            body.style.setProperty(`--${name}-color-rgb`, `${r}, ${g}, ${b}`);
            body.style.setProperty(`--on-${name}-color`, ContrastEngine.getReadableTextColor(r, g, b, '#0a0a0a', '#ffffff'));
        });

        // Keep the glow effects in sync with the swatches they're meant to echo
        body.style.setProperty('--glow-color', `rgba(${body.style.getPropertyValue('--primary-color-rgb')}, 0.6)`);
        body.style.setProperty('--glow-pink-color', `rgba(${body.style.getPropertyValue('--accent-color-rgb')}, 0.6)`);
    },

    apply(scrollProgress) {
        if (this.paused || !document.documentElement.classList.contains('dark') || isNaN(scrollProgress)) return;
        this.applyOffset((scrollProgress / 100) * 360);
    },

    // Switching to light mode must drop these inline overrides — otherwise they'd
    // keep beating the light theme's own CSS-defined pastel colors indefinitely.
    reset() {
        const body = document.body;
        ['primary', 'secondary', 'accent'].forEach(name => {
            body.style.removeProperty(`--${name}-color`);
            body.style.removeProperty(`--${name}-color-rgb`);
            body.style.removeProperty(`--on-${name}-color`);
        });
        body.style.removeProperty('--glow-color');
        body.style.removeProperty('--glow-pink-color');
    }
};

/* ===========================
   Rainbow Engine: terminal easter egg — continuous hue cycling for the session
   =========================== */
const RainbowEngine = {
    intervalId: null,
    offset: 0,

    start() {
        if (this.intervalId) return;
        HueShiftEngine.paused = true; // stop scroll-driven rotation from fighting this
        this.intervalId = setInterval(() => {
            this.offset = (this.offset + 2) % 360;
            HueShiftEngine.applyOffset(this.offset);
        }, 50);
    },

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        // Resume scroll-driven rotation only if the visitor never manually picked a color
        HueShiftEngine.paused = HueShiftEngine.manualOverride;
    },

    get isRunning() {
        return this.intervalId !== null;
    }
};

/* ===========================
   Terminal Engine: settings/easter-egg overlay, opens over the page (not a new route)
   =========================== */
const TerminalEngine = {
    overlay: null,
    output: null,
    activeInput: null,      // the live <input> for whichever prompt line is currently open
    activePromptLine: null, // the line element that input lives in
    activePromptText: '',   // text shown before that input (e.g. "guest@...:~$", or '' mid-flow)
    history: [],
    historyIndex: -1,
    pendingFlow: null, // null | 'color-confirm' | 'color-pick'

    colorOptions: [
        { name: 'lime',   hex: '#bef264' },
        { name: 'cyan',   hex: '#4dd8e8' },
        { name: 'purple', hex: '#c084fc' },
        { name: 'pink',   hex: '#ff6b9d' },
        { name: 'orange', hex: '#ff9f4a' },
        { name: 'blue',   hex: '#4a9eff' },
    ],

    init() {
        this.overlay = document.getElementById('terminal-overlay');
        this.output = document.getElementById('terminal-output');
        const trigger = document.getElementById('terminal-trigger');
        const closeBtn = document.getElementById('terminal-close');
        if (!this.overlay || !trigger) return;

        trigger.addEventListener('click', () => this.open());
        closeBtn.addEventListener('click', () => this.close());

        // Clicking the backdrop (not the window itself) closes it; clicking
        // anywhere inside the window instead refocuses the live prompt —
        // there's no separate input box to click into anymore.
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            } else if (this.activeInput) {
                this.activeInput.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.overlay.classList.contains('hidden')) this.close();
        });

        // Belt-and-suspenders scroll lock: CSS overflow:hidden + overscroll-behavior
        // handles normal cases, but a single large wheel delta can overshoot the
        // output's own scrollable range and chain onto the page behind despite that.
        // Clamp manually so the page can never move no matter how big the delta is.
        this.overlay.addEventListener('wheel', (e) => {
            if (!this.output.contains(e.target)) {
                e.preventDefault();
                return;
            }
            const { scrollTop, scrollHeight, clientHeight } = this.output;
            const maxScroll = scrollHeight - clientHeight;
            const next = scrollTop + e.deltaY;
            if (next < 0 || next > maxScroll) {
                e.preventDefault();
                this.output.scrollTop = Math.max(0, Math.min(maxScroll, next));
            }
        }, { passive: false });

        this.overlay.addEventListener('touchmove', (e) => {
            if (!this.output.contains(e.target)) e.preventDefault();
        }, { passive: false });
    },

    open() {
        this.overlay.classList.remove('hidden');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('terminal-open');
        document.body.classList.add('terminal-open');
        this.resetSession(); // the live prompt (and its focus) appears once boot finishes typing

        // Final backstop: CSS overflow:hidden + the wheel/touch guards handle the
        // normal cases, but some scroll-chaining paths (large synthetic deltas,
        // browser quirks) can still nudge the page by a few px. Pin the exact
        // scroll position and snap back instantly if it ever moves.
        this._lockedScrollY = window.scrollY;
        this._scrollLockHandler = () => {
            if (window.scrollY !== this._lockedScrollY) {
                window.scrollTo(0, this._lockedScrollY);
            }
        };
        window.addEventListener('scroll', this._scrollLockHandler);
    },

    // Closing must be safe from ANY state — mid-flow, mid-fetch, doesn't matter.
    // Clearing pendingFlow means reopening always starts clean, never inherits
    // a half-finished prompt. Rainbow mode is deliberately NOT touched here —
    // it's a session-wide effect, not tied to the terminal window being open.
    close() {
        this.overlay.classList.add('hidden');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('terminal-open');
        document.body.classList.remove('terminal-open');
        if (this._scrollLockHandler) {
            window.removeEventListener('scroll', this._scrollLockHandler);
            this._scrollLockHandler = null;
        }
        this.removeBootSkipHandler(); // in case the terminal is closed mid-boot-animation
        this.pendingFlow = null;
        this.activeInput = null;
        this.activePromptLine = null;
    },

    // Called each time the window opens — gives a fresh "boot" look, but command
    // history is deliberately left intact so it survives close/reopen for the
    // whole page session (only a hard reload actually clears it).
    resetSession() {
        this.output.innerHTML = '';
        this.pendingFlow = null;
        this.activeInput = null;
        this.activePromptLine = null;
        this.bootSkip = false;
        this.printBoot();
    },

    removeBootSkipHandler() {
        if (this._bootSkipHandler) {
            document.removeEventListener('keydown', this._bootSkipHandler);
            this._bootSkipHandler = null;
        }
    },

    navigateHistory(direction) {
        if (!this.history.length || !this.activeInput) return;
        this.historyIndex = Math.min(Math.max(this.historyIndex + direction, 0), this.history.length);
        this.activeInput.value = this.history[this.historyIndex] || '';
    },

    print(text, className = '') {
        const line = document.createElement('div');
        if (className) line.className = className;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    },

    // Types the boot lines out one at a time with randomized per-character and
    // per-line timing, so it reads like it's actually being typed rather than
    // dumped on screen. Falls back to instant text under reduced-motion.
    printBoot() {
        const lines = [
            { text: 'Initializing session...', className: 'terminal-line-dim' },
            { text: 'Loading profile: Nicolaas Labuschagne...', className: 'terminal-line-dim' },
            { text: "Type 'help' to see available commands.", className: 'terminal-line-dim' },
        ];

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            lines.forEach(l => this.print(l.text, l.className));
            this.showPrompt();
            return;
        }

        // Tab skips straight past the boot animation to a ready prompt — checked
        // on a flag rather than cancelling timers, so it takes effect within one
        // tick no matter where mid-animation it's pressed.
        this.removeBootSkipHandler();
        this._bootSkipHandler = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.bootSkip = true;
            }
        };
        document.addEventListener('keydown', this._bootSkipHandler);

        this.typeBootLine(lines, 0);
    },

    typeBootLine(lines, index) {
        // Skip requested (or all lines already typed) — finish any remaining
        // lines instantly and hand off to the real, live prompt.
        if (this.bootSkip || index >= lines.length) {
            for (let i = index; i < lines.length; i++) {
                this.print(lines[i].text, lines[i].className);
            }
            this.removeBootSkipHandler();
            this.showPrompt();
            return;
        }

        const { text, className } = lines[index];
        const el = document.createElement('div');
        el.className = `${className} type-target is-typing`;
        this.output.appendChild(el);

        let charIndex = 0;

        const typeChar = () => {
            if (this.bootSkip) {
                el.textContent = text;
                el.classList.remove('is-typing');
                this.typeBootLine(lines, index + 1);
                return;
            }

            charIndex++;
            el.textContent = text.slice(0, charIndex);
            this.output.scrollTop = this.output.scrollHeight;

            if (charIndex < text.length) {
                setTimeout(typeChar, 18 + Math.random() * 45); // jittery, human-ish pace
            } else {
                el.classList.remove('is-typing');
                setTimeout(() => this.typeBootLine(lines, index + 1), 250 + Math.random() * 220);
            }
        };
        typeChar();
    },

    // Appends a live, editable prompt line to the scrollback itself — this IS the
    // input, not a separate control below it. promptText === '' for interactive
    // sub-prompts (e.g. the y/n in `sudo color`) that don't show the shell prompt.
    showPrompt(promptText = 'guest@nicolaas-portfolio:~$') {
        const line = document.createElement('div');
        line.className = 'terminal-prompt-line';

        if (promptText) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'terminal-prompt';
            promptSpan.textContent = promptText;
            line.appendChild(promptSpan);
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'terminal-input-inline';
        input.autocomplete = 'off';
        input.autocapitalize = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-label', 'Terminal command input');
        line.appendChild(input);

        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;

        this.activeInput = input;
        this.activePromptLine = line;
        this.activePromptText = promptText;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const raw = input.value;
                this.commitPromptLine(raw);
                this.handleInput(raw);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        input.focus();
    },

    // Freezes the just-submitted prompt line into plain scrollback text and
    // drops its live input — exactly how a real terminal folds a finished
    // line into history before the next prompt appears.
    commitPromptLine(raw) {
        this.activePromptLine.textContent = this.activePromptText ? `${this.activePromptText} ${raw}` : raw;
        this.activePromptLine.classList.add('terminal-line-echo');
        this.activeInput = null;
    },

    handleInput(raw) {
        const value = raw.trim();
        if (value) {
            this.history.push(value);
            this.historyIndex = this.history.length;
        }

        const result = this.pendingFlow
            ? this.handlePendingFlow(value)
            : this.runCommand(value);

        // Commands that fetch or animate (fetch/commits/coffee/matrix) return a
        // promise — wait for it so their output finishes printing before the next
        // prompt appears, instead of the prompt showing up first and the result
        // landing wherever it happens to resolve. Promise.resolve() also just
        // passes synchronous commands straight through on the next microtask.
        Promise.resolve(result).then(() => {
            // `exit` / `sudo hire-me` close the terminal mid-command — don't
            // resurrect a prompt on a window that's now hidden. Otherwise, show
            // the bare "$" prompt while mid interactive flow (e.g. sudo color's
            // y/n), or the full shell prompt once back to normal.
            if (!this.overlay.classList.contains('hidden')) {
                this.showPrompt(this.pendingFlow ? '' : 'guest@nicolaas-portfolio:~$');
            }
        });
    },

    handlePendingFlow(value) {
        const answer = value.toLowerCase();

        if (this.pendingFlow === 'color-confirm') {
            if (answer === 'y' || answer === 'yes') {
                this.pendingFlow = 'color-pick';
                this.print('Pick a color:');
                this.colorOptions.forEach((c, i) => this.print(`  ${i + 1}. ${c.name}`));
                this.print("Type a number or name (or 'cancel'):");
            } else {
                this.pendingFlow = null;
                this.print('Cancelled.', 'terminal-line-dim');
            }
            return;
        }

        if (this.pendingFlow === 'color-pick') {
            if (answer === 'cancel') {
                this.pendingFlow = null;
                this.print('Cancelled.', 'terminal-line-dim');
                return;
            }
            const choice = this.colorOptions[parseInt(answer, 10) - 1] || this.colorOptions.find(c => c.name === answer);
            if (!choice) {
                this.print(`Not a valid option: ${value}`, 'terminal-line-error');
                return; // stays in color-pick until a valid choice or 'cancel'
            }
            this.applyColor(choice);
            this.pendingFlow = null;
            this.print(`Accent color set to ${choice.name}.`, 'terminal-line-dim');
        }
    },

    applyColor({ hex }) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const body = document.body;
        body.style.setProperty('--primary-color', hex);
        body.style.setProperty('--primary-color-rgb', `${r}, ${g}, ${b}`);
        body.style.setProperty('--on-primary-color', ContrastEngine.getReadableTextColor(r, g, b, '#0a0a0a', '#ffffff'));
        body.style.setProperty('--glow-color', `rgba(${r}, ${g}, ${b}, 0.6)`);
        // A deliberate pick should stick — scroll-driven rotation backs off for the rest of the session.
        HueShiftEngine.manualOverride = true;
        HueShiftEngine.paused = true;
    },

    runCommand(value) {
        if (!value) return;
        const [cmd, ...args] = value.toLowerCase().split(/\s+/);

        if (cmd === 'sudo' && args[0] === 'color') {
            this.pendingFlow = 'color-confirm';
            this.print("Would you like to change the site's accent color? (y/n)");
            return;
        }

        if (cmd === 'sudo' && args[0] === 'hire-me') {
            this.print('Permission granted. Redirecting to contact...', 'terminal-line-dim');
            this.close();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const normalized = value.toLowerCase().replace(/-/g, ' ').trim();
        if (normalized === 'sudo make me a sandwich') {
            this.print('Okay.', 'terminal-line-dim');
            return;
        }
        if (normalized === 'make me a sandwich') {
            this.print('What? Make it yourself.', 'terminal-line-error');
            return;
        }

        if (cmd === 'sudo') {
            // Any other sudo subcommand that wasn't matched above
            this.print('guest is not in the sudoers file. This incident will be reported.', 'terminal-line-error');
            return;
        }

        if (cmd === 'theme') {
            if (args[0] === 'dark' || args[0] === 'light') {
                PortfolioEngine.applyTheme(args[0]);
                localStorage.setItem('theme', args[0]);
                this.print(`Theme set to ${args[0]}.`, 'terminal-line-dim');
            } else {
                this.print('Usage: theme dark | theme light', 'terminal-line-error');
            }
            return;
        }

        if (cmd === 'rainbowmode' || cmd === 'rainbowmodeon' || cmd === 'rainbowmodeoff') {
            const arg = cmd === 'rainbowmodeon' ? 'on' : cmd === 'rainbowmodeoff' ? 'off' : args[0];
            if (arg === 'on') {
                RainbowEngine.start();
                this.print('Rainbow mode: ON. Enjoy the ride.', 'terminal-line-dim');
            } else if (arg === 'off') {
                RainbowEngine.stop();
                this.print('Rainbow mode: OFF.', 'terminal-line-dim');
            } else {
                this.print('Usage: rainbowmode on | rainbowmode off', 'terminal-line-error');
            }
            return;
        }

        const commands = {
            help: () => {
                this.print('Available commands:');
                [
                    ['help', 'show this list'],
                    ['whoami', 'quick identity check'],
                    ['fetch', 'live GitHub stats'],
                    ['commits', 'my latest public commits, live'],
                    ['resume', 'open my CV'],
                    ['contact', 'open my email'],
                    ['coffee', 'buy me a coffee'],
                    ['joke', 'tell me a joke'],
                    ['matrix', '...'],
                    ['theme dark/light', 'switch the site theme'],
                    ['sudo color', 'change the site accent color'],
                    ['rainbowmode on/off', "... you'll see"],
                    ['reset', 'undo sudo color / rainbow mode, back to defaults'],
                    ['history', 'past commands this session'],
                    ['clear', 'clear the screen'],
                    ['exit', 'close this terminal'],
                ].forEach(([c, d]) => this.print(`  ${c.padEnd(20)} ${d}`));
            },
            whoami: () => this.print('Nicolaas Labuschagne — systems architect, full-stack engineer, amateur cyclist.'),
            resume: () => {
                this.print('Opening resume...', 'terminal-line-dim');
                window.open('./CV/Nicolaas_Labuschagne_Resume.pdf', '_blank');
            },
            contact: () => {
                this.print('Opening email client...', 'terminal-line-dim');
                window.location.href = 'mailto:NJ.Labuschagne@outlook.com';
            },
            coffee: () => {
                const link = document.querySelector('a[href*="paypal.com"]');
                if (!link) {
                    this.print('Coffee link not found.', 'terminal-line-error');
                    return;
                }
                return this.runCoffee(link.href);
            },
            joke: () => {
                const jokes = [
                    'Why do programmers prefer dark mode? Because light attracts bugs.',
                    "There are only 10 types of people: those who understand binary and those who don't.",
                    'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
                    "Why do Java developers wear glasses? Because they don't C#.",
                    'I would tell you a UDP joke, but you might not get it.',
                    '99 little bugs in the code, 99 little bugs. Take one down, patch it around — 127 little bugs in the code.',
                ];
                this.print(jokes[Math.floor(Math.random() * jokes.length)]);
            },
            matrix: () => {
                this.print('Wake up, Neo...', 'terminal-line-dim');
                return this.runMatrixEffect();
            },
            history: () => {
                if (!this.history.length) {
                    this.print('No commands yet this session.', 'terminal-line-dim');
                    return;
                }
                this.history.forEach((c, i) => this.print(`  ${i + 1}  ${c}`));
            },
            clear: () => { this.output.innerHTML = ''; },
            exit: () => this.close(),
            fetch: () => this.runFetch(),
            neofetch: () => this.runFetch(),
            commits: () => this.runCommits(),
            reset: () => {
                RainbowEngine.stop();
                HueShiftEngine.reset();
                HueShiftEngine.manualOverride = false;
                HueShiftEngine.paused = false;
                this.print('Site appearance reset to default.', 'terminal-line-dim');
            },
        };

        if (commands[cmd]) {
            return commands[cmd]();
        }
        this.print(`command not found: ${cmd}. Type 'help' for available commands.`, 'terminal-line-error');
    },

    // Returns a promise so handleInput can hold off on the next prompt until
    // this has actually finished — otherwise the prompt reappears immediately
    // and the fetched result lands wherever it happens to resolve, out of order.
    runFetch() {
        this.print('Fetching live stats...', 'terminal-line-dim');
        return GitHubCache.fetch('https://api.github.com/users/NicolaasLabuschagne')
            .then(user => {
                this.print('--------------------------------');
                this.print(`user:         ${user.login}`);
                this.print(`public repos: ${user.public_repos}`);
                this.print(`followers:    ${user.followers}`);
                this.print(`joined:       ${new Date(user.created_at).getFullYear()}`);
                this.print('--------------------------------');
            })
            .catch(() => this.print('Could not reach GitHub API.', 'terminal-line-error'));
    },

    // Types the message out, then cycles a trailing "." / ".." / "..." loading
    // indicator through 3 full passes on that same line, THEN opens the link.
    // Total time from the triggering keypress to window.open() is kept under
    // ~3.5s on purpose, with margin to spare: browsers grant a few seconds of "transient activation"
    // after a real keypress during which window.open() still works even from
    // inside a setTimeout chain (Chrome's window is ~5s) — go over that and
    // the popup silently gets blocked. Returns a promise so the next prompt
    // waits for the whole sequence.
    runCoffee(url) {
        const baseText = 'Every commit runs on caffeine. Opening the tip jar';

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.print(`${baseText}...`, 'terminal-line-dim');
            window.open(url, '_blank');
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const el = document.createElement('div');
            el.className = 'terminal-line-dim type-target is-typing';
            this.output.appendChild(el);

            let charIndex = 0;
            const typeChar = () => {
                charIndex++;
                el.textContent = baseText.slice(0, charIndex);
                this.output.scrollTop = this.output.scrollHeight;
                if (charIndex < baseText.length) {
                    setTimeout(typeChar, 12 + Math.random() * 24); // faster than the default typing pace — see note above
                } else {
                    el.classList.remove('is-typing');
                    this.animateCoffeeDots(el, baseText, url, 0, resolve);
                }
            };
            typeChar();
        });
    },

    animateCoffeeDots(el, baseText, url, tick, resolve) {
        const dotStates = ['.', '..', '...'];
        const totalTicks = dotStates.length * 3; // 3 full cycles through . / .. / ...
        if (tick >= totalTicks) {
            el.textContent = `${baseText}...`;
            window.open(url, '_blank');
            resolve();
            return;
        }
        el.textContent = baseText + dotStates[tick % dotStates.length];
        this.output.scrollTop = this.output.scrollHeight;
        setTimeout(() => this.animateCoffeeDots(el, baseText, url, tick + 1, resolve), 130);
    },

    runCommits() {
        this.print('Fetching recent commits...', 'terminal-line-dim');
        return GitHubCache.fetch('https://api.github.com/users/NicolaasLabuschagne/events/public')
            .then(events => {
                const commits = [];
                events.forEach(e => {
                    if (e.type === 'PushEvent' && Array.isArray(e.payload?.commits)) {
                        e.payload.commits.forEach(c => {
                            commits.push({
                                repo: e.repo.name.split('/')[1],
                                message: c.message.split('\n')[0],
                                date: e.created_at,
                            });
                        });
                    }
                });

                if (!commits.length) {
                    this.print('No recent public commits found.', 'terminal-line-dim');
                    return;
                }

                this.print('--------------------------------');
                commits.slice(0, 5).forEach(c => {
                    const date = new Date(c.date).toISOString().slice(0, 10);
                    this.print(`${date}  [${c.repo}]  ${c.message}`);
                });
                this.print('--------------------------------');
            })
            .catch(() => this.print('Could not reach GitHub API.', 'terminal-line-error'));
    },

    // Self-contained canvas overlay — sits just below the terminal window so the
    // prompt stays fully readable, and cleans itself up on a timer regardless of
    // whether the terminal itself gets closed early. Returns a promise so the
    // next prompt waits until the effect has actually finished playing.
    runMatrixEffect(duration = 8000) {
        // Hide the terminal chrome (and clear the overlay's dark backdrop) for the
        // full duration — the rain should be the only thing on screen, not dimmed
        // behind the terminal's own blur, and reappear once the effect ends.
        this.overlay.classList.add('matrix-active');

        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;transition:opacity 0.8s ease;';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');

            const chars = 'アイウエオカキクケコサシスセソ01';
            const fontSize = 16;
            const columns = Math.floor(canvas.width / fontSize);
            const drops = new Array(columns).fill(1);

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#bef264';
                ctx.font = `${fontSize}px monospace`;
                drops.forEach((y, i) => {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(char, i * fontSize, y * fontSize);
                    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                });
            };

            const intervalId = setInterval(draw, 40);
            setTimeout(() => {
                clearInterval(intervalId);
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.remove();
                    this.overlay.classList.remove('matrix-active');
                    resolve();
                }, 800);
            }, duration);
        });
    }
};

/* ===========================
   Performance-Optimized Portfolio Engine
   =========================== */
document.documentElement.classList.add('js-enabled');

const PortfolioEngine = {
    init() {
        this.initObservers();
        this.initThemeSystem();
        this.initScrollInteractions();
        this.initScrollSpy();
        this.initGitHubProjects();
        this.initSkillAnimations();
        this.initHeroTilt();
        this.initTypewriter();
        TerminalEngine.init();
        AnalyticsEngine.init();
    },

    initScrollSpy() {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".nav-link");

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => link.classList.remove("active"));
                        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                        if (activeLink) activeLink.classList.add("active");
                    }
                });
            },
            { threshold: 0.2 } // section is active when 20% visible
        );

        sections.forEach(section => observer.observe(section));
    },

    initObservers() {
        this.revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.classList.contains('scribble-underline') ||
                        entry.target.classList.contains('hand-drawn-circle')) {
                        entry.target.classList.add('animate-scribble');
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        // Highlights/circles inside a typed paragraph are revealed by the typewriter
        // itself once that paragraph finishes typing, not by this generic observer.
        const candidates = document.querySelectorAll('.animate-reveal, .highlight, .scribble-underline, .hand-drawn-circle');
        this.observeReveal(Array.from(candidates).filter(el => !el.closest('.type-target')));
    },

    // Staggers siblings sharing a parent so grid rows cascade in instead of
    // popping in together — the observer alone fires all of them at once.
    observeReveal(elements) {
        const siblingIndex = new Map();
        elements.forEach(el => {
            const parent = el.parentElement;
            const i = siblingIndex.get(parent) || 0;
            siblingIndex.set(parent, i + 1);
            el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
            this.revealObserver.observe(el);
        });
    },

    initThemeSystem() {
        const themeToggle = document.getElementById('theme-toggle');
        const updateThemeIcon = () => {
            // The button itself carries .material-symbols-outlined — it has no child
            // to query for, so the icon glyph is the button's own text content.
            const isDark = document.documentElement.classList.contains('dark');
            themeToggle.textContent = isDark ? 'dark_mode' : 'light_mode';
        };

        const applyTheme = (mode) => {
            if (mode === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
            updateThemeIcon();
            ContrastEngine.update();
            if (mode === 'dark') {
                window.dispatchEvent(new Event('scroll')); // re-apply the hue shift for the current scroll position
            } else {
                HueShiftEngine.reset(); // drop inline overrides so light mode's own CSS colors show again
            }
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: mode }));
        };
        this.applyTheme = applyTheme; // exposed so the terminal's `theme` command can drive it directly

        const savedMode = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if (savedMode) {
            applyTheme(savedMode);
        } else {
            applyTheme('light');
        }

        themeToggle.addEventListener('click', () => {
            const isDark = !document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        systemPrefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

    },

    initScrollInteractions() {
        const progressBar = document.getElementById('scroll-progress-bar');
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            // Progress Bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;

            // Sticky Header refinement
            if (header) {
                header.style.transform = window.scrollY > 50 ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%) translateY(0)';
            }

            HueShiftEngine.apply(progress);
        }, { passive: true });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    },

    initGitHubProjects() {
        const grid = document.getElementById('github-projects-grid');
        if (!grid) return;

        // Edit this list to control exactly which repos appear, and in what order.
        // Fetched by exact name (not by recent activity), so order here is final.
        const featuredRepos = [ 'Nicolaas_Labuschagne', 'Tailor.ai', 'JAT', 'TicketingSystem'];

        Promise.all(
            featuredRepos.map(name =>
                GitHubCache.fetch(`https://api.github.com/repos/NicolaasLabuschagne/${name}`)
                    .catch(() => null)
            )
        )
            .then(repos => {
                const filteredRepos = repos.filter(Boolean);

                if (filteredRepos.length === 0) {
                    grid.innerHTML = '<div class="col-span-full text-center p-20 font-mono text-on-surface-variant">No original repositories found.</div>';
                    return;
                }

                grid.innerHTML = filteredRepos.map(repo => `
                    <div class="group relative bg-surface-container border-4 border-on-surface p-6 rounded-xl hard-shadow hover:-translate-y-2 transition-all flex flex-col animate-reveal">
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-primary-container text-on-primary-fixed px-3 py-1 font-mono text-[10px] font-bold rounded border border-on-surface uppercase tracking-tighter">
                                ${repo.language || 'Code'}
                            </span>
                            <div class="flex gap-4 font-mono text-[10px] font-bold opacity-60">
                                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">star</span> ${repo.stargazers_count}</span>
                                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">fork_left</span> ${repo.forks_count}</span>
                            </div>
                        </div>
                        <h3 class="font-mono text-xl font-black text-on-surface mb-4 break-all lowercase">~/projects/${repo.name}</h3>
                        <p class="font-body text-sm text-on-surface-variant mb-8 line-clamp-3">
                            ${repo.description || 'No description provided for this repository.'}
                        </p>
                        <div class="mt-auto">
                            <a href="${repo.html_url}" target="_blank" class="font-headline font-bold text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors flex items-center gap-2">
                                VIEW ON GITHUB <span class="material-symbols-outlined text-sm">arrow_outward</span>
                            </a>
                        </div>
                    </div>
                `).join('');

                this.observeReveal(grid.querySelectorAll('.animate-reveal'));
            })
            .catch(err => {
                console.error('GitHub Fetch Error:', err);
                grid.innerHTML = `
                    <div class="col-span-full text-center p-20 border-4 border-error/20 rounded-3xl">
                        <div class="material-symbols-outlined text-6xl text-error mb-4">error</div>
                        <p class="font-mono text-xl text-error">Failed to synchronize with GitHub API.</p>
                        <button onclick="location.reload()" class="mt-4 font-mono text-xs underline uppercase opacity-60">Retry Connection</button>
                    </div>
                `;
            });
    },

    initSkillAnimations() {
        const skillTags = document.querySelectorAll('.tags span');
        const colors = ['var(--success-color)', 'var(--accent-color)', 'var(--purple-color)', 'var(--primary-color)'];

        if (skillTags.length) {
            setInterval(() => {
                const tag = skillTags[Math.floor(Math.random() * skillTags.length)];
                tag.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                tag.style.transform = 'translate(4px, 4px)';
                setTimeout(() => {
                    tag.style.backgroundColor = '';
                    tag.style.transform = '';
                }, 1000);
            }, 3000);
        }
    },

    // Types each heading's text out, character by character, the moment its
    // section scrolls into view (or immediately on load if already visible).
    // Runs once per element, then leaves the full text in place permanently.
    initTypewriter() {
        const targets = document.querySelectorAll('.type-target');
        if (!targets.length) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Collect the element's actual text-bearing nodes (in document order) so
        // nested markup like <span> accents or <br/> line breaks survive intact —
        // only the text inside each node gets cleared and retyped, not the tags.
        const collectTextNodes = (root) => {
            const nodes = [];
            const walk = (node) => {
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                        nodes.push(child);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        walk(child);
                    }
                });
            };
            walk(root);
            return nodes;
        };

        const typeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                obs.unobserve(el);

                // Screen readers get the real text immediately via aria-label,
                // independent of the visual typing animation.
                el.setAttribute('aria-label', el.textContent.trim());
                if (reduceMotion) return;

                const nodes = collectTextNodes(el);
                const originals = nodes.map(n => n.textContent);
                nodes.forEach(n => { n.textContent = ''; });

                el.classList.add('is-typing');
                const speed = parseInt(el.dataset.typeSpeed, 10) || 20;
                let nodeIndex = 0;
                let charIndex = 0;

                const tick = () => {
                    if (nodeIndex >= nodes.length) {
                        el.classList.remove('is-typing');
                        el.classList.add('is-typed');
                        this.revealAnnotations(el);
                        return;
                    }
                    charIndex++;
                    nodes[nodeIndex].textContent = originals[nodeIndex].slice(0, charIndex);
                    if (charIndex >= originals[nodeIndex].length) {
                        nodeIndex++;
                        charIndex = 0;
                    }
                    setTimeout(tick, speed);
                };
                tick();
            });
        }, { threshold: 0.4 });

        targets.forEach(el => typeObserver.observe(el));
    },

    // Once a paragraph has fully typed itself out, reveal any highlight/circle
    // annotations inside it one at a time — reads as "adding detail" after the
    // fact rather than everything appearing generically at once.
    revealAnnotations(el) {
        const marks = el.querySelectorAll('.highlight, .scribble-underline, .hand-drawn-circle');
        marks.forEach((mark, i) => {
            setTimeout(() => {
                mark.classList.add('active', 'animate-scribble');
            }, 300 + i * 350);
        });
    },

    initHeroTilt() {
        const el = document.getElementById('hero-portrait');
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const maxTilt = 8;
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(800px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    },

};

document.addEventListener('DOMContentLoaded', () => PortfolioEngine.init());
