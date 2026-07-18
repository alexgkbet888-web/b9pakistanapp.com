(function () {
  const REGISTER_URL = "https://b9.game/refer/MDMxMjMxMjM1NTU=";
  const STORAGE_KEY = "b9_seo_event_counts";
  const GA_MEASUREMENT_ID = "G-9JYSBM6CXG";

  function readCounts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeCount(name) {
    try {
      const counts = readCounts();
      counts[name] = (counts[name] || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    } catch (error) {}
  }

  function pushEvent(name, params) {
    const payload = Object.assign({
      event: name,
      page_path: location.pathname,
      page_title: document.title,
      host: location.hostname,
      timestamp: new Date().toISOString()
    }, params || {});

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    writeCount(name);
  }

  function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || window.__b9GaLoaded === GA_MEASUREMENT_ID) return;
    window.__b9GaLoaded = GA_MEASUREMENT_ID;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: true,
      anonymize_ip: true
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function ctaPosition(link) {
    if (link.classList.contains("mobile-register-cta")) return "mobile_fixed";
    if (link.closest(".mobile-fixed-cta")) return "mobile_fixed";
    if (link.closest(".hero")) return "hero";
    if (link.closest("header")) return "header";
    if (link.closest("footer")) return "footer";
    return "content";
  }

  function bindRegisterClicks() {
    const links = Array.from(document.querySelectorAll("a[href='" + REGISTER_URL + "']"));
    links.forEach((link, index) => {
      if (link.dataset.b9Tracked === "true") return;
      link.dataset.b9Tracked = "true";
      link.dataset.ctaIndex = String(index + 1);
      link.addEventListener("click", () => {
        pushEvent("register_click", {
          cta_text: (link.textContent || "").trim(),
          cta_index: index + 1,
          cta_position: ctaPosition(link),
          target_url: REGISTER_URL
        });
      });
    });
  }

  function bindSearch() {
    const fields = Array.from(document.querySelectorAll("[data-search]"));
    fields.forEach((field) => {
      if (field.dataset.b9SearchTracked === "true") return;
      field.dataset.b9SearchTracked = "true";
      let timer = 0;
      field.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const query = String(field.value || "").trim();
          if (query.length >= 2) {
            pushEvent("site_search", {
              query_length: query.length
            });
          }
        }, 700);
      });
    });
  }

  function bindGameFilters() {
    const buttons = Array.from(document.querySelectorAll("[data-game-filter]"));
    buttons.forEach((button) => {
      if (button.dataset.b9FilterTracked === "true") return;
      button.dataset.b9FilterTracked = "true";
      button.addEventListener("click", () => {
        pushEvent("game_filter_click", {
          filter: button.dataset.gameFilter || "unknown",
          label: (button.textContent || "").trim()
        });
      });
    });
  }

  function init() {
    window.addEventListener("load", () => setTimeout(loadGoogleAnalytics, 1200), { once: true });
    bindRegisterClicks();
    bindSearch();
    bindGameFilters();
    pushEvent("page_view_ready", {
      register_cta_count: document.querySelectorAll("a[href='" + REGISTER_URL + "']").length
    });
  }

  window.B9Analytics = {
    event: pushEvent,
    getLocalCounts: readCounts
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
