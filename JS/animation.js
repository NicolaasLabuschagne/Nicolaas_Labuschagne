/**
 * Tentacle animation effect.
 *
 * This script creates a canvas-based animation of tentacles that follow a moving target.
 * The tentacles are composed of segments and have a fluid, organic movement.
 */
(function () {
  'use strict';

  // Polyfill for requestAnimationFrame
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  // --- Canvas Setup ---
  function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found.`);
      return null;
    }
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight / 2;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    return { canvas, ctx, getWidth: () => width, getHeight: () => height };
  }

  // --- Utility Functions ---
  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // --- Segment Class ---
  class Segment {
    constructor(parent, length, angle, isRoot = false) {
      this.isRoot = isRoot;
      this.l = length;
      this.ang = angle;

      if (isRoot) {
        this.pos = { x: parent.x, y: parent.y };
      } else {
        this.pos = { x: parent.nextPos.x, y: parent.nextPos.y };
      }

      this.nextPos = {
        x: this.pos.x + this.l * Math.cos(this.ang),
        y: this.pos.y + this.l * Math.sin(this.ang),
      };
    }

    update(target) {
      this.ang = Math.atan2(target.y - this.pos.y, target.x - this.pos.x);
      this.pos.x = target.x + this.l * Math.cos(this.ang - Math.PI);
      this.pos.y = target.y + this.l * Math.sin(this.ang - Math.PI);
      this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
      this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }

    fallback(target) {
        this.pos.x = target.x;
        this.pos.y = target.y;
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
    }
  }

  // --- Tentacle Class ---
  class Tentacle {
    constructor(x, y, length, segments, rand) {
      this.x = x;
      this.y = y;
      this.l = length;
      this.n = segments;
      this.rand = rand;
      this.segments = [new Segment(this, this.l / this.n, 0, true)];
      for (let i = 1; i < this.n; i++) {
        this.segments.push(new Segment(this.segments[i - 1], this.l / this.n, 0, false));
      }
    }

    move(lastTarget, target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.dt = distance(lastTarget.x || target.x, lastTarget.y || target.y, target.x, target.y) + 5;
        this.t = {
            x: target.x - 0.8 * this.dt * Math.cos(this.angle),
            y: target.y - 0.8 * this.dt * Math.sin(this.angle)
        };

        if (this.t.x) {
            this.segments[this.n - 1].update(this.t);
        } else {
            this.segments[this.n - 1].update(target);
        }

        for (let i = this.n - 2; i >= 0; i--) {
            this.segments[i].update(this.segments[i + 1].pos);
        }

        if (distance(this.x, this.y, target.x, target.y) <= this.l + distance(lastTarget.x || target.x, lastTarget.y || target.y, target.x, target.y)) {
            this.segments[0].fallback({ x: this.x, y: this.y });
            for (let i = 1; i < this.n; i++) {
                this.segments[i].fallback(this.segments[i - 1].nextPos);
            }
        }
    }

    show(target, ctx) {
      if (distance(this.x, this.y, target.x, target.y) <= this.l) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        for (let i = 0; i < this.n; i++) {
            ctx.lineTo(this.segments[i].nextPos.x, this.segments[i].nextPos.y);
        }
        const creative2Color = getComputedStyle(document.documentElement).getPropertyValue('--creative2').trim();
        ctx.strokeStyle = creative2Color;
        ctx.lineWidth = this.rand * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  // --- Main Animation Logic ---
  document.addEventListener('DOMContentLoaded', function () {
    const canvasData = setupCanvas('about-canvas');
    if (!canvasData) return;

    const { canvas, ctx, getWidth, getHeight } = canvasData;
    let tentacles = [];
    let target = { x: 0, y: 0 };
    let lastTarget = {};
    let t = 0;
    let isHovering = false;

    function init() {
      const width = getWidth();
      const height = getHeight();
      const maxL = Math.max(width, height) / 5;
      const minL = Math.min(width, height) / 10;
      const n = 30;
      const numTentacles = Math.max(60, Math.floor(Math.min(width, height) / 10));

      tentacles = [];
      for (let i = 0; i < numTentacles; i++) {
        tentacles.push(
          new Tentacle(
            Math.random() * width,
            Math.random() * height,
            Math.random() * (maxL - minL) + minL,
            n,
            Math.random()
          )
        );
      }
    }

    function animate() {
      const width = getWidth();
      const height = getHeight();

      if (!isHovering) {
        const targetX = width / 2 + (Math.sin(t * 0.6) * width) * 0.3;
        const targetY = height + (Math.sin(t * 0.4) * height) * 0.3;
        target.x += (targetX - target.x) * 0.05;
        target.y += (targetY - target.y) * 0.05;
        t += 0.01;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(target.x, target.y, (distance(lastTarget.x || target.x, lastTarget.y || target.y, target.x, target.y) || 5) + 5, 0, Math.PI * 2);
      const creative2Color = getComputedStyle(document.documentElement).getPropertyValue('--creative2').trim();
      ctx.fillStyle = creative2Color;
      ctx.fill();

      tentacles.forEach(tentacle => {
        tentacle.move(lastTarget, target);
        tentacle.show(target, ctx);
      });

      lastTarget.x = target.x;
      lastTarget.y = target.y;

      requestAnimFrame(animate);
    }

    document.querySelectorAll('a, button, .card, .palette-btn, .cta').forEach(el => {
        el.addEventListener('mouseenter', () => isHovering = true);
        el.addEventListener('mouseleave', () => isHovering = false);
    });

    init();
    animate();
    window.addEventListener('resize', init, { passive: true });
  });
})();
