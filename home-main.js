/* ============================================
   IMWIRE — Main JavaScript
   Enhanced with animations & performance
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNav();
  initHeroAnimation();
  initRevealAnimations();
  initMarquee();
  initEstimationWizard();
  initContactForm();
  initCounterAnimations();
  initParallax();
  initCardTilt();
  initLazyImages();
  initPageTransitions();
  if (document.querySelector('.properties-listing')) initPropertyFilters();
  if (document.querySelector('[data-images]')) initPropertyLightbox();
  if (document.querySelector('.property-slider')) initPropertySlider();
  if (document.querySelector('.blog-listing')) initBlogFilters();
});

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Navigation ---------- */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- Hero Text Animation ---------- */
function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const h1 = hero.querySelector('h1');
  if (h1) {
    const html = h1.innerHTML;
    // Wrap each word in a span, preserving HTML tags like <em>
    const temp = document.createElement('div');
    temp.innerHTML = html;
    wrapWords(temp);
    h1.innerHTML = temp.innerHTML;

    // Stagger the word animations
    const words = h1.querySelectorAll('.word');
    words.forEach((word, i) => {
      word.style.transitionDelay = (0.4 + i * 0.12) + 's';
    });
  }

  // Trigger animations after a small delay
  requestAnimationFrame(() => {
    setTimeout(() => hero.classList.add('animated'), 100);
  });
}

function wrapWords(el) {
  Array.from(el.childNodes).forEach(node => {
    if (node.nodeType === 3) { // text node
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
        } else if (w) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = w;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1) { // element node
      // For <em> and similar, wrap the element itself as a word
      if (['EM', 'STRONG', 'B', 'I', 'SPAN'].includes(node.tagName) && !node.classList.contains('word')) {
        const wrapper = document.createElement('span');
        wrapper.className = 'word';
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);
      } else {
        wrapWords(node);
      }
    }
  });
}

/* ---------- Reveal Animations (enhanced) ---------- */
function initRevealAnimations() {
  const selectors = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate';
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll(selectors).forEach(el => observer.observe(el));
}

/* ---------- Marquee ---------- */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ---------- Estimation Wizard ---------- */
function initEstimationWizard() {
  const wizard = document.querySelector('.estimation');
  if (!wizard) return;

  let currentStep = 1;
  const totalSteps = 4;

  wizard.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.closest('.radio-cards');
      group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input').checked = true;
    });
  });

  wizard.querySelectorAll('.counter').forEach(counter => {
    const val = counter.querySelector('.counter-val');
    const min = parseInt(counter.dataset.min || '0');
    const max = parseInt(counter.dataset.max || '99');
    counter.querySelector('.counter-minus').addEventListener('click', () => {
      val.textContent = Math.max(min, parseInt(val.textContent) - 1);
    });
    counter.querySelector('.counter-plus').addEventListener('click', () => {
      val.textContent = Math.min(max, parseInt(val.textContent) + 1);
    });
  });

  wizard.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  wizard.querySelectorAll('[data-step-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 1) {
        const selected = wizard.querySelector('.radio-card.selected');
        if (!selected) {
          wizard.querySelector('.radio-cards').style.outline = '1px solid #e05050';
          setTimeout(() => wizard.querySelector('.radio-cards').style.outline = '', 2000);
          return;
        }
        const type = selected.querySelector('input').value;
        wizard.querySelectorAll('[data-show-for]').forEach(el => {
          const showFor = el.dataset.showFor.split(',');
          el.style.display = showFor.includes(type) ? '' : 'none';
        });
      }
      if (currentStep < totalSteps) goToStep(currentStep + 1);
    });
  });

  wizard.querySelectorAll('[data-step-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });
  });

  wizard.querySelectorAll('[data-step-submit]').forEach(btn => {
    btn.addEventListener('click', () => {
      wizard.querySelectorAll('.estimation-step').forEach(s => s.classList.remove('active'));
      wizard.querySelector('.estimation-success').style.display = 'block';
      wizard.querySelector('.estimation-progress').style.display = 'none';
    });
  });

  function goToStep(step) {
    currentStep = step;
    wizard.querySelectorAll('.estimation-step').forEach(s => s.classList.remove('active'));
    wizard.querySelector(`[data-step="${step}"]`).classList.add('active');
    wizard.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === step) dot.classList.add('active');
      else if (i + 1 < step) dot.classList.add('done');
    });
  }
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = btn.dataset.sending || 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = btn.dataset.sent || '\u2713 Sent';
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
        form.reset();
      }, 2500);
    }, 1500);
  });
}

