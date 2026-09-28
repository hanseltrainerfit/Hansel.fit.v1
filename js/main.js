/**
 * HANSEL FIT — main.js v2.1
 * Interacciones, animaciones, funcionalidades dinámicas y toggle de idioma.
 * Compatible con apertura directa por file:// (sin módulos ES, sin fetch).
 */

(function () {
  'use strict';

  /* ── Configuración — datos reales de contacto ─────────── */
  var CONFIG = {
    whatsappNumber:     '573043557549',
    whatsappDefaultMsg: 'Hola Hansel, vi tu página web y quiero información sobre tus servicios.',
    instagramHandle:    'johnhansel_fit',
    instagramUrl:       'https://www.instagram.com/johnhansel_fit/',
    facebookUrl:        'https://www.facebook.com/share/17u6CvQMzS/',
    contactEmail:       'hansel.trainer.fit@gmail.com'
  };

  /* ── Traducciones ES / EN ─────────────────────────────────
     Usa data-i18n="clave"      → textContent
     Usa data-i18n-html="clave" → innerHTML (soporta <em>, <br>)
  ────────────────────────────────────────────────────────── */
  var TRANSLATIONS = {
    es: {
      /* Navegación */
      'nav.about':    'Sobre mí',
      'nav.services': 'Servicios',
      'nav.method':   'Método',
      'nav.results':  'Resultados',
      'nav.training': 'Contenido',
      'nav.faq':      'FAQ',
      'nav.contact':  'Contacto',
      'nav.login':    'PORTAL CLIENTES',
      /* Hero */
      'hero.eyebrow': 'Entrenador Personal &amp; Fitness Coach',
      'hero.title':   'ENTRENA\n      <em>CON</em>\n      PROPÓSITO.',
      'hero.cta1':    'COMENZAR MI TRANSFORMACIÓN',
      'hero.cta2':    'VER MIS SERVICIOS',
      'hero.badge':   'Entrena con propósito',
      /* CTA Strips */
      'cta1.eyebrow': '¿No sabes qué servicio es el indicado para ti?',
      'cta1.sub':     'Sin compromiso — solo una conversación honesta sobre tus metas.',
      'cta1.btn':     'HABLEMOS SIN COMPROMISO',
      'cta2.eyebrow': '¿Listo para convertirte en el próximo caso de éxito?',
      'cta2.sub':     'Cada transformación empieza con una sola decisión.',
      'cta2.btn':     'INICIAR MI PROCESO',
      /* Sticky móvil */
      'sticky.wa':  'Escribir por WhatsApp',
      'sticky.cta': 'SOLICITAR ASESORÍA'
    },
    en: {
      /* Navigation */
      'nav.about':    'About',
      'nav.services': 'Services',
      'nav.method':   'Method',
      'nav.results':  'Results',
      'nav.training': 'Content',
      'nav.faq':      'FAQ',
      'nav.contact':  'Contact',
      'nav.login':    'CLIENT PORTAL',
      /* Hero */
      'hero.eyebrow': 'Personal Trainer &amp; Fitness Coach',
      'hero.title':   'TRAIN\n      <em>WITH</em>\n      PURPOSE.',
      'hero.cta1':    'START MY TRANSFORMATION',
      'hero.cta2':    'SEE MY SERVICES',
      'hero.badge':   'Train with purpose',
      /* CTA Strips */
      'cta1.eyebrow': 'Not sure which service is right for you?',
      'cta1.sub':     'No strings attached — just an honest conversation about your goals.',
      'cta1.btn':     "LET'S TALK",
      'cta2.eyebrow': 'Ready to become the next success story?',
      'cta2.sub':     'Every transformation starts with a single decision.',
      'cta2.btn':     'START MY PROCESS',
      /* Mobile sticky */
      'sticky.wa':  'WhatsApp',
      'sticky.cta': 'REQUEST COACHING'
    }
  };

  /* ── Estado del idioma ─────────────────────────────────── */
  var currentLang = localStorage.getItem('hf-lang') || 'es';

  /* ── Aplicar traducciones al DOM ──────────────────────── */
  function applyTranslations(lang) {
    var t = TRANSLATIONS[lang];
    if (!t) return;

    /* Texto simple: data-i18n */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });

    /* Texto con HTML: data-i18n-html */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    /* Actualizar atributo lang del <html> */
    document.documentElement.lang = lang;
  }

  /* ── Toggle de idioma ─────────────────────────────────── */
  function initLangToggle() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;

    /* Aplicar idioma guardado al cargar */
    applyTranslations(currentLang);
    updateToggleUI(btn, currentLang);

    btn.addEventListener('click', function () {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      localStorage.setItem('hf-lang', currentLang);
      applyTranslations(currentLang);
      updateToggleUI(btn, currentLang);
    });
  }

  function updateToggleUI(btn, lang) {
    btn.querySelectorAll('.lang-opt').forEach(function (opt) {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('lang-opt--active');
      } else {
        opt.classList.remove('lang-opt--active');
      }
    });
    btn.setAttribute('aria-label', lang === 'es'
      ? 'Idioma actual: Español. Cambiar a inglés'
      : 'Current language: English. Switch to Spanish'
    );
  }

  /* ── Utilidad: construir enlace de WhatsApp ───────────── */
  function waLink(msg) {
    var m = msg || CONFIG.whatsappDefaultMsg;
    return 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(m);
  }

  /* ── Inicializar WhatsApp (elementos data-wa legados) ─── */
  function initWhatsApp() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      var msg = el.getAttribute('data-wa-msg') || CONFIG.whatsappDefaultMsg;
      el.href = waLink(msg);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
    document.querySelectorAll('[data-ig]').forEach(function (el) {
      el.href = CONFIG.instagramUrl;
    });
  }

  /* ── Navbar: transparente → sólido al hacer scroll ───── */
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

  /* ── Scroll Spy: resaltar enlace de nav activo ────────── */
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

  /* ── Menú móvil ───────────────────────────────────────── */
  function initMobileMenu() {
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Cerrar menú');
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
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Abrir menú');
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
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  /* ── Ocultar barra sticky al llegar a §8 Contacto ──────── */
  function initStickyBar() {
    var bar = document.getElementById('mobile-sticky-bar');
    if (!bar) return;
    var contact = document.getElementById('contact');
    if (!contact || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        bar.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
      });
    }, { threshold: 0.1 });
    obs.observe(contact);
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

  /* ── Acordeón FAQ ─────────────────────────────────────── */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn    = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
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
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
    });
  }

  /* ── Comparador Antes / Después ───────────────────────── */
  function initComparators() {
    var wrappers = document.querySelectorAll('.before-after-wrapper');
    wrappers.forEach(function (wrapper) {
      var beforeImg = wrapper.querySelector('.before-img');
      var divider   = wrapper.querySelector('.ba-divider');
      var handle    = wrapper.querySelector('.ba-handle');
      if (!beforeImg || !divider || !handle) return;

      var dragging = false;
      var pct = 50;

      function setPosition(p) {
        pct = Math.max(2, Math.min(98, p));
        divider.style.left   = pct + '%';
        handle.style.left    = pct + '%';
        beforeImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      }
      setPosition(50);

      function getPercent(clientX) {
        var rect = wrapper.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      wrapper.addEventListener('mousedown', function (e) {
        dragging = true; setPosition(getPercent(e.clientX)); e.preventDefault();
      });
      document.addEventListener('mousemove', function (e) { if (dragging) setPosition(getPercent(e.clientX)); });
      document.addEventListener('mouseup', function () { dragging = false; });
      wrapper.addEventListener('touchstart', function (e) {
        dragging = true; setPosition(getPercent(e.touches[0].clientX));
      }, { passive: true });
      wrapper.addEventListener('touchmove', function (e) {
        if (dragging) setPosition(getPercent(e.touches[0].clientX));
      }, { passive: true });
      wrapper.addEventListener('touchend', function () { dragging = false; });
      wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  setPosition(pct - 5);
        if (e.key === 'ArrowRight') setPosition(pct + 5);
      });
    });
  }

  /* ── Filtros de tarjetas de contenido ─────────────────── */
  function initTrainingFilters() {
    var btns  = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.training-card');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ── Formulario de contacto → WhatsApp ───────────────── */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (form.querySelector('[name="name"]')    || {}).value || '';
      var service = (form.querySelector('[name="service"]') || {}).value || '';
      var goal    = (form.querySelector('[name="goal"]')    || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';

      if (!name.trim()) {
        var nameInput = form.querySelector('[name="name"]');
        if (nameInput) {
          nameInput.focus();
          nameInput.style.borderColor = 'var(--gold)';
          setTimeout(function () { nameInput.style.borderColor = ''; }, 2000);
        }
        return;
      }

      var isES = currentLang === 'es';
      var msg = isES
        ? 'Hola Hansel, mi nombre es ' + name.trim() + '.'
          + (service ? ' Estoy interesado en: ' + service + '.' : '')
          + (goal    ? ' Mi meta principal es: ' + goal + '.' : '')
          + (message ? ' Info adicional: ' + message.trim() : '')
        : 'Hello Hansel, my name is ' + name.trim() + '.'
          + (service ? ' I\'m interested in: ' + service + '.' : '')
          + (goal    ? ' My main goal is: ' + goal + '.' : '')
          + (message ? ' Additional info: ' + message.trim() : '');

      window.open(waLink(msg), '_blank');

      var success = document.getElementById('form-success');
      if (success) {
        success.style.display = 'block';
        setTimeout(function () { success.style.display = 'none'; }, 6000);
      }
      form.reset();
    });
  }

  /* ── Portal de clientes (toggle) ─────────────────────── */
  function initLoginPage() {
    var loginBtn    = document.getElementById('btn-login');
    var loginPage   = document.getElementById('login-page');
    var backBtn     = document.getElementById('btn-back-to-site');
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

  /* ── Smooth scroll para anclas ────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var hash = a.getAttribute('href');
        if (!hash || hash === '#') return;
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Parallax sutil ───────────────────────────────────── */
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

  /* ── Inicialización ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initLangToggle();   // Primero — aplica idioma guardado
    initWhatsApp();
    initNavbar();
    initScrollSpy();
    initMobileMenu();
    initStickyBar();
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
