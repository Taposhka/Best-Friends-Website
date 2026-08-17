"use strict";

const root = document.documentElement;
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const motionReduced = motionQuery.matches;
const finePointer = finePointerQuery.matches;

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const scrollTasks = new Set();
let scrollFrame = 0;
let scrollEventPending = false;
let resizeEventPending = false;

function runScrollTasks() {
  const context = {
    isScroll: scrollEventPending,
    isResize: resizeEventPending,
  };

  scrollEventPending = false;
  resizeEventPending = false;
  scrollFrame = 0;
  scrollTasks.forEach((task) => task(context));
}

function requestScrollFrame({ isScroll = false, isResize = false } = {}) {
  scrollEventPending ||= isScroll;
  resizeEventPending ||= isResize;
  if (!scrollFrame) scrollFrame = requestAnimationFrame(runScrollTasks);
}

function addScrollTask(task) {
  scrollTasks.add(task);
  task({ isScroll: false, isResize: true });
  return () => scrollTasks.delete(task);
}

window.addEventListener(
  "scroll",
  () => requestScrollFrame({ isScroll: true }),
  { passive: true },
);
window.addEventListener("resize", () =>
  requestScrollFrame({ isResize: true }),
);
window.addEventListener("pageshow", () =>
  requestScrollFrame({ isResize: true }),
);

function initCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });
}

function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!toggle || !menu) return;
  const backgroundContent = document.querySelectorAll(
    "main, .brand-finale, .site-footer",
  );

  const backdrop = document.createElement("div");
  backdrop.className = "menu-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.append(backdrop);

  const closeMenu = ({ returnFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menyuni ochish");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    backgroundContent.forEach((element) => {
      element.inert = false;
    });
    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menyuni yopish");
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    backgroundContent.forEach((element) => {
      element.inert = true;
    });
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  backdrop.addEventListener("click", () => closeMenu());

  document.addEventListener("keydown", (event) => {
    if (!menu.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeMenu({ returnFocus: true });
      return;
    }

    if (event.key === "Tab") {
      const focusable = [
        toggle,
        ...menu.querySelectorAll('a[href], button:not([disabled])'),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("is-open") &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1120) closeMenu();
  });
}

function initHeaderScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  addScrollTask(() => {
    const isCompact = window.scrollY > 24;
    document.body.classList.toggle("page-scrolled", isCompact);
    header.classList.toggle("is-compact", isCompact);
  });
}

function initPageEntrance() {
  const pageHero = document.querySelector(".page-hero-inner");
  if (pageHero) {
    [...pageHero.children].forEach((child, index) => {
      if (!child.hasAttribute("data-entrance")) {
        child.dataset.entrance = String(index);
      }
    });
  }

  if (motionReduced) {
    root.classList.add("motion-disabled", "motion-loaded", "motion-settled");
    return;
  }

  root.classList.add("motion-ready");
  requestAnimationFrame(() => root.classList.add("motion-loaded"));

  const settleMotion = () => root.classList.add("motion-settled");
  window.setTimeout(settleMotion, 650);
  window.addEventListener("pageshow", () => {
    root.classList.remove("page-is-exiting");
    document.body.classList.remove("page-is-exiting");
    requestAnimationFrame(() => root.classList.add("motion-loaded"));
  });
}

