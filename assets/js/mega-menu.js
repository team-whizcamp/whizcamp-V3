/* Whizcamp – mega menus + sticky header
   Load AFTER main.js:  <script src="assets/js/mega-menu.js" defer></script> */
(function () {
  'use strict';

  var header = document.querySelector('.group-25');          // whole header wrapper
  var pill   = document.querySelector('.group-26');          // header pill
  var home   = document.querySelector('.homepage');
  var root   = document.querySelector('[data-mm-root]');
  if (!header || !pill || !home) return;

  if (getComputedStyle(home).position === 'static') home.style.position = 'relative';
  if (getComputedStyle(pill).position === 'static') pill.style.position = 'relative';
  if (getComputedStyle(header).position === 'static') header.style.position = 'relative';

  /* ---------------------------------------------------------
     1) STICKY HEADER
     - If no ancestor uses transform/filter (so position:fixed is reliable)
       we switch the header to position:fixed while scrolling.
     - Otherwise (e.g. your .responsive-stage is scaled) we keep it absolute
       and translate it by the scroll distance, corrected for the stage scale.
     --------------------------------------------------------- */
  var GAP = 12;                                              // px from top of viewport when stuck
  var bg = document.createElement('div');
  bg.className = 'mm-stickybg';
  pill.insertBefore(bg, pill.firstChild);

  function createsContainingBlock(el) {
    var cs = getComputedStyle(el);
    return (cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' ||
            /transform|filter|perspective/.test(cs.willChange) ||
            /paint|layout|strict|content/.test(cs.contain) ||
            (cs.backdropFilter && cs.backdropFilter !== 'none'));
  }
  function canUseFixed() {
    for (var el = header; el && el !== document.documentElement; el = el.parentElement) {
      if (el === header ? (getComputedStyle(el).transform !== 'none') : createsContainingBlock(el)) return false;
    }
    return true;
  }

  var useFixed = false, baseTop = 0, baseLeft = 0, baseW = 0, baseH = 0, scale = 1, stuck = false, ticking = false;

  function unstick() {
    header.classList.remove('is-stuck-fixed');
    ['position','top','left','width','height'].forEach(function (p) { header.style[p] = ''; });
    header.style.translate = '';
  }
  function measure() {
    unstick(); stuck = false; header.classList.remove('is-stuck');
    var r = header.getBoundingClientRect();
    baseTop = r.top + window.pageYOffset; baseLeft = r.left; baseW = r.width; baseH = r.height;
    var s = home.getBoundingClientRect().width / (home.offsetWidth || 1);
    scale = (s > 0 && isFinite(s)) ? s : 1;
    useFixed = canUseFixed();
    update();
  }
  function update() {
    ticking = false;
    var shift = window.pageYOffset + GAP - baseTop;
    var on = shift > 0;
    if (useFixed) {
      if (on && !header.classList.contains('is-stuck-fixed')) {
        header.classList.add('is-stuck-fixed');
        header.style.top = GAP + 'px'; header.style.left = baseLeft + 'px';
        header.style.width = baseW + 'px'; header.style.height = baseH + 'px';
      } else if (!on && header.classList.contains('is-stuck-fixed')) unstick();
    } else {
      header.style.translate = on ? '0 ' + (shift / scale) + 'px' : '';
    }
    header.classList.toggle('is-stuck', on);
    if (on !== stuck) { stuck = on; placeOverlay(); }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  /* ---------------------------------------------------------
     2) MEGA MENU
     --------------------------------------------------------- */
  var triggers = {};
  var map = { services: '.frame-10 .group-31', work: '.frame-10 .group-32', products: '.frame-10 .group-33' };
  var overlay = null, current = null, closeTimer = null;

  if (root) {
    overlay = document.createElement('div');
    overlay.className = 'mm-overlay';
    home.appendChild(overlay);

    Object.keys(map).forEach(function (name) {
      var el = document.querySelector(map[name]);
      if (!el) return;
      triggers[name] = el;
      el.setAttribute('data-mm-trigger', name);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-haspopup', 'true');
      el.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-controls', 'mm-' + name);

      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') open(name); });
      el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') scheduleClose(); });
      el.addEventListener('click', function () { current === name ? close() : open(name); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); current === name ? close() : open(name); }
      });
    });

    root.addEventListener('pointerenter', function () { clearTimeout(closeTimer); });
    root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') scheduleClose(); });
    pill.addEventListener('pointerenter', function () { clearTimeout(closeTimer); });
    // hovering other nav items (About / Industries / Insights) closes the menu
    var nav = document.querySelector('.frame-10');
    if (nav) nav.addEventListener('pointerover', function (e) {
      if (!e.target.closest('[data-mm-trigger]') && e.pointerType === 'mouse') scheduleClose(80);
    });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (current && !e.target.closest('[data-mm-root], [data-mm-trigger]')) close();
    });
  }

  function open(name) {
    clearTimeout(closeTimer);
    if (!root || current === name) return;
    current = name;
    root.querySelectorAll('[data-mm-panel]').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-mm-panel') === name);
    });
    Object.keys(triggers).forEach(function (k) {
      triggers[k].classList.toggle('is-open', k === name);
      triggers[k].setAttribute('aria-expanded', String(k === name));
    });
    placeOverlay();
    overlay.classList.add('is-on');
  }
  function close() {
    clearTimeout(closeTimer);
    if (!root || !current) return;
    current = null;
    root.querySelectorAll('[data-mm-panel]').forEach(function (p) { p.classList.remove('is-active'); });
    Object.keys(triggers).forEach(function (k) {
      triggers[k].classList.remove('is-open'); triggers[k].setAttribute('aria-expanded', 'false');
    });
    overlay.classList.remove('is-on');
  }
  function scheduleClose(delay) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, delay || 220);
  }
  // dim everything except the announcement ticker (until the header is stuck)
  function placeOverlay() {
    if (!overlay) return;
    var top = 0;
    var ticker = document.querySelector('.announcement-ticker');
    if (ticker && !stuck && window.pageYOffset < 5) {
      var hr = home.getBoundingClientRect();
      top = (ticker.getBoundingClientRect().bottom - hr.top) / scale;
    }
    overlay.style.top = Math.max(0, top) + 'px';
  }

  /* ---------------------------------------------------------
     init
     --------------------------------------------------------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); if (window.innerWidth < 1024) close(); });
  window.addEventListener('load', function () { setTimeout(measure, 150); });   // after fonts/GSAP pin-spacers
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
})();

/* =========================================================
   STICKY BAR: ticker + full-width white bar + header
   ========================================================= */
