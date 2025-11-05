// demo button handlers (unique IDs)
    /*document.getElementById('request-demo-main')?.addEventListener('click', function(){
      alert('Thanks — demo request received. I will follow up with availability.');
    });
    document.getElementById('request-demo-side')?.addEventListener('click', function(){
      alert('Thanks — demo request received. I will follow up with availability.');
    });*/

    document.addEventListener('DOMContentLoaded', function () {
  // lazy load images with data-src / data-srcset
  const lazyImgs = Array.from(document.querySelectorAll('img.lazy'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        loadImg(img);
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImgs.forEach(img => io.observe(img));
  } else {
    // fallback for older browsers
    lazyImgs.forEach(loadImg);
  }

  function loadImg(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    if (src) img.src = src;
    if (srcset) img.srcset = srcset;
    // optional: set decoding to async for smoother paint
    img.decoding = 'async';
    img.addEventListener('load', () => {
      // tiny timeout helps avoid flicker on some devices
      requestAnimationFrame(() => img.classList.add('loaded'));
    }, { once: true });

    // if the image is already cached, still mark loaded
    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add('loaded');
    }
  }

  // keyboard support for figures
  document.querySelectorAll('figure.shot[tabindex]').forEach(fig => {
    fig.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = fig.querySelector('img');
        if (img && img.dataset.src) window.open(img.dataset.src, '_blank');
      }
    });
  });
});