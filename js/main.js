/* ==========================================================================
   Marina Proctor — Site JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */

  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* ---- Mobile menu toggle ---- */

  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ---- Portfolio filtering ---- */

  function initPortfolioFilter() {
    var tabs = document.querySelectorAll('.filter-tab');
    var items = document.querySelectorAll('.portfolio-item');
    if (!tabs.length || !items.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var filter = tab.getAttribute('data-filter');

        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---- Lightbox ---- */

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImage = lightbox.querySelector('.lightbox-image');
    var lightboxTitle = lightbox.querySelector('.lightbox-title');
    var lightboxCredit = lightbox.querySelector('.lightbox-credit');
    var lightboxCategory = lightbox.querySelector('.lightbox-category');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-arrow.prev');
    var nextBtn = lightbox.querySelector('.lightbox-arrow.next');

    var currentIndex = 0;

    function getVisibleItems() {
      return Array.from(document.querySelectorAll('.portfolio-item:not(.hidden)'));
    }

    function openLightbox(index) {
      var visible = getVisibleItems();
      if (index < 0 || index >= visible.length) return;
      currentIndex = index;

      var item = visible[index];
      var imgSrc = item.querySelector('img');
      lightboxImage.textContent = '';
      lightboxImage.style.backgroundImage = '';
      lightboxImage.style.backgroundColor = '';

      if (imgSrc) {
        var clone = imgSrc.cloneNode(true);
        clone.removeAttribute('loading');
        clone.style.width = 'auto';
        clone.style.height = 'auto';
        clone.style.maxHeight = '70vh';
        clone.style.maxWidth = '85vw';
        clone.style.objectFit = 'contain';
        lightboxImage.style.backgroundColor = 'var(--bg-secondary)';
        lightboxImage.appendChild(clone);
      } else {
        var placeholder = item.querySelector('.placeholder');
        var bg = placeholder ? placeholder.style.backgroundColor : '#1A1A1A';
        lightboxImage.style.backgroundColor = bg;
        lightboxImage.textContent = item.getAttribute('data-title');
      }

      lightboxTitle.textContent = item.getAttribute('data-title');
      lightboxCredit.textContent = item.getAttribute('data-credit') || '';
      lightboxCategory.textContent = item.getAttribute('data-category-label') || '';

      lightbox.classList.add('active');
      document.body.classList.add('menu-open');
    }

    function closeLightbox() {
      while (lightboxImage.firstChild) {
        lightboxImage.removeChild(lightboxImage.firstChild);
      }
      lightboxImage.textContent = '';
      lightbox.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    function navigate(direction) {
      var visible = getVisibleItems();
      currentIndex += direction;
      if (currentIndex < 0) currentIndex = visible.length - 1;
      if (currentIndex >= visible.length) currentIndex = 0;
      openLightbox(currentIndex);
    }

    document.querySelectorAll('.portfolio-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var videoUrl = item.getAttribute('data-video-url');
        if (videoUrl) {
          window.open(videoUrl, '_blank', 'noopener,noreferrer');
          return;
        }
        var visible = getVisibleItems();
        var idx = visible.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { navigate(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigate(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* ---- Scroll reveal ---- */

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Contact form ---- */

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');

      if (!name.value.trim()) {
        name.focus();
        return;
      }

      if (!email.value.trim() || !email.value.includes('@')) {
        email.focus();
        return;
      }

      var success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('visible');
      }

      form.reset();

      setTimeout(function () {
        if (success) success.classList.remove('visible');
      }, 5000);
    });
  }

  /* ---- Init ---- */

  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initMobileMenu();
    initPortfolioFilter();
    initLightbox();
    initScrollReveal();
    initContactForm();
  });

})();