function initPriceAnimation() {
  const counters = [...document.querySelectorAll("[data-counter]")];
  const completed = new WeakSet();

  const formatNumber = (value, decimals = 0) => {
    const [whole, fraction] = Number(value).toFixed(decimals).split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return fraction === undefined ? grouped : `${grouped}.${fraction}`;
  };

  const finish = (counter) => {
    const target = Number(counter.dataset.counter);
    const decimals = Number(counter.dataset.counterDecimals) || 0;
    const suffix = counter.dataset.counterSuffix || "";
    if (!Number.isFinite(target)) return;
    counter.textContent = `${formatNumber(target, decimals)}${suffix}`;
    counter.classList.add("counter-complete");
    completed.add(counter);
  };

  const start = (counter) => {
    if (!counter || completed.has(counter)) return;
    const target = Number(counter.dataset.counter);
    if (!Number.isFinite(target) || motionReduced) {
      finish(counter);
      return;
    }

    completed.add(counter);
    const decimals = Number(counter.dataset.counterDecimals) || 0;
    const suffix = counter.dataset.counterSuffix || "";
    const duration = 420;
    let startTime = 0;

    const tick = (time) => {
      if (!startTime) startTime = time;
      const progress = clamp((time - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      counter.textContent = `${formatNumber(target * eased, decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        finish(counter);
      }
    };

    requestAnimationFrame(tick);
  };

  if (motionReduced) counters.forEach(finish);
  return { counters, start };
}

function initScrollReveals(counterController) {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const parallaxItems = new Set();
  const scrollProgressItems = new Set();

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const children = [...group.children].filter(
      (child) => child instanceof HTMLElement,
    );

    children.forEach((child, index) => {
      if (!child.hasAttribute("data-reveal")) child.dataset.reveal = "up";
      if (!child.hasAttribute("data-reveal-delay")) {
        child.dataset.revealDelay = String(Math.min(index * 55, 180));
      }
      if (!revealItems.includes(child)) revealItems.push(child);
    });
  });

  revealItems.forEach((item) => {
    const delay = clamp(Number(item.dataset.revealDelay) || 0, 0, 210);
    item.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const pendingRevealItems = new Set(revealItems);
  const pendingCounters = new Set(counterController.counters);

  const reveal = (item) => {
    if (item.classList.contains("is-revealed")) return;
    pendingRevealItems.delete(item);
    item.classList.add("is-revealed");

    const clearLayers = (event) => {
      if (
        event.target !== item ||
        (event.propertyName !== "transform" && event.propertyName !== "opacity")
      ) {
        return;
      }
      item.classList.add("reveal-complete");
      item.removeEventListener("transitionend", clearLayers);
    };
    item.addEventListener("transitionend", clearLayers);
  };

  const startCounter = (counter) => {
    pendingCounters.delete(counter);
    counterController.start(counter);
  };

  const allTargets = new Set([
    ...revealItems,
    ...counterController.counters,
    ...document.querySelectorAll("[data-parallax]"),
    ...document.querySelectorAll("[data-scroll-progress]"),
  ]);

  if (motionReduced || !("IntersectionObserver" in window)) {
    revealItems.forEach(reveal);
    counterController.counters.forEach(startCounter);
    document.querySelectorAll("[data-scroll-progress]").forEach((item) => {
      item.style.setProperty("--section-progress", "1");
    });
    return { parallaxItems, scrollProgressItems };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (target.hasAttribute("data-parallax")) {
          if (entry.isIntersecting) parallaxItems.add(target);
          else parallaxItems.delete(target);
        }

        if (target.hasAttribute("data-scroll-progress")) {
          target.classList.toggle("is-scroll-visible", entry.isIntersecting);
          if (entry.isIntersecting) {
            scrollProgressItems.add(target);
          } else {
            scrollProgressItems.delete(target);
            target.style.setProperty(
              "--section-progress",
              entry.boundingClientRect.bottom < 0 ? "1" : "0",
            );
          }
        }

        if (!entry.isIntersecting) {
          // Fast scrollbar jumps can skip an intersection frame. Reveal anything
          // already passed so content never remains hidden above the viewport.
          if (entry.boundingClientRect.bottom < 0) {
            if (target.hasAttribute("data-reveal")) reveal(target);
            if (target.hasAttribute("data-counter")) {
              startCounter(target);
            }
          }
          return;
        }
        if (target.hasAttribute("data-reveal")) reveal(target);
        if (target.hasAttribute("data-counter")) startCounter(target);

        if (
          !target.hasAttribute("data-parallax") &&
          !target.hasAttribute("data-scroll-progress")
        ) {
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "80px 0px -10% 0px" },
  );

  allTargets.forEach((target) => {
    const bounds = target.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < window.innerHeight * 0.94) {
      if (target.hasAttribute("data-reveal")) reveal(target);
      if (target.hasAttribute("data-counter")) startCounter(target);
      if (target.hasAttribute("data-scroll-progress")) {
        scrollProgressItems.add(target);
        target.classList.add("is-scroll-visible");
      }
    }
    observer.observe(target);
  });

  // A fast scrollbar jump may cross an element without an intersection frame.
  // This shrinking fallback set reveals passed content without permanent work.
  addScrollTask(({ isScroll, isResize }) => {
    if (
      (!isScroll && !isResize) ||
      (!pendingRevealItems.size && !pendingCounters.size)
    ) {
      return;
    }
    const triggerLine = window.innerHeight * 0.94;
    pendingRevealItems.forEach((item) => {
      if (item.getBoundingClientRect().top >= triggerLine) return;
      reveal(item);
      if (
        !item.hasAttribute("data-parallax") &&
        !item.hasAttribute("data-scroll-progress")
      ) {
        observer.unobserve(item);
      }
    });
    pendingCounters.forEach((counter) => {
      if (counter.getBoundingClientRect().top < triggerLine) {
        startCounter(counter);
        observer.unobserve(counter);
      }
    });
  });

  return { parallaxItems, scrollProgressItems };
}

function initSectionScrollProgress(scrollProgressItems) {
  const sections = [...document.querySelectorAll("[data-scroll-progress]")];
  if (!sections.length) return;

  if (motionReduced) {
    sections.forEach((section) => {
      section.style.setProperty("--section-progress", "1");
    });
    return;
  }

  addScrollTask(() => {
    const viewportHeight = window.innerHeight;
    scrollProgressItems.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      const start = viewportHeight * 0.94;
      const travel = Math.max(viewportHeight * 0.62, 1);
      const progress = clamp((start - bounds.top) / travel, 0, 1);
      section.style.setProperty("--section-progress", progress.toFixed(4));

      const ctaProgress = section.classList.contains("home-cta")
        ? clamp(
            (viewportHeight * 0.88 - bounds.top) /
              (bounds.height + viewportHeight * 0.58),
            0,
            1,
          )
        : progress;
      section.style.setProperty(
        "--section-travel",
        `${(ctaProgress * 420).toFixed(2)}%`,
      );

      const steps = section.querySelector(".order-steps-large");
      if (steps) {
        const stepBounds = steps.getBoundingClientRect();
        const stepProgress = clamp(
          (viewportHeight * 0.72 - stepBounds.top) /
            (stepBounds.height + viewportHeight * 0.42),
          0,
          1,
        );
        section.style.setProperty("--steps-progress", stepProgress.toFixed(4));
      }
    });
  });
}

function initScrollParallax(parallaxItems) {
  if (motionReduced || !parallaxItems) return;
  const allParallaxItems = [...document.querySelectorAll("[data-parallax]")];
  let desktopActive = window.innerWidth >= 900;

  addScrollTask(({ isResize }) => {
    const isDesktop = window.innerWidth >= 900;
    if (!isDesktop) {
      if (isResize && desktopActive) {
        allParallaxItems.forEach((item) => {
          item.style.removeProperty("--parallax-y");
          item.style.removeProperty("--parallax-scale");
          item.style.removeProperty("--parallax-rotate");
        });
      }
      desktopActive = false;
      return;
    }
    desktopActive = true;

    const viewportHeight = window.innerHeight;
    parallaxItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      const center = bounds.top + bounds.height / 2;
      const offset = clamp(
        (center - viewportHeight / 2) / (viewportHeight + bounds.height),
        -0.5,
        0.5,
      );
      const strength = item.dataset.parallax === "hero" ? 28 : 20;
      item.style.setProperty(
        "--parallax-y",
        `${Math.round(offset * strength * -1)}px`,
      );
      item.style.setProperty(
        "--parallax-scale",
        (1 - Math.abs(offset) * 0.018).toFixed(4),
      );
      item.style.setProperty(
        "--parallax-rotate",
        `${(offset * (item.dataset.parallax === "hero" ? 0.8 : 0.45)).toFixed(3)}deg`,
      );
    });
  });
}

function initPageTransitions() {
  if (motionReduced) return;

  const overlay = document.createElement("div");
  overlay.className = "page-transition-overlay";
  overlay.setAttribute("aria-hidden", "true");
  document.body.append(overlay);

  const shouldTransition = (event, link) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download") ||
      link.target === "_blank"
    ) {
      return false;
    }

    const rawHref = link.getAttribute("href") || "";
    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      /^(tel:|mailto:|javascript:)/i.test(rawHref)
    ) {
      return false;
    }

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  document.addEventListener("click", (event) => {
    const eventTarget =
      event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = eventTarget?.closest("a[href]");
    if (!link || !shouldTransition(event, link)) return;

    event.preventDefault();
    if (document.body.classList.contains("page-is-exiting")) return;
    document.body.classList.add("page-is-exiting");
    overlay.classList.add("is-active");
    const destination = link.href;
    window.setTimeout(() => window.location.assign(destination), 180);
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-is-exiting");
    overlay.classList.remove("is-active");
  });
}

function initMagneticButtons() {
  const buttons = [
    ...document.querySelectorAll(
      '.button:not(:disabled):not([aria-disabled="true"])',
    ),
  ];
  buttons.forEach((button) => button.setAttribute("data-magnetic", ""));
  if (motionReduced || !finePointer) return;

  const cleanups = [];
  buttons.forEach((button) => {
    let bounds = null;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const setActiveLayers = (active) => {
      let layer = button.parentElement;
      const header = document.querySelector(".site-header");
      while (layer && layer !== document.body && layer !== header) {
        layer.classList.toggle("has-active-magnetic", active);
        layer = layer.parentElement;
      }
    };

    const render = () => {
      frame = 0;
      if (!bounds?.width || !bounds?.height) return;
      const x = (pointerX - bounds.left) / bounds.width - 0.5;
      const y = (pointerY - bounds.top) / bounds.height - 0.5;
      button.style.setProperty("--magnet-x", `${clamp(x * 8, -5, 5)}px`);
      button.style.setProperty("--magnet-y", `${clamp(y * 7, -4, 4)}px`);
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      bounds = null;
      button.classList.remove("is-magnetic-active");
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
      setActiveLayers(false);
    };

    button.classList.add("is-magnetic");
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      bounds = button.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      button.classList.add("is-magnetic-active");
      setActiveLayers(true);
    });
    button.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !bounds) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    });
    button.addEventListener("pointerleave", reset);
    button.addEventListener("pointercancel", reset);
    cleanups.push(reset);
  });

  const resetAll = () => cleanups.forEach((cleanup) => cleanup());
  window.addEventListener("blur", resetAll);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetAll();
  });
}

function initRadialButtons() {
  if (motionReduced || !finePointer) return;
  const buttons = document.querySelectorAll(
    '.button:not(.button-secondary):not(.button-light):not(:disabled):not([aria-disabled="true"])',
  );

  buttons.forEach((button) => {
    let bounds = null;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (!bounds) return;
      const localX = clamp(pointerX - bounds.left, 0, bounds.width);
      const localY = clamp(pointerY - bounds.top, 0, bounds.height);
      const farthestX = Math.max(localX, bounds.width - localX);
      const farthestY = Math.max(localY, bounds.height - localY);
      const diameter = Math.hypot(farthestX, farthestY) * 2;
      button.style.setProperty("--button-fill-x", `${localX}px`);
      button.style.setProperty("--button-fill-y", `${localY}px`);
      button.style.setProperty("--button-fill-size", `${diameter}px`);
    };

    const reset = () => {
      button.classList.remove("is-radial-active");
      bounds = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    button.classList.add("has-radial-fill");
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      bounds = button.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      render();
      button.classList.add("is-radial-active");
    });
    button.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !bounds) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    });
    button.addEventListener("pointerleave", reset);
    button.addEventListener("pointercancel", reset);
  });
}

function initProductTilt() {
  if (motionReduced || !finePointer) return;
  const cards = document.querySelectorAll("[data-tilt]");

  cards.forEach((card) => {
    let bounds = null;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let cleanupTimer = 0;

    const render = () => {
      frame = 0;
      if (!bounds?.width || !bounds?.height) return;
      const x = (pointerX - bounds.left) / bounds.width - 0.5;
      const y = (pointerY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${clamp(y * -5, -2.5, 2.5)}deg`);
      card.style.setProperty("--tilt-y", `${clamp(x * 5, -2.5, 2.5)}deg`);
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(cleanupTimer);
      frame = 0;
      bounds = null;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      cleanupTimer = window.setTimeout(() => {
        if (!card.classList.contains("is-tilting")) {
          card.style.removeProperty("will-change");
        }
      }, 340);
    };

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      bounds = card.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      window.clearTimeout(cleanupTimer);
      card.classList.add("is-tilting");
      card.style.willChange = "transform";
    });
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !bounds) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    });
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    card.addEventListener("transitionend", (event) => {
      if (
        event.target === card &&
        event.propertyName === "transform" &&
        !card.classList.contains("is-tilting")
      ) {
        window.clearTimeout(cleanupTimer);
        card.style.removeProperty("will-change");
      }
    });
  });
}

