/* Whizcamp 404 page scripts: header + compass */
(function () {
  var header = document.querySelector('[data-wc-header]');
  if (!header) return;
  var triggers = [].slice.call(header.querySelectorAll('[data-mm-trigger]'));
  var panels = [].slice.call(header.querySelectorAll('[data-mm-panel]'));
  var nav = header.querySelector('#wc-nav');
  var burger = header.querySelector('.wc-burger');
  var timer;

  function closeAll() {
    panels.forEach(function (p) { p.classList.remove('is-open'); });
    triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }
  function open(name) {
    closeAll();
    var p = header.querySelector('[data-mm-panel="' + name + '"]');
    var t = header.querySelector('[data-mm-trigger="' + name + '"]');
    if (p) p.classList.add('is-open');
    if (t) t.setAttribute('aria-expanded', 'true');
  }
  function setNav(state) {
    nav.classList.toggle('is-open', state);
    burger.setAttribute('aria-expanded', String(state));
  }
  function canHover() { return window.matchMedia('(hover: hover) and (min-width: 961px)').matches; }

  triggers.forEach(function (t) {
    var name = t.getAttribute('data-mm-trigger');
    t.addEventListener('mouseenter', function () { if (canHover()) { clearTimeout(timer); open(name); } });
    t.addEventListener('click', function () {
      t.getAttribute('aria-expanded') === 'true' ? closeAll() : open(name);
    });
  });
  header.addEventListener('mouseenter', function () { clearTimeout(timer); });
  header.addEventListener('mouseleave', function () { if (canHover()) timer = setTimeout(closeAll, 180); });
  document.addEventListener('click', function (e) { if (!header.contains(e.target)) closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); setNav(false); } });
  burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* The compass "0" follows your cursor / finger */
(function () {
  var compass = document.getElementById('nf-compass');
  if (!compass) return;
  var needle = compass.querySelector('.nf__needle');

  function point(x, y) {
    var r = compass.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var deg = Math.atan2(y - cy, x - cx) * 180 / Math.PI + 90; // needle art points up
    compass.classList.add('is-tracking');
    needle.style.transform = 'rotate(' + deg + 'deg)';
  }
  window.addEventListener('pointermove', function (e) { point(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchstart', function (e) { var t = e.touches[0]; if (t) point(t.clientX, t.clientY); }, { passive: true });
})();