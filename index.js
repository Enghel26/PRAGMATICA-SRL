/**
 * Pragmática S.R.L. - Interactive Core Script
 * Modern dynamic interactions, animations, carousel controls and scroll reveals
 */

initCleanUrlMask();

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeader();
  initHeroCarousel();
  initScrollReveal();
  initCounters();
  initScrollToTop();
  initCurrentYear();
  initServiceFilter();
  initClientFilter();
});

/* ==========================================================================
   00. CLEAN URL MASK (HIDE .html & RENAME index -> inicio)
   ========================================================================== */
function initCleanUrlMask() {
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;

  try {
    const { pathname, search, hash } = window.location;
    const originalPath = pathname;
    let cleanPath = pathname;

    if (/\/index\.html$/i.test(pathname)) {
      cleanPath = pathname.replace(/\/index\.html$/i, '/Inicio');
    } else if (/\/soluciones\.html$/i.test(pathname)) {
      cleanPath = pathname.replace(/\/soluciones\.html$/i, '/Servicios');
    } else if (pathname.endsWith('/')) {
      cleanPath = `${pathname}Inicio`;
    } else if (/\.html$/i.test(pathname)) {
      cleanPath = pathname.replace(/\.html$/i, '');
    }

    if (cleanPath !== originalPath) {
      window.history.replaceState({ originalPath }, '', `${cleanPath}${search}${hash}`);

      // Restore original .html path right before keyboard reload (F5 / Ctrl+R) on static dev servers
      window.addEventListener('keydown', (e) => {
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r')) {
          window.history.replaceState(null, '', `${originalPath}${window.location.search}${window.location.hash}`);
        }
      });
    }
  } catch (e) {
    // Ignore history API restrictions if any
  }
}

/* ==========================================================================
   0. THEME TOGGLE (LIGHT / DARK MODE)
   The initial theme is applied by an inline script in each page's <head>
   (to avoid a flash of the wrong theme). This injects the toggle buttons.
   ========================================================================== */
const THEME_STORAGE_KEY = 'pragmatica-user-theme';

function initThemeToggle() {
  const root = document.documentElement;
  const desktopActions = document.querySelector('.header__actions');
  const hamMenu = document.querySelector('.header__ham-menu');

  const getTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  const createButton = (extraClass = '') => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `theme-toggle ${extraClass}`.trim();
    btn.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i><i class="fa fa-sun-o" aria-hidden="true"></i>';
    return btn;
  };

  const buttons = [];

  if (desktopActions) {
    const btn = createButton();
    btn.id = 'theme-toggle-desktop';
    const divider = document.createElement('span');
    divider.className = 'header__actions-divider';
    divider.setAttribute('aria-hidden', 'true');
    desktopActions.prepend(divider);
    desktopActions.prepend(btn);
    buttons.push(btn);
  }

  if (hamMenu && hamMenu.parentElement) {
    const btn = createButton('theme-toggle--mobile');
    btn.id = 'theme-toggle-mobile';
    hamMenu.parentElement.insertBefore(btn, hamMenu);
    buttons.push(btn);
  }

  const syncButtons = () => {
    const isDark = getTheme() === 'dark';
    const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    buttons.forEach((btn) => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.setAttribute('aria-pressed', String(isDark));
    });
  };

  const applyTheme = (theme, persist = true) => {
    root.classList.add('theme-transition');
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) { /* storage unavailable */ }
    }
    syncButtons();
    window.setTimeout(() => root.classList.remove('theme-transition'), 450);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  syncButtons();
}