function initPointerSurfaces() {
  if (motionReduced || !finePointer) return;
  const surfaces = document.querySelectorAll(
    ".catalog-card, .order-contact-panel, .social-panel, .contact-card-page",
  );

  surfaces.forEach((surface) => {
    let bounds = null;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      if (!bounds) return;
      surface.style.setProperty("--pointer-x", `${pointerX - bounds.left}px`);
      surface.style.setProperty("--pointer-y", `${pointerY - bounds.top}px`);
    };
    const reset = () => {
      surface.classList.remove("is-pointer-active");
      bounds = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    surface.classList.add("interaction-surface");
    surface.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      bounds = surface.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      render();
      surface.classList.add("is-pointer-active");
    });
    surface.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || !bounds) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    });
    surface.addEventListener("pointerleave", reset);
    surface.addEventListener("pointercancel", reset);
  });
}

function initHeroPointer() {
  const stage = document.querySelector(".visual-stage");
  if (!stage || motionReduced || !finePointer) return;

  let bounds = null;
  let pointerX = 0;
  let pointerY = 0;
  let pointerFrame = 0;
  let lastFrameTime = 0;
  let pointerActive = false;
  const current = {
    heroX: 0,
    heroY: 0,
    stageX: 0,
    stageY: 0,
  };
  const target = { ...current };

  const applyPosition = ({ heroX, heroY, stageX, stageY }) => {
    current.heroX = heroX;
    current.heroY = heroY;
    current.stageX = stageX;
    current.stageY = stageY;
    stage.style.setProperty("--hero-x", `${heroX}px`);
    stage.style.setProperty("--hero-y", `${heroY}px`);
    stage.style.setProperty("--stage-x", `${stageX}px`);
    stage.style.setProperty("--stage-y", `${stageY}px`);
  };

  const updateTarget = () => {
    if (!bounds?.width || !bounds?.height) return;
    const localX = pointerX - bounds.left;
    const localY = pointerY - bounds.top;
    const x = localX / bounds.width - 0.5;
    const y = localY / bounds.height - 0.5;
    stage.style.setProperty("--stage-pointer-x", `${localX}px`);
    stage.style.setProperty("--stage-pointer-y", `${localY}px`);
    target.heroX = x * 10;
    target.heroY = y * 7;
    target.stageX = x * 6;
    target.stageY = y * 6;
  };

  const render = (time) => {
    const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 40) : 16;
    lastFrameTime = time;
    const response = pointerActive ? 105 : 165;
    const blend = 1 - Math.exp(-elapsed / response);
    const next = {
      heroX: current.heroX + (target.heroX - current.heroX) * blend,
      heroY: current.heroY + (target.heroY - current.heroY) * blend,
      stageX: current.stageX + (target.stageX - current.stageX) * blend,
      stageY: current.stageY + (target.stageY - current.stageY) * blend,
    };
    applyPosition(next);

    const remaining = Math.max(
      Math.abs(target.heroX - next.heroX),
      Math.abs(target.heroY - next.heroY),
      Math.abs(target.stageX - next.stageX),
      Math.abs(target.stageY - next.stageY),
    );

    if (remaining > 0.01) {
      pointerFrame = requestAnimationFrame(render);
    } else {
      applyPosition(target);
      pointerFrame = 0;
      lastFrameTime = 0;
    }
  };

  const requestRender = () => {
    if (!pointerFrame) pointerFrame = requestAnimationFrame(render);
  };

  const reset = ({ immediate = false } = {}) => {
    bounds = null;
    pointerActive = false;
    stage.classList.remove("is-glow-active");
    target.heroX = 0;
    target.heroY = 0;
    target.stageX = 0;
    target.stageY = 0;

    if (immediate) {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      lastFrameTime = 0;
      applyPosition(target);
      return;
    }

    requestRender();
  };

  stage.classList.add("interactive-stage");
  stage.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    bounds = stage.getBoundingClientRect();
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    stage.classList.add("is-glow-active");
    updateTarget();
    requestRender();
  });
  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || !bounds) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    updateTarget();
    requestRender();
  });
  stage.addEventListener("pointerleave", reset);
  stage.addEventListener("pointercancel", reset);
  window.addEventListener("blur", () => reset({ immediate: true }));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reset({ immediate: true });
  });
}

