/* ===========================
   SCRIPT.JS - Portfolio Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===========================
  // NAVBAR SCROLL BEHAVIOR
  // ===========================
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('active');
    });
  }

  // Close nav on link click (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ===========================
  // SMOOTH SCROLL
  // ===========================
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

  // ===========================
  // INTERSECTION OBSERVER - FADE IN
  // ===========================
  const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ===========================
  // COUNTER ANIMATION
  // ===========================
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        if (!isNaN(target)) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ===========================
  // CONTACT FORM (AJAX)
  // ===========================
  const form = document.getElementById('contactForm');
  if (form) {
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

  // ===========================
  // PARALLAX (subtle)
  // ===========================
  const heroBgPattern = document.querySelector('.hero-bg-pattern');
  const heroBgDots = document.querySelector('.hero-bg-dots');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBgPattern) heroBgPattern.style.transform = `translateY(${sy * 0.08}px)`;
    if (heroBgDots) heroBgDots.style.transform = `translateY(${sy * 0.12}px)`;
  });

  // ===========================
  // ACTIVE NAV LINK
  // ===========================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  });

});
