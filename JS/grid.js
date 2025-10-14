// JS/gridlines.js
// Glowing architectural grid for #professional-canvas using Paper.js

(() => {
  if (typeof paper === 'undefined') {
    console.warn('Gridlines: Paper.js not loaded.');
    return;
  }

  const canvas = document.getElementById('professional-canvas');
  if (!canvas) return;

  const scope = new paper.PaperScope();
  scope.setup(canvas);

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    scope.view.viewSize = new scope.Size(canvas.width, canvas.height);
  }

  function drawGrid() {
    scope.project.clear();

    const spacing = 64; // grid spacing in pixels
    const glowColor = new scope.Color({red: 1, green: 1, blue: 1});

    const w = scope.view.size.width;
    const h = scope.view.size.height;

    // vertical lines
    for (let x = 0; x <= w; x += spacing) {
      const line = new scope.Path.Line(new scope.Point(x, 0), new scope.Point(x, h));
      line.strokeColor = glowColor;
      line.strokeWidth = 1.2;
      line.opacity = 0.8;
      line.blendMode = 'screen';
    }

    // horizontal lines
    for (let y = 0; y <= h; y += spacing) {
      const line = new scope.Path.Line(new scope.Point(0, y), new scope.Point(w, y));
      line.strokeColor = glowColor;
      line.strokeWidth = 1.2;
      line.opacity = 0.8;
      line.blendMode = 'screen';
    }

    scope.view.draw();
  }

  function init() {
    resizeCanvas();
    drawGrid();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      init();
    }, 120);
  });

  requestAnimationFrame(() => init());
})();