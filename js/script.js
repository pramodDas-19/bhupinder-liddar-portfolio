/* ===========================
   SCRIPT.JS - Portfolio Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', async function () {
  await loadSharedPartials();
  initNavbar();
  initSmoothScroll();
  initRevealAnimations();
  initCounters();
  initContactForm();
  initParallax();
  setActivePageLinks();
});

async function loadSharedPartials() {
  const partials = [
    { selector: '#site-header', file: 'Component/Header.html' },
    { selector: '#site-footer', file: 'Component/Footer.html' }
  ];

  await Promise.all(partials.map(async ({ selector, file }) => {
    const container = document.querySelector(selector);
    if (!container) {
      return;
    }

    try {
      const response = await fetch(file, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Unable to load ${file}`);
      }
      container.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
    }
  }));

}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (!navLinks || !hamburger) {
        return;
      }

      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

function initRevealAnimations() {
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!fadeEls.length || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}

function initCounters() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target)) {
          animateCounter(el, target);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const successMsg = document.querySelector('.form-success');
    const errorMsg = document.querySelector('.form-error');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...`;
    btn.disabled = true;

    const data = new FormData(form);

    fetch('contact.php', { method: 'POST', body: data })
      .then(res => res.text())
      .then(response => {
        if (response.trim() === 'success') {
          successMsg.style.display = 'block';
          errorMsg.style.display = 'none';
          form.reset();
        } else {
          errorMsg.style.display = 'block';
          successMsg.style.display = 'none';
        }
      })
      .catch(() => {
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
      })
      .finally(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        setTimeout(() => {
          successMsg.style.display = 'none';
          errorMsg.style.display = 'none';
        }, 6000);
      });
  });
}

function initParallax() {
  const heroBgPattern = document.querySelector('.hero-bg-pattern');
  const heroBgDots = document.querySelector('.hero-bg-dots');

  if (!heroBgPattern && !heroBgDots) {
    return;
  }

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBgPattern) {
      heroBgPattern.style.transform = `translateY(${sy * 0.08}px)`;
    }
    if (heroBgDots) {
      heroBgDots.style.transform = `translateY(${sy * 0.12}px)`;
    }
  });
}

function setActivePageLinks() {
  const currentPage = document.body.dataset.page;

  if (!currentPage) {
    return;
  }

  document.querySelectorAll('[data-page-link]').forEach(link => {
    link.classList.remove('active');
  });

  document.querySelectorAll(`[data-page-link="${currentPage}"]`).forEach(link => {
    link.classList.add('active');
  });
}
