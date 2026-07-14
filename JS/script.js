
/* ===========================
   P5.js Background Sketch
   =========================== */
const sketch = (p) => {
    let symbols = [];
    const symbolChars = ['✦', '★', '⚹', '⚛', '✧'];
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
        if (document.body.classList.contains('theme-professional')) {
            p.clear();
            return;
        }

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
                } else if (text === 'THE STACK') {
                    this.logEvent('click_the_stack');
                } else if (target.classList.contains('btn-hero-coffee') || target.closest('.btn-hero-coffee')) {
                    this.logEvent('click_paypal_coffee');
                } else if (target.id === 'interactive-pet' || target.closest('#interactive-pet')) {
                    this.logEvent('click_interactive_pet');
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

        document.querySelectorAll('.animate-reveal, .highlight, .scribble-underline, .hand-drawn-circle')
                .forEach(el => this.revealObserver.observe(el));
    },

    initThemeSystem() {
        const themeToggle = document.getElementById('theme-toggle');
        const updateThemeIcon = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const iconSpan = themeToggle.querySelector('.material-symbols-outlined');
            if (iconSpan) iconSpan.textContent = isDark ? 'dark_mode' : 'light_mode';
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
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: mode }));
        };

        const savedMode = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if (savedMode) {
            applyTheme(savedMode);
        } else {
            applyTheme('dark');
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

        fetch('https://api.github.com/users/NicolaasLabuschagne/repos?sort=updated&per_page=20')
            .then(res => res.json())
            .then(repos => {
                if (!Array.isArray(repos)) throw new Error('Invalid API response');

                const filteredRepos = repos
                    .filter(repo => !repo.fork)
                    .slice(0, 3);

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
                        <h3 class="font-mono text-xl font-black text-primary-container mb-4 break-all lowercase">~/projects/${repo.name}</h3>
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

                grid.querySelectorAll('.animate-reveal').forEach(el => this.revealObserver.observe(el));
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

};

/* ===========================
   Vibe Engine: UI Personality Transitions
   =========================== */
const VibeEngine = {
    themes: ['theme-fun', 'theme-creative', 'theme-professional'],
    currentIndex: 0,

    init() {
        this.applyTheme();
    },

    applyTheme() {
        this.themes.forEach(t => document.body.classList.remove(t));
        const current = this.themes[this.currentIndex];
        document.body.classList.add(current);
        localStorage.setItem('pet-theme', current);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: current }));
    }
};

document.addEventListener('DOMContentLoaded', () => PortfolioEngine.init());