/* ---------- Counter Animations (enhanced with glow) ---------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();
    el.classList.add('counting');

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quartic (smoother)
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => el.classList.remove('counting'), 600);
      }
    }
    requestAnimationFrame(update);
  }
}

/* ---------- Parallax (optimized with rAF) ---------- */
function initParallax() {
  const parallaxEls = document.querySelectorAll('.parallax-bg');
  if (!parallaxEls.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const rect = el.parentElement.getBoundingClientRect();
          const offset = (rect.top + scrollY - window.innerHeight / 2) * 0.15;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Card Tilt Effect ---------- */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  const cards = document.querySelectorAll('.service-card, .value-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Lazy Image Loading ---------- */
function initLazyImages() {
  // Handle native lazy loading with fade-in
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    }
  });
}

/* ---------- Page Transitions ---------- */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  overlay.classList.add('leaving');
  setTimeout(() => overlay.classList.remove('leaving'), 600);

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
    if (href.includes('.html') || href === '/' || href.endsWith('/')) {
      a.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('entering');
        setTimeout(() => { window.location.href = href; }, 500);
      });
    }
  });
}

/* ---------- Property Filters (Properties Page) ---------- */
function initPropertyFilters() {
  const container = document.querySelector('.properties-listing');
  const countEl = document.querySelector('.properties-count span');
  const cards = Array.from(container.querySelectorAll('.property-card'));

  const filterType = document.getElementById('filter-type');
  const filterRooms = document.getElementById('filter-rooms');
  const filterPrice = document.getElementById('filter-price');
  const filterSearch = document.getElementById('filter-search');

  [filterType, filterRooms, filterPrice, filterSearch].forEach(el => {
    if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', applyFilters);
  });

  function applyFilters() {
    const type = filterType?.value || '';
    const rooms = filterRooms?.value || '';
    const price = filterPrice?.value || '';
    const search = filterSearch?.value.toLowerCase() || '';

    let visibleCount = 0;
    cards.forEach(card => {
      const d = card.dataset;
      let show = true;

      if (type && d.type !== type) show = false;
      if (rooms) {
        const r = parseInt(d.rooms);
        if (rooms === '5+' && r < 5) show = false;
        else if (rooms !== '5+' && r !== parseInt(rooms)) show = false;
      }
      if (price) {
        const p = parseInt(d.price);
        const [min, max] = price.split('-').map(Number);
        if (max && (p < min || p > max)) show = false;
        if (!max && p < min) show = false;
      }
      if (search) {
        const text = (d.title + ' ' + d.location).toLowerCase();
        if (!text.includes(search)) show = false;
      }

      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    if (countEl) countEl.textContent = visibleCount;

    let noRes = container.querySelector('.no-results');
    if (visibleCount === 0) {
      if (!noRes) {
        noRes = document.createElement('div');
        noRes.className = 'no-results';
        noRes.textContent = container.dataset.noResults || 'No properties match your criteria.';
        container.appendChild(noRes);
      }
    } else if (noRes) {
      noRes.remove();
    }
  }
}

/* ---------- Property Slider (Homepage) ---------- */
function initPropertySlider() {
  document.querySelectorAll('.property-slider').forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slider-slide'));
    const prevBtn = slider.querySelector('.slider-nav.prev');
    const nextBtn = slider.querySelector('.slider-nav.next');
    const dotsWrap = slider.querySelector('.slider-dots');
    if (!track || slides.length === 0) return;

    let index = 0;
    let autoplay = parseInt(slider.dataset.autoplay || '0', 10);
    let timer = null;

    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.addEventListener('click', () => { goTo(i); reset(); });
      dotsWrap.appendChild(btn);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach((d, j) => d.classList.toggle('active', j === index));
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function reset() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(next, autoplay);
    }

    prevBtn?.addEventListener('click', () => { prev(); reset(); });
    nextBtn?.addEventListener('click', () => { next(); reset(); });

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', reset);

    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); reset(); }
    });

    goTo(0);
    reset();
  });
}