async function initImageLoading() {
  let availableAssets = new Set();

  try {
    const response = await fetch("assets/image-manifest.json", {
      cache: "no-cache",
    });
    if (response.ok) {
      const manifest = await response.json();
      availableAssets = new Set(
        Array.isArray(manifest.available) ? manifest.available : [],
      );
    }
  } catch {
    // Placeholders remain visible when opened directly from the file system.
  }

  const images = document.querySelectorAll("img[data-future-src]");

  images.forEach((image) => {
    const source = image.dataset.futureSrc;
    if (!source || !availableAssets.has(source)) return;

    image.decoding = "async";
    image.addEventListener(
      "load",
      async () => {
        try {
          await image.decode();
        } catch {
          // The load event is sufficient when decode() is unavailable.
        }

        const frame = image.parentElement;
        const placeholder = frame?.querySelector(
          ".visual-stage, .mini-product-placeholder, .future-product-placeholder, .detail-placeholder, .production-placeholder",
        );
        placeholder?.setAttribute("aria-hidden", "true");
        frame?.closest("figure[aria-label]")?.removeAttribute("aria-label");
        requestAnimationFrame(() => frame?.classList.add("has-loaded-image"));
      },
      { once: true },
    );
    image.addEventListener(
      "error",
      () => {
        image.hidden = true;
        image.removeAttribute("src");
      },
      { once: true },
    );
    image.hidden = false;
    image.src = source;
  });

}

