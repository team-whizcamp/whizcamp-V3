/**
 * Services Accordion Module
 * Handles expand/collapse state, accessibility attributes, and dynamic height recalculation on resize.
 */
export function initAccordion() {
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
      window.setTimeout(() => {
        if (!item.classList.contains("is-expanded")) {
          panel.hidden = true;
        }
      }, 380);
    }
  }

  accordionItems.forEach((item) => {
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

    button.addEventListener("click", () => {
      updatePanelState(item, !item.classList.contains("is-expanded"));
    });
  });

  window.addEventListener("resize", () => {
    accordionItems.forEach((item) => {
      if (!item.classList.contains("is-expanded")) return;
      const panel = item.querySelector(".services-accordion__panel");
      if (panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}
