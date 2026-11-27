/* WHIZCAMP — Services page (self-contained: shared About behaviour + services behaviour). */

/* ===== shared behaviour ===== */
/**
 * Whizcamp — About page behaviour
 * Loaded after main.js / mega-menu.js (which handle ticker, mega menu,
 * footer pills and smooth scroll). Everything here is feature-detected and
 * independent, so one failing block never blocks the others.
 *
 *  1. Hero entrance        (one orchestrated load animation)
 *  2. Sticky left column   (same translate3d technique as the home AI section)
 *  3. Principles accordion (same autoplay + progress line as the home accordion)
 *  4. Count-up numbers     (stats rows)
 *  5. Reveal on scroll     (cards + images only)
 *  6. Logo -> home link
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function safe(name, fn) {
    try { fn(); } catch (e) { console.error('[about:' + name + ']', e); }
  }

  /* 1. Hero entrance ------------------------------------------------- */
  function initHero() {
    var hero = $('.ab-hero');
    if (!hero) return;
    requestAnimationFrame(function () { hero.classList.add('is-loaded'); });
  }

  /* 2. Sticky left column -------------------------------------------- */
  function initSticky() {
    var section = $('[data-sticky-section]');
    var inner = section && $('[data-sticky-inner]', section);
    if (!section || !inner) return;

    var TOP = 110, queued = false;

    function update() {
      queued = false;
      if (window.innerWidth < 1024) { inner.style.transform = ''; return; }
      var rect = section.getBoundingClientRect();
      var cs = getComputedStyle(section);
      var padTop = parseFloat(cs.paddingTop) || 0;
      var padBottom = parseFloat(cs.paddingBottom) || 0;
      var travel = Math.max(0, section.offsetHeight - padTop - padBottom - inner.offsetHeight);
      var y = Math.min(Math.max(0, TOP - (rect.top + padTop)), travel);
      inner.style.transform = 'translate3d(0,' + y + 'px,0)';
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* 3. Principles accordion ------------------------------------------ */
  function initAccordion() {
    var root = $('[data-acc]');
    if (!root) return;
    var items = $$('.ab-acc__item', root);
    if (!items.length) return;

    var MS = 6000, current = -1, inView = false, started = false;
    root.style.setProperty('--ab-acc-ms', MS + 'ms');

    function paused() { root.classList.toggle('is-paused', !inView || document.hidden); }

    function open(i) {
      current = i;
      items.forEach(function (it, n) {
        var on = n === i;
        it.classList.toggle('is-open', on);
        $('.ab-acc__row', it).setAttribute('aria-expanded', String(on));
        $('.ab-acc__panel', it).setAttribute('aria-hidden', String(!on));
        it.classList.remove('is-playing');
      });
      void items[i].offsetWidth; // restart the progress animation
      if (!reduceMotion) items[i].classList.add('is-playing');
    }

    items.forEach(function (it, i) {
      var bar = $('.ab-acc__progress', it);
      if (bar) bar.addEventListener('animationend', function () {
        if (current === i) open((i + 1) % items.length);
      });
      $('.ab-acc__row', it).addEventListener('click', function () { started = true; open(i); });
    });

    document.addEventListener('visibilitychange', paused);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var was = inView;
        inView = entries[0].isIntersecting;
        paused();
        if (inView && !was && !started) { started = true; open(0); }
      }, { threshold: 0.3 }).observe(root);
    } else {
      inView = true; open(0);
    }
    open(0);
  }

  /* 4. Count-up ------------------------------------------------------ */
  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    function parse(text) {
      var m = /^(\D*)([\d.,]+)(.*)$/.exec(text.trim());
      if (!m) return null;
      var num = parseFloat(m[2].replace(/,/g, ''));
      var dec = (m[2].split('.')[1] || '').length;
      return { pre: m[1], num: num, dec: dec, post: m[3], text: text };
    }
    function run(el, d) {
      var t0 = null, dur = 1400;
      function frame(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = d.pre + (d.num * e).toFixed(d.dec) + d.post;
        if (p < 1) requestAnimationFrame(frame); else el.textContent = d.text;
      }
      requestAnimationFrame(frame);
    }

    var data = new Map();
    nodes.forEach(function (n) { data.set(n, parse(n.textContent)); });
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var d = data.get(en.target);
        if (d) run(en.target, d);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* 5. Reveal -------------------------------------------------------- */
  function initReveal() {
    var nodes = $$('[data-reveal]');
    if (!nodes.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    // stagger siblings inside the same grid
    $$('[data-reveal-group]').forEach(function (g) {
      $$('[data-reveal]', g).forEach(function (n, i) { n.style.setProperty('--ab-d', i * 90 + 'ms'); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* 6. Logo goes home ------------------------------------------------ */
  function initLogo() {
    var logo = $('.group-27');
    if (!logo) return;
    logo.style.cursor = 'pointer';
    logo.setAttribute('role', 'link');
    logo.setAttribute('tabindex', '0');
    logo.setAttribute('alt', 'Whizcamp home');
    function go() { window.location.href = 'index.html'; }
    logo.addEventListener('click', go);
    logo.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }

  function init() {
    // content is visible by default; only hide for the reveal once JS is confirmed running
    if (!reduceMotion) document.documentElement.classList.add('js-reveal');
    safe('hero', initHero);
    safe('sticky', initSticky);
    safe('accordion', initAccordion);
    safe('counters', initCounters);
    safe('reveal', initReveal);
    safe('logo', initLogo);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* ===== services page: filter, alternating layout, image-linked accordion with autoplay ===== */
(function () {
  'use strict';
  var list = document.querySelector('[data-sv-list]');
  if (!list) return;
  var rows = Array.prototype.slice.call(list.querySelectorAll('.sv-row'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.sv-chip'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MS = 6000;
  list.style.setProperty('--sv-ms', MS + 'ms');

  /* ---- filter + alternating image side ---- */
  function layout(animate) {
    var n = 0;
    rows.forEach(function (r) {
      if (r.hidden) return;
      r.classList.toggle('is-flip', n % 2 === 1);
      if (animate && !reduce) { r.classList.remove('is-entering'); void r.offsetWidth; r.classList.add('is-entering'); }
      n++;
    });
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      var g = chip.dataset.filter;
      rows.forEach(function (r) { var show = g === 'all' || r.dataset.group === g; r.hidden = !show; if (show) r.classList.add('is-in'); });
      layout(true);
    });
  });
  layout(false);

  /* ---- accordion: the active item opens its panel AND shows its own image ---- */
  rows.forEach(function (row) {
    var items = Array.prototype.slice.call(row.querySelectorAll('.sv-acc__item'));
    var imgs = Array.prototype.slice.call(row.querySelectorAll('.sv-row__media img'));
    var current = 0, inView = false, hovered = false;

    function syncPause() { row.classList.toggle('is-paused', !inView || hovered || document.hidden); }

    function activate(i) {
      current = i;
      items.forEach(function (it, n) {
        var on = n === i;
        it.classList.toggle('is-open', on);
        it.classList.remove('is-playing');
        it.querySelector('.sv-acc__row').setAttribute('aria-expanded', String(on));
      });
      imgs.forEach(function (im, n) { im.classList.toggle('is-active', n === i); });
      void items[i].offsetWidth;                              // restart the progress animation
      if (!reduce) items[i].classList.add('is-playing');      // autoplay timer = the progress line
    }

    items.forEach(function (it, i) {
      it.querySelector('.sv-acc__row').addEventListener('click', function () { activate(i); });  // click: jump to it
      it.querySelector('.sv-acc__progress').addEventListener('animationend', function () {        // autoplay: next item
        if (current === i) activate((i + 1) % items.length);
      });
    });

    // autoplay only while the row is on screen, and pause while the visitor is interacting with it
    row.addEventListener('mouseenter', function () { hovered = true; syncPause(); });
    row.addEventListener('mouseleave', function () { hovered = false; syncPause(); });
    row.addEventListener('focusin', function () { hovered = true; syncPause(); });
    row.addEventListener('focusout', function () { hovered = false; syncPause(); });
    document.addEventListener('visibilitychange', syncPause);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; syncPause(); }, { threshold: 0.35 }).observe(row);
    } else { inView = true; }

    activate(0);
    syncPause();
  });
})();