function initMarquee() {
  const marquee = document.querySelector(".fact-marquee");
  const track = marquee?.querySelector(".fact-marquee-track");
  const source = track?.querySelector(".fact-marquee-group");
  if (!marquee || !track || !source || motionReduced) return;

  let frame = 0;
  const build = () => {
    track
      .querySelectorAll(".fact-marquee-group:not(:first-child)")
      .forEach((copy) => copy.remove());
    const groupWidth = source.getBoundingClientRect().width;
    if (!groupWidth) return;

    const copies = Math.max(2, Math.ceil(marquee.clientWidth / groupWidth) + 2);
    for (let index = 1; index < copies; index += 1) {
      const copy = source.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.append(copy);
    }
    track.style.setProperty("--marquee-translate", `${groupWidth * -1}px`);
    track.style.setProperty(
      "--marquee-duration",
      `${Math.max(16, groupWidth / 48)}s`,
    );
  };

  const requestBuild = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      build();
    });
  };

  build();
  document.fonts?.ready.then(requestBuild);
  if ("ResizeObserver" in window) {
    new ResizeObserver(requestBuild).observe(marquee);
  } else {
    window.addEventListener("resize", requestBuild);
  }
}

function initSiteScrollbar() {
  const header = document.querySelector(".site-header");
  const main = document.querySelector("main");
  if (!header || !main) return;

  const scrollbar = document.createElement("div");
  scrollbar.className = "site-scrollbar";
  scrollbar.tabIndex = 0;
  scrollbar.setAttribute("role", "scrollbar");
  scrollbar.setAttribute("aria-label", "Sahifani aylantirish");
  // The visual track is horizontal, while its value controls vertical page scroll.
  scrollbar.setAttribute("aria-orientation", "vertical");
  scrollbar.setAttribute("aria-valuemin", "0");
  scrollbar.setAttribute("aria-valuemax", "100");
  scrollbar.setAttribute("aria-valuenow", "0");
  scrollbar.setAttribute("aria-controls", main.id);
  scrollbar.title = "Sahifani aylantirish";
  scrollbar.innerHTML = `
    <span class="site-scrollbar-progress" aria-hidden="true"></span>
    <span class="site-scrollbar-thumb" aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        <path d="M50 0C50 27.614 72.386 50 100 50C72.386 50 50 72.386 50 100C50 72.386 27.614 50 0 50C27.614 50 50 27.614 50 0Z"></path>
      </svg>
    </span>`;
  header.append(scrollbar);
  root.classList.add("has-site-scrollbar");

  const getRange = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  let idleTimer = 0;
  let dragging = false;

  const showActivity = () => {
    if (scrollbar.classList.contains("is-disabled")) return;
    scrollbar.classList.add("is-scrolling");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!dragging) scrollbar.classList.remove("is-scrolling");
    }, 620);
  };

  const update = ({ isScroll = false } = {}) => {
    const range = getRange();
    const ratio = range > 0 ? clamp(window.scrollY / range, 0, 1) : 0;
    const percentage = Math.round(ratio * 100);
    const trackWidth = scrollbar.clientWidth;
    const thumbX = 15 + ratio * Math.max(0, trackWidth - 30);

    scrollbar.style.setProperty("--scroll-ratio", String(ratio));
    scrollbar.style.setProperty("--scroll-thumb-x", `${thumbX}px`);
    scrollbar.setAttribute("aria-valuenow", String(percentage));
    scrollbar.setAttribute("aria-valuetext", `${percentage}%`);
    scrollbar.classList.toggle("is-disabled", range === 0);
    scrollbar.tabIndex = range > 0 ? 0 : -1;
    scrollbar.setAttribute("aria-disabled", String(range === 0));
    if (isScroll) showActivity();
  };

  const scrollFromPointer = (clientX) => {
    const bounds = scrollbar.getBoundingClientRect();
    if (!bounds.width) return;
    const ratio = clamp((clientX - bounds.left) / bounds.width, 0, 1);
    window.scrollTo({ top: ratio * getRange(), left: 0, behavior: "auto" });
  };

  scrollbar.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (scrollbar.classList.contains("is-disabled")) return;
    dragging = true;
    scrollbar.classList.add("is-dragging", "is-scrolling");
    scrollbar.setPointerCapture(event.pointerId);
    scrollFromPointer(event.clientX);
    event.preventDefault();
  });
  scrollbar.addEventListener("pointermove", (event) => {
    if (dragging) scrollFromPointer(event.clientX);
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    scrollbar.classList.remove("is-dragging");
    showActivity();
    if (scrollbar.hasPointerCapture(event.pointerId)) {
      scrollbar.releasePointerCapture(event.pointerId);
    }
  };
  scrollbar.addEventListener("pointerup", stopDragging);
  scrollbar.addEventListener("pointercancel", stopDragging);

  scrollbar.addEventListener("keydown", (event) => {
    const range = getRange();
    if (!range) return;
    const smallStep = Math.max(48, window.innerHeight * 0.1);
    const largeStep = window.innerHeight * 0.82;
    let next = null;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = window.scrollY - smallStep;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = window.scrollY + smallStep;
    } else if (event.key === "PageUp") {
      next = window.scrollY - largeStep;
    } else if (event.key === "PageDown") {
      next = window.scrollY + largeStep;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = range;
    } else {
      return;
    }

    event.preventDefault();
    window.scrollTo(0, clamp(next, 0, range));
  });

  addScrollTask(update);
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => requestScrollFrame({ isResize: true })).observe(
      document.body,
    );
  }
}

