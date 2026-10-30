/**
 * Sticky Scroll Module — AI Modernization Section
 *
 * Keeps the left-side content panel visually fixed while the right-side
 * cards scroll, using GPU-accelerated translate3d (no layout thrashing).
 * Respects section boundaries — stops sticking when the section ends.
 * Auto-disables on screens narrower than 1024 px.
 */

export function initStickyScroll() {
  const section    = document.querySelector('.ai-modernization-section');
  const leftCol    = document.querySelector('.ai-modernization__left');
  const stickyEl   = document.querySelector('.ai-modernization__sticky-inner');

  if (!section || !leftCol || !stickyEl) return;

  const TOP_OFFSET = 80;   // px from viewport top when content "sticks"
  let   isTicking  = false;

  function update() {
    // ── Disable on mobile / tablet ────────────────────────────────────────
    if (window.innerWidth < 1024) {
      stickyEl.style.transform = '';
      isTicking = false;
      return;
    }

    const secRect    = section.getBoundingClientRect();
    const elHeight   = stickyEl.offsetHeight;
    const secHeight  = section.offsetHeight;
    // Maximum downward translation before sticky inner hits the section bottom
    const maxY       = Math.max(0, secHeight - elHeight - TOP_OFFSET);

    if (secRect.top > TOP_OFFSET) {
      // Section hasn't scrolled into the sticky zone yet
      stickyEl.style.transform = 'translate3d(0,0,0)';

    } else if (secRect.bottom > elHeight + TOP_OFFSET) {
      // Actively sticking — translate the inner element downward as page scrolls
      const y = Math.min(TOP_OFFSET - secRect.top, maxY);
      stickyEl.style.transform = `translate3d(0,${y}px,0)`;

    } else {
      // Section is ending — lock to the bottom
      stickyEl.style.transform = `translate3d(0,${maxY}px,0)`;
    }

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      window.requestAnimationFrame(update);
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Run once on load
  update();
}
