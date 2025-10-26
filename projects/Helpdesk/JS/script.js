// demo button handlers (unique IDs)
    /*document.getElementById('request-demo-main')?.addEventListener('click', function(){
      alert('Thanks — demo request received. I will follow up with availability.');
    });
    document.getElementById('request-demo-side')?.addEventListener('click', function(){
      alert('Thanks — demo request received. I will follow up with availability.');
    });*/

    document.addEventListener('DOMContentLoaded', function () {
      const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              // set real sources
              if (img.dataset.src) img.src = img.dataset.src;
              if (img.datasetSrcset || img.dataset.srcset) img.srcset = img.dataset.srcset || img.datasetSrcset;
              img.addEventListener('load', () => img.classList.add('loaded'));
              img.removeAttribute('data-src');
              img.removeAttribute('data-srcset');
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        lazyImages.forEach(img => io.observe(img));
      } else {
        // Fallback: load everything but with a small timeout to avoid blocking paint
        lazyImages.forEach(img => {
          setTimeout(() => {
            if (img.dataset.src) img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.addEventListener('load', () => img.classList.add('loaded'));
          }, 200);
        });
      }
    });