function initCustomCursor() {
  if (!finePointer) return;
  const cursor = document.createElement("div");
  cursor.className = "site-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="site-cursor-dot"></span>';
  document.body.append(cursor);
  root.classList.add("has-custom-cursor");

  const storageKey = "best-friends-cursor-position";
  const controlSelector =
    'a, button, summary, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
  let pointerX = null;
  let pointerY = null;
  let frame = 0;

  const render = () => {
    frame = 0;
    if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY)) return;
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursor.classList.add("is-visible");
  };

  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (
      Number.isFinite(stored?.x) &&
      Number.isFinite(stored?.y) &&
      stored.x >= 0 &&
      stored.x <= window.innerWidth &&
      stored.y >= 0 &&
      stored.y <= window.innerHeight
    ) {
      pointerX = stored.x;
      pointerY = stored.y;
      render();
    }
  } catch {
    // Cursor tracking works without storage.
  }

  const remember = () => {
    if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY)) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ x: pointerX, y: pointerY }));
    } catch {
      // Strict privacy modes can disable storage.
    }
  };

  const hide = () =>
    cursor.classList.remove("is-visible", "is-pressed", "is-over-control");

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
      const target = event.target instanceof Element ? event.target : null;
      cursor.classList.toggle(
        "is-over-control",
        Boolean(target?.closest(controlSelector) && !target.closest(".site-scrollbar")),
      );
    },
    { passive: true },
  );
  window.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") {
      hide();
      return;
    }
    pointerX = event.clientX;
    pointerY = event.clientY;
    remember();
    cursor.classList.add("is-pressed");
  });
  window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  window.addEventListener("pointercancel", hide);
  window.addEventListener("touchstart", hide, { passive: true });
  window.addEventListener("blur", hide);
  window.addEventListener("pagehide", remember);
  root.addEventListener("mouseleave", hide);
}

function initFooterFinale() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  const finale = document.createElement("div");
  finale.className = "brand-finale";
  finale.setAttribute("aria-label", "Best Friends");

  const glyphs = {
    B: { width: 1178.34, height: 1500 },
    E: { width: 1095.2, height: 1500 },
    S: { width: 972.4, height: 1550 },
    T: { width: 1218, height: 1500 },
    F: { width: 1052.4, height: 1500, split: 1020, stopRatio: 0.66, stems: [{ x: 179.1, width: 224.5 }] },
    R: { width: 1358, height: 1511.4, split: 1150, stopRatio: 1, stems: [{ x: 213.54, width: 224.46 }, { x: 907.68, width: 241.33 }] },
    I: { width: 683.6, height: 1500, split: 760, stopRatio: 0.33, stems: [{ x: 219.09, width: 224.57 }] },
    N: { width: 1400.34, height: 1520 },
    D: { width: 1313.6, height: 1500 },
  };

  const createWord = (word, className) => {
    const letters = [...word].map((letter, index) => {
      const glyph = glyphs[letter];
      const ratio = glyph.width / glyph.height;
      const stretchable = className === "brand-finale__friends" && glyph.stems;
      const reference = `assets/finale-glyphs.svg#finale-${letter.toLowerCase()}`;

      if (!stretchable) {
        return `<i style="--glyph-ratio: ${ratio}"><svg viewBox="0 0 ${glyph.width} ${glyph.height}" focusable="false" aria-hidden="true"><use href="${reference}"></use></svg></i>`;
      }

      const clipId = `finale-${letter.toLowerCase()}-${index}`;
      const bridges = glyph.stems.map((stem) =>
        `<rect data-letter-bridge x="${stem.x}" y="${glyph.split - 1.5}" width="${stem.width}" height="3"></rect>`,
      ).join("");
      return `<i data-glyph-height="${glyph.height}" data-stop-ratio="${glyph.stopRatio}" style="--glyph-ratio: ${ratio}"><svg viewBox="0 0 ${glyph.width} ${glyph.height}" focusable="false" aria-hidden="true"><defs><clipPath id="${clipId}-top" clipPathUnits="userSpaceOnUse"><rect width="${glyph.width}" height="${glyph.split}"></rect></clipPath><clipPath id="${clipId}-bottom" clipPathUnits="userSpaceOnUse"><rect y="${glyph.split}" width="${glyph.width}" height="${glyph.height - glyph.split}"></rect></clipPath></defs><g clip-path="url(#${clipId}-top)"><use href="${reference}"></use></g><g class="brand-finale__bridges">${bridges}</g><g data-letter-bottom><g clip-path="url(#${clipId}-bottom)"><use href="${reference}"></use></g></g></svg></i>`;
    }).join("");
    return `<span class="brand-finale__word ${className}" aria-hidden="true">${letters}</span>`;
  };

  finale.innerHTML = createWord("BEST", "brand-finale__best") +
    createWord("FRIENDS", "brand-finale__friends");
  footer.before(finale);

  const referenceGlyph = finale.querySelector(".brand-finale__friends svg");
  const bestLetters = [...finale.querySelectorAll(".brand-finale__best i")];
  const letters = [...finale.querySelectorAll(".brand-finale__friends [data-glyph-height]")].map((letter) => ({
    element: letter,
    bottom: letter.querySelector("[data-letter-bottom]"),
    bridges: [...letter.querySelectorAll("[data-letter-bridge]")],
    svg: letter.querySelector("svg"),
    glyphHeight: Number(letter.dataset.glyphHeight) || 0,
    stopRatio: Number(letter.dataset.stopRatio) || 1,
    current: 0,
    target: 0,
  }));
  let syncedHeight = 0;
  let motionFrame = 0;
  let previousTime = 0;

  const syncHeight = () => {
    const height = referenceGlyph?.getBoundingClientRect().height;
    if (!height || Math.abs(height - syncedHeight) <= 0.1) return;
    syncedHeight = height;
    finale.style.setProperty("--finale-letter-height", `${height}px`);
    bestLetters.forEach((letter) => {
      const ratio = Number(letter.style.getPropertyValue("--glyph-ratio"));
      letter.style.width = `${height * ratio}px`;
    });
  };

  const render = (letter, extension) => {
    letter.bottom?.setAttribute("transform", `translate(0 ${extension.toFixed(2)})`);
    letter.bridges.forEach((bridge) => {
      bridge.setAttribute("height", (extension + 3).toFixed(2));
    });
  };

  const animate = (time) => {
    if (document.hidden) {
      motionFrame = 0;
      previousTime = 0;
      return;
    }
    const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
    const ease = 1 - Math.exp(-elapsed / 145);
    let moving = false;
    letters.forEach((letter) => {
      const difference = letter.target - letter.current;
      if (Math.abs(difference) <= 0.15) {
        letter.current = letter.target;
      } else {
        letter.current += difference * ease;
        moving = true;
      }
      render(letter, letter.current);
    });
    previousTime = time;
    if (moving) motionFrame = requestAnimationFrame(animate);
    else {
      motionFrame = 0;
      previousTime = 0;
    }
  };

  const updateTargets = ({ isResize = false, immediate = false } = {}) => {
    if (isResize || !syncedHeight) syncHeight();
    const finaleBounds = finale.getBoundingClientRect();

    if (finaleBounds.top > window.innerHeight + 120 || finaleBounds.bottom < -120) {
      letters.forEach((letter) => { letter.target = 0; });
    } else {
      const viewportClearance = Math.max(20, Math.min(42, window.innerHeight * 0.04));
      const footerClearance = 32;
      letters.forEach((letter) => {
        const bounds = letter.svg?.getBoundingClientRect();
        if (!bounds?.height || !letter.glyphHeight) return;
        const normalBottom = bounds.top + bounds.height;
        const magnetic = Math.max(0, window.innerHeight - viewportClearance - normalBottom);
        const maximum = Math.max(
          0,
          (finaleBounds.bottom - footerClearance - normalBottom) * letter.stopRatio,
        );
        const pixels = Math.min(magnetic, maximum);
        letter.target = pixels * (letter.glyphHeight / bounds.height);
      });
    }

    if (immediate) {
      letters.forEach((letter) => {
        letter.current = letter.target;
        render(letter, letter.current);
      });
    } else if (!motionFrame) {
      motionFrame = requestAnimationFrame(animate);
    }
  };

  syncHeight();
  if (motionReduced) {
    letters.forEach((letter) => render(letter, 0));
  } else {
    updateTargets({ isResize: true, immediate: true });
    addScrollTask(updateTargets);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateTargets({ isResize: true });
    });
  }
}

function initAmbientVisibility() {
  const update = () => root.classList.toggle("motion-paused", document.hidden);
  document.addEventListener("visibilitychange", update);
  update();
}

function initCardCopy() {
  const buttons = document.querySelectorAll("[data-copy-card]");
  if (!buttons.length) return;

  const fallbackCopy = (value) => {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  };

  buttons.forEach((button) => {
    let statusTimer = 0;
    button.addEventListener("click", async () => {
      const number = button.dataset.copyCard;
      const status = button.parentElement?.querySelector("[data-copy-status]");
      if (!number || !status) return;

      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(number);
          copied = true;
        } else {
          copied = fallbackCopy(number);
        }
      } catch {
        copied = fallbackCopy(number);
      }

      status.textContent = copied
        ? "Karta raqami nusxalandi"
        : "Karta raqamini nusxalab bo‘lmadi";
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(() => {
        status.textContent = "";
      }, 2600);
    });
  });
}

function initializeSite() {
  initCurrentYear();
  initMobileMenu();
  initHeaderScrollState();
  initPageEntrance();
  const counterController = initPriceAnimation();
  const revealController = initScrollReveals(counterController);
  initScrollParallax(revealController?.parallaxItems);
  initSectionScrollProgress(revealController?.scrollProgressItems);
  initPageTransitions();
  initMagneticButtons();
  initRadialButtons();
  initProductTilt();
  initPointerSurfaces();
  initHeroPointer();
  initImageLoading();
  initMarquee();
  initSiteScrollbar();
  initCustomCursor();
  initFooterFinale();
  initAmbientVisibility();
  initCardCopy();
  requestScrollFrame({ isResize: true });
}

initializeSite();
