(function () {
  'use strict';

  /* ---------- Menu mobilne ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Slider zdjęć ---------- */
  var slider = document.getElementById('slider');
  if (!slider) return;

  var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
  var dotsBox = slider.querySelector('[data-dots]');
  var current = 0;
  var timer = null;
  var INTERVAL = 4500;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dots = slides.map(function (slide, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'slider-dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Zdjęcie ' + (i + 1) + ' z ' + slides.length);
    b.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) {
      s.classList.toggle('is-active', n === current);
      s.setAttribute('aria-hidden', String(n !== current));
    });
    dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === current)); });
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  slider.querySelector('[data-prev]').addEventListener('click', function () { go(current - 1); restart(); });
  slider.querySelector('[data-next]').addEventListener('click', function () { go(current + 1); restart(); });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(current - 1); restart(); }
    if (e.key === 'ArrowRight') { go(current + 1); restart(); }
  });

  /* przesunięcie palcem na telefonie */
  var startX = null;
  slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });

  go(0);
  start();
})();