/* ---------- Property Lightbox ---------- */
function initPropertyLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-header">
      <div>
        <div class="lightbox-title"></div>
        <div class="lightbox-counter"></div>
      </div>
      <button class="lightbox-close" aria-label="Close">&times;</button>
    </div>
    <div class="lightbox-stage">
      <button class="lightbox-nav prev" aria-label="Previous">&#8249;</button>
      <div class="lightbox-img-wrap"><img class="lightbox-img" alt=""></div>
      <button class="lightbox-nav next" aria-label="Next">&#8250;</button>
    </div>
    <div class="lightbox-thumbs"></div>
  `;
  document.body.appendChild(lb);

  const imgEl = lb.querySelector('.lightbox-img');
  const wrapEl = lb.querySelector('.lightbox-img-wrap');
  const titleEl = lb.querySelector('.lightbox-title');
  const counterEl = lb.querySelector('.lightbox-counter');
  const thumbsEl = lb.querySelector('.lightbox-thumbs');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev = lb.querySelector('.lightbox-nav.prev');
  const btnNext = lb.querySelector('.lightbox-nav.next');

  let images = [];
  let index = 0;

  function render() {
    if (!images.length) return;
    imgEl.src = images[index];
    counterEl.textContent = (index + 1) + ' / ' + images.length;
    lb.classList.remove('zoomed');
    thumbsEl.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  function open(imgs, title, startIndex = 0) {
    images = imgs;
    index = startIndex;
    titleEl.textContent = title || '';
    thumbsEl.innerHTML = '';
    images.forEach((src, i) => {
      const t = document.createElement('div');
      t.className = 'lightbox-thumb';
      t.innerHTML = `<img src="${src}" alt="">`;
      t.addEventListener('click', () => { index = i; render(); });
      thumbsEl.appendChild(t);
    });
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    lb.classList.remove('zoomed');
    document.body.style.overflow = '';
  }

  function next() { index = (index + 1) % images.length; render(); }
  function prev() { index = (index - 1 + images.length) % images.length; render(); }

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  wrapEl.addEventListener('click', () => lb.classList.toggle('zoomed'));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  document.querySelectorAll('.property-card').forEach(card => {
    if (card.classList.contains('off-market')) return;
    const raw = card.dataset.images;
    if (!raw) return;
    const imgs = raw.split('|').map(s => s.trim()).filter(Boolean);
    if (!imgs.length) return;

    const imgWrap = card.querySelector('.property-card-img');
    if (imgWrap && !imgWrap.querySelector('.img-count')) {
      const badge = document.createElement('span');
      badge.className = 'img-count';
      badge.textContent = imgs.length + (imgs.length > 1 ? ' photos' : ' photo');
      imgWrap.appendChild(badge);
    }

    const title = card.querySelector('h4')?.textContent || '';
    imgWrap?.addEventListener('click', e => {
      if (e.target.closest('.property-badge')) return;
      open(imgs, title, 0);
    });
  });
}

/* ---------- Blog Filters (Blog Page) ---------- */
function initBlogFilters() {
  const btns = document.querySelectorAll('.blog-filter-btn');
  const cards = document.querySelectorAll('.blog-listing .blog-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      cards.forEach(card => {
        if (!cat || cat === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.category === cat ? '' : 'none';
        }
      });
    });
  });
}
