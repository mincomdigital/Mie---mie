const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealElements.length) {
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
  window.gtag("config", gaId, {
    anonymize_ip: true
  });
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
