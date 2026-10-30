/**
 * Whizcamp Main Application Script
 * Orchestrates modules, event handlers, and core interactive components.
 * Works seamlessly in both local file:// and HTTP(S) server environments.
 */

(function () {
  'use strict';

  /**
   * Services Accordion Module
   * Handles expand/collapse state, accessibility attributes, and dynamic height recalculation on resize.
   */
  function initAccordion() {
    const accordionItems = document.querySelectorAll("[data-service-item]");
    if (!accordionItems.length) return;

    function updatePanelState(item, expand) {
      const button = item.querySelector(".services-accordion__toggle");
      const panel = item.querySelector(".services-accordion__panel");

      if (!button || !panel) return;

      if (expand) {
        item.classList.add("is-expanded");
        panel.hidden = false;
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = "1";
        button.setAttribute("aria-expanded", "true");
      } else {
        item.classList.remove("is-expanded");
        panel.style.maxHeight = "0px";
        panel.style.opacity = "0";
        window.setTimeout(function () {
          if (!item.classList.contains("is-expanded")) {
            panel.hidden = true;
          }
        }, 380);
      }
    }

    accordionItems.forEach(function (item) {
      const button = item.querySelector(".services-accordion__toggle");
      const panel = item.querySelector(".services-accordion__panel");
      const expanded = item.classList.contains("is-expanded");

      if (!button || !panel) return;

      if (expanded) {
        panel.hidden = false;
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = "1";
        button.setAttribute("aria-expanded", "true");
      } else {
        panel.hidden = true;
        panel.style.maxHeight = "0px";
        panel.style.opacity = "0";
        button.setAttribute("aria-expanded", "false");
      }

      button.addEventListener("click", function () {
        updatePanelState(item, !item.classList.contains("is-expanded"));
      });
    });

    window.addEventListener("resize", function () {
      accordionItems.forEach(function (item) {
        if (!item.classList.contains("is-expanded")) return;
        const panel = item.querySelector(".services-accordion__panel");
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /**
   * Sticky Scroll Module for AI Modernization Section
   * Keeps left content sticky while right-side cards scroll, stopping at parent boundaries.
   */
  function initStickyScroll() {
    const section = document.querySelector(".ai-modernization-section");
    const stickyInner = document.querySelector(".ai-modernization__sticky-inner");
    const leftCol = document.querySelector(".ai-modernization__left");

    if (!section || !stickyInner || !leftCol) return;

    const TOP_OFFSET = 80;
    let isTicking = false;

    function updateStickyPosition() {
      if (window.innerWidth < 1024) {
        stickyInner.style.transform = "";
        isTicking = false;
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const innerHeight = stickyInner.offsetHeight;
      const maxTranslate = Math.max(0, sectionHeight - innerHeight - 40);

      if (sectionRect.top > TOP_OFFSET) {
        stickyInner.style.transform = "translate3d(0, 0, 0)";
      } else if (sectionRect.top <= TOP_OFFSET && sectionRect.bottom >= innerHeight + TOP_OFFSET) {
        const currentY = TOP_OFFSET - sectionRect.top;
        const clampedY = Math.min(currentY, maxTranslate);
        stickyInner.style.transform = `translate3d(0, ${clampedY}px, 0)`;
      } else {
        stickyInner.style.transform = `translate3d(0, ${maxTranslate}px, 0)`;
      }

      isTicking = false;
    }

    function onScroll() {
      if (!isTicking) {
        window.requestAnimationFrame(updateStickyPosition);
        isTicking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial positioning
    updateStickyPosition();
  }

  // DOM Ready initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    initAccordion();
    initStickyScroll();
    console.log("Whizcamp application initialized successfully.");
  }
})();
