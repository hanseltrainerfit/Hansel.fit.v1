/**
 * HANSEL FIT — main.js
 * All interactions, animations, and dynamic features.
 * Fully compatible with file:// opening (no ES modules, no fetch).
 */

(function () {
  'use strict';

  /* ── Config (edit these values) ──────────────────────── */
  var CONFIG = {
    whatsappNumber: 'YOUR_PHONE_NUMBER', // e.g. '573001234567' (no +, no spaces)
    whatsappDefaultMsg: 'Hello Hansel! I am interested in your coaching services.',
    instagramHandle: 'YOUR_INSTAGRAM_HANDLE',
    contactEmail: 'YOUR_EMAIL@domain.com'
  };

  /* ── Utility: whatsapp link ───────────────────────────── */
  function waLink(msg) {
    var m = msg || CONFIG.whatsappDefaultMsg;
    if (CONFIG.whatsappNumber === 'YOUR_PHONE_NUMBER') {
      return '#contact'; // fallback when not configured
    }
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(m);
  }

  /* ── Set WhatsApp links ───────────────────────────────── */
  function initWhatsApp() {
    var floatBtn = document.getElementById('wa-float');
    if (floatBtn) {
      floatBtn.href = waLink();
      if (CONFIG.whatsappNumber === 'YOUR_PHONE_NUMBER') {
        floatBtn.setAttribute('title', 'WhatsApp — configure phone number in js/main.js');
      }
    }
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg') || CONFIG.whatsappDefaultMsg;
      el.href = waLink(msg);
    });
  }

  /* ── Set Instagram links ─────────────────────────────── */
  function initSocial() {
    document.querySelectorAll('[data-ig]').forEach(function (el) {
      if (CONFIG.instagramHandle !== 'YOUR_INSTAGRAM_HANDLE') {
        el.href = 'https://instagram.com/' + CONFIG.instagramHandle;
      }
    });
  }

  /* ── Navbar scroll behavior ───────────────────────────── */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    function updateNav() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Active nav link on scroll ───────────────────────── */
  function initScrollSpy() {
    var links = document.querySelectorAll('.nav-link[data-section]');
    var sections = [];
    links.forEach(function (l) {
      var id = l.getAttribute('data-section');
      var sec = document.getElementById(id);
      if (sec) sections.push({ link: l, section: sec });
    });
    if (!sections.length) return;
    function update() {
      var scrollY = window.scrollY + 120;
      var active = null;
      sections.forEach(function (s) {
        if (s.section.offsetTop <= scrollY) active = s;
      });
      links.forEach(function (l) { l.classList.remove('active'); });
      if (active) active.link.classList.add('active');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('open');
      mobileMenu.classList.add('visible');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mobileMenu.classList.add('open');
        });
      });
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () { mobileMenu.classList.remove('visible'); }, 400);
    }
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mobileLinks.forEach(function (l) { l.addEventListener('click', closeMenu); });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  /* ── Scroll Reveal ────────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── FAQ Accordion ────────────────────────────────────── */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // close all
        items.forEach(function (i) {
          i.classList.remove('open');
          var a = i.querySelector('.faq-answer');
          var b = i.querySelector('.faq-question');
          if (a) a.style.maxHeight = null;
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
      // keyboard
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  /* ── Before / After Comparator ────────────────────────── */
  function initComparators() {
    var wrappers = document.querySelectorAll('.before-after-wrapper');
    wrappers.forEach(function (wrapper) {
      var beforeImg = wrapper.querySelector('.before-img');
      var divider = wrapper.querySelector('.ba-divider');
      var handle = wrapper.querySelector('.ba-handle');
      if (!beforeImg || !divider || !handle) return;

      var dragging = false;
      var pct = 50;

      function setPosition(p) {
        pct = Math.max(2, Math.min(98, p));
        divider.style.left = pct + '%';
        handle.style.left = pct + '%';
        beforeImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      }

      setPosition(50);

      function getPercent(clientX) {
        var rect = wrapper.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      // Mouse
      wrapper.addEventListener('mousedown', function (e) {
        dragging = true;
        setPosition(getPercent(e.clientX));
        e.preventDefault();
      });
      document.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        setPosition(getPercent(e.clientX));
      });
      document.addEventListener('mouseup', function () { dragging = false; });

      // Touch
      wrapper.addEventListener('touchstart', function (e) {
        dragging = true;
        setPosition(getPercent(e.touches[0].clientX));
      }, { passive: true });
      wrapper.addEventListener('touchmove', function (e) {
        if (!dragging) return;
        setPosition(getPercent(e.touches[0].clientX));
      }, { passive: true });
      wrapper.addEventListener('touchend', function () { dragging = false; });

      // Keyboard
      wrapper.setAttribute('tabindex', '0');
      wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') setPosition(pct - 5);
        if (e.key === 'ArrowRight') setPosition(pct + 5);
      });
    });
  }

  /* ── Training filter tabs ─────────────────────────────── */
  function initTrainingFilters() {
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.training-card');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Contact form ─────────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (form.querySelector('[name="name"]') || {}).value || '';
      var email   = (form.querySelector('[name="email"]') || {}).value || '';
      var service = (form.querySelector('[name="service"]') || {}).value || '';
      var goal    = (form.querySelector('[name="goal"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';

      var msg = 'Hello Hansel! My name is ' + name + '.'
        + (service ? ' I am interested in: ' + service + '.' : '')
        + (goal    ? ' My main goal is: ' + goal + '.' : '')
        + (message ? ' Additional info: ' + message : '');

      var link = waLink(msg);
      if (link === '#contact' || link.startsWith('#')) {
        // WhatsApp not configured — fallback to mailto
        window.location.href = 'mailto:' + CONFIG.contactEmail
          + '?subject=Coaching Inquiry – ' + encodeURIComponent(name)
          + '&body=' + encodeURIComponent(msg);
      } else {
        window.open(link, '_blank');
      }

      var success = document.getElementById('form-success');
      if (success) {
        success.style.display = 'block';
        setTimeout(function () { success.style.display = 'none'; }, 6000);
      }
    });
  }

  /* ── Client Login toggle ─────────────────────────────── */
  function initLoginPage() {
    var loginBtn = document.getElementById('btn-login');
    var loginPage = document.getElementById('login-page');
    var backBtn = document.getElementById('btn-back-to-site');
    var mainContent = document.getElementById('main-content');
    if (!loginBtn || !loginPage) return;
    loginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      loginPage.classList.add('visible');
      if (mainContent) mainContent.style.display = 'none';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    });
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        loginPage.classList.remove('visible');
        if (mainContent) mainContent.style.display = '';
      });
    }
  }

  /* ── Smooth scroll for anchor links ──────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = a.getAttribute('href');
        if (!hash || hash === '#' || hash === '#contact' && !document.querySelector(hash)) return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Parallax (very subtle, respects reduced-motion) ──── */
  function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translateY(' + scrollY * speed + 'px)';
      });
    }, { passive: true });
  }

  /* ── Init ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initWhatsApp();
    initSocial();
    initNavbar();
    initScrollSpy();
    initMobileMenu();
    initReveal();
    initFAQ();
    initComparators();
    initTrainingFilters();
    initContactForm();
    initLoginPage();
    initSmoothScroll();
    initParallax();
  });

})();