(function () {
  const header = document.querySelector('.group-25');
  const ticker = document.querySelector('.announcement-ticker');
  if (!header) return;

  const bar = document.createElement('div');
  bar.className = 'wc-stickbar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const root = document.documentElement;
  const clamp = (min, v, max) => Math.min(Math.max(v, min), max);
  let stuck = false;

  function measure() {
    const tickerH = ticker ? Math.round(ticker.getBoundingClientRect().height) : 0;
    root.style.setProperty('--wc-ticker-h', tickerH + 'px');

    // asli visible content: logo + menu + button
    const hr = header.getBoundingClientRect();
    const parts = ['.group-27', '.group-28', '.frame-10']
      .map(function (s) { return header.querySelector(s); })
      .filter(Boolean);
    let top = Infinity, bottom = -Infinity;
    parts.forEach(function (el) {
      const r = el.getBoundingClientRect();
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
    });

    // content ke upar-neeche barabar padding (8px - 14px)
    const pad = clamp(8, window.innerWidth * 0.008, 14);
    const barH = Math.round((bottom - top) + pad * 2);
    root.style.setProperty('--wc-bar-h', barH + 'px');

    // header ko aise rakho ki content bar ke theek beech me aaye
    const headerTop = tickerH + pad - (top - hr.top);
    root.style.setProperty('--wc-header-top', headerTop + 'px');
  }

  function update() {
    const tickerH = ticker ? ticker.offsetHeight : 0;
    const next = window.scrollY > tickerH + 20;

    header.classList.toggle('wc-stuck', next);
    document.body.classList.toggle('wc-is-stuck', next);
    if (ticker) ticker.classList.toggle('wc-fixed', next);

    if (next) {
      // pehli baar stuck hone par layout settle hone do, phir naapo
      if (!stuck) requestAnimationFrame(() => requestAnimationFrame(measure));
      else measure();
    }
    stuck = next;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', () => setTimeout(update, 250));
  window.addEventListener('load', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);

  // ticker ya pill ka size badle (text wrap, scale, etc.) to dobara naapo
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { if (stuck) measure(); });
    if (ticker) ro.observe(ticker);
    const pill = header.querySelector('.group-26');
    if (pill) ro.observe(pill);
  }

  update();
})();