/* ==========================================================================
   1. HEADER & MOBILE NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.header');
  const hamMenu = document.querySelector('.header__ham-menu');
  const smMenu = document.querySelector('.header__sm-menu');

  // Sticky header on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile menu toggle
  if (hamMenu && smMenu) {
    hamMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = smMenu.classList.toggle('active');
      hamMenu.classList.toggle('active', isActive);
      document.body.classList.toggle('menu-open', isActive);
    });

    // Close on link click
    const smLinks = smMenu.querySelectorAll('a');
    smLinks.forEach((link) => {
      link.addEventListener('click', () => {
        smMenu.classList.remove('active');
        hamMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        smMenu.classList.contains('active') &&
        !smMenu.contains(e.target) &&
        !hamMenu.contains(e.target)
      ) {
        smMenu.classList.remove('active');
        hamMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
}

/* ==========================================================================
   2. HERO CAROUSEL CONTROLLER (CINEMATIC AUTOPLAY & INTERACTIVE CONTROLS)
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero__carousel-slide');
  const textWrapper = document.querySelector('.hero__text-wrapper');
  const dynamicTitle = document.querySelector('.hero__dynamic-title');
  const dynamicDesc = document.querySelector('.hero__dynamic-desc');
  const dynamicBadge = document.querySelector('.hero__dynamic-badge');
  const dots = document.querySelectorAll('.hero__dot');
  const currentCounter = document.querySelector('.hero__counter-current');
  const prevBtn = document.querySelector('.hero__arrow--prev, .hero__ctrl-btn--prev');
  const nextBtn = document.querySelector('.hero__arrow--next, .hero__ctrl-btn--next');
  const heroSection = document.querySelector('.hero');

  if (!slides.length) return;

  let currentSlide = 0;
  const slideDuration = 6000; // 6s por video
  let slideTimer = null;

  function updateSlide(nextIndex) {
    if (nextIndex === currentSlide && slides[currentSlide].classList.contains('active')) return;

    const currentTitle = slides[currentSlide].getAttribute('data-title') || '';
    const nextTitle = slides[nextIndex].getAttribute('data-title') || '';
    const nextDesc = slides[nextIndex].getAttribute('data-desc') || '';
    const nextBadge = slides[nextIndex].getAttribute('data-badge') || 'Soluciones Tecnológicas';

    // Slide Background Transition
    slides[currentSlide].classList.remove('active');
    slides[nextIndex].classList.add('active');

    const prevVideo = slides[currentSlide].querySelector('video');
    if (prevVideo) prevVideo.pause();

    const nextVideo = slides[nextIndex].querySelector('video');
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    // Dynamic Text & Badge Transition
    if (textWrapper && dynamicTitle && dynamicDesc) {
      if (currentTitle !== nextTitle) {
        textWrapper.classList.add('fade-out');
        setTimeout(() => {
          dynamicTitle.innerHTML = nextTitle;
          dynamicDesc.textContent = nextDesc;
          if (dynamicBadge) dynamicBadge.textContent = nextBadge;
          textWrapper.classList.remove('fade-out');
        }, 300);
      }
    }

    // Update Dots & Counter
    const activeServiceIndex = nextIndex;
    if (currentCounter) {
      currentCounter.textContent = `0${activeServiceIndex + 1}`;
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeServiceIndex);
    });

    currentSlide = nextIndex;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    updateSlide(nextIndex);
  }

  function prevSlide() {
    const nextIndex = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide(nextIndex);
  }

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      nextSlide();
    }, slideDuration);
  }

  // Clickable Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10) || 0;
      updateSlide(targetIndex);
      resetTimer();
    });
  });

  // Next & Prev Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      resetTimer();
    });
  }

  // Start initially
  resetTimer();
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   4. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  // Calculate dynamic trajectory years from October 7, 2021
  const foundationYear = 2021;
  const currentYear = new Date().getFullYear();
  const calculatedYears = Math.max(1, currentYear - foundationYear);

  counters.forEach((el) => {
    const parentCard = el.closest('.stat-card') || el.parentElement;
    const label = parentCard?.querySelector('.stat-label')?.textContent || '';
    if (label.toLowerCase().includes('trayectoria') || label.toLowerCase().includes('experiencia')) {
      el.setAttribute('data-target', calculatedYears.toString());
    }
  });

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);

      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach(countUp);
  }
}

/* ==========================================================================
   5. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
  const scrollBtn = document.querySelector('.scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/* ==========================================================================
   6. AUTO YEAR IN FOOTER
   ========================================================================== */
function initCurrentYear() {
  const yearSpans = document.querySelectorAll('#year, .current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = currentYear;
  });
}

/* ==========================================================================
   7. SERVICES CATEGORY FILTER (SOLUCIONES.HTML)
   ========================================================================== */
function initServiceFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-modern');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   8. CLIENTS SECTOR FILTER (SOCIOS.HTML)
   ========================================================================== */
function initClientFilter() {
  const clientFilterBtns = document.querySelectorAll('.client-filter-btn');
  const clientCards = document.querySelectorAll('.client-card-pro');

  if (!clientFilterBtns.length || !clientCards.length) return;

  clientFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      clientFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      clientCards.forEach((card) => {
        const cardSector = card.getAttribute('data-sector');
        if (filterValue === 'all' || cardSector === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}
