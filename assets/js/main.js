const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  // Ouverture/fermeture du menu mobile principal.
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fermeture automatique apres clic sur un lien de navigation.
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveNavLink = () => {
  const currentPath = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("#site-nav a, .mobile-tabbar a").forEach((link) => {
    const target = String(link.getAttribute("href") || "").toLowerCase();
    if (target === currentPath) {
      link.classList.add("active");
    }
  });
};

setActiveNavLink();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealElements.length) {
  // Revele les blocs au scroll pour un rendu plus progressif.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const yearElement = document.querySelector("#year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const statusElement = carousel.querySelector("[data-carousel-status]");
  if (!viewport) return;

  const slides = Array.from(viewport.querySelectorAll(".carousel-slide"));
  if (slides.length < 2) return;

  const thumbButtons = Array.from(carousel.querySelectorAll("[data-carousel-go]"));
  const dots = [];
  let currentIndex = 0;
  let isTicking = false;
  let autoplayTimer = null;

  const normalizeIndex = (value) => ((value % slides.length) + slides.length) % slides.length;
  const prefersReducedMotion = typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAutoplay = carousel.dataset.carouselAutoplay === "true" && !prefersReducedMotion;
  const getGap = () => {
    const style = window.getComputedStyle(viewport);
    return Number.parseFloat(style.columnGap || style.gap || "0") || 0;
  };

  const updateDots = () => {
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const updateStatus = () => {
    if (!statusElement) return;
    statusElement.textContent = `${currentIndex + 1} / ${slides.length}`;
  };

  const updateThumbs = () => {
    thumbButtons.forEach((thumb, index) => {
      const isActive = index === currentIndex;
      thumb.classList.toggle("active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  // Fait defiler jusqu'a l'image cible en conservant une navigation circulaire.
  const goToSlide = (index, behavior = "smooth") => {
    currentIndex = normalizeIndex(index);
    const target = slides[currentIndex];
    viewport.scrollTo({
      left: target.offsetLeft,
      behavior
    });
    updateDots();
    updateStatus();
    updateThumbs();
  };

  const syncFromScroll = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const unit = slideWidth + getGap();
    if (unit <= 0) return;
    const nextIndex = normalizeIndex(Math.round(viewport.scrollLeft / unit));
    if (nextIndex !== currentIndex) {
      currentIndex = nextIndex;
      updateDots();
      updateStatus();
      updateThumbs();
    }
    isTicking = false;
  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    if (!canAutoplay || autoplayTimer) return;
    autoplayTimer = window.setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  };

  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Aller a l image ${index + 1}`);
      dot.setAttribute("aria-current", index === 0 ? "true" : "false");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
    updateDots();
  }

  if (thumbButtons.length) {
    thumbButtons.forEach((thumb, index) => {
      thumb.addEventListener("click", () => goToSlide(index));
    });
    updateThumbs();
  }

  updateStatus();

  prevButton?.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(currentIndex + 1));

  viewport.addEventListener("scroll", () => {
    if (isTicking) return;
    window.requestAnimationFrame(syncFromScroll);
    isTicking = true;
  }, { passive: true });

  // Autorise la navigation clavier quand le carrousel est focalise.
  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  if (canAutoplay) {
    startAutoplay();

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", () => {
      if (carousel.contains(document.activeElement)) return;
      startAutoplay();
    });
    carousel.addEventListener("touchstart", stopAutoplay, { passive: true });
    carousel.addEventListener("touchend", startAutoplay, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-toggle");
  const content = item.querySelector(".faq-content");
  if (!button || !content) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    content.style.maxHeight = isOpen ? `${content.scrollHeight + 24}px` : "0";
  });
});

const analyticsConfig = window.MIE_A_MIE_ANALYTICS || {};
const gaId = String(analyticsConfig.gaMeasurementId || "").trim();
const gaEnabled = Boolean(analyticsConfig.enabled) && gaId.length > 0;

const ensureAnalytics = () => {
  // Le tracking n'est active que si la config GA est explicite.
  if (!gaEnabled) return false;
  if (!window.dataLayer) window.dataLayer = [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  const scriptExists = document.querySelector(`script[data-ga-id="${gaId}"]`);
  if (!scriptExists) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    script.dataset.gaId = gaId;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
  return true;
};

const canTrack = ensureAnalytics();

const trackEvent = (eventName, params = {}) => {
  if (!canTrack || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    event_category: "engagement",
    page_path: window.location.pathname,
    ...params
  });
};

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    const eventName = String(element.dataset.track || "").trim();
    if (!eventName) return;

    const label = element.getAttribute("href") || element.textContent?.trim() || "cta";
    trackEvent(eventName, { event_label: label });
  });
});
