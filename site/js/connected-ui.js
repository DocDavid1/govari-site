(function () {
  "use strict";
  const root = document.documentElement,
    theme = document.querySelector(".theme-switch"),
    menu = document.querySelector(".menu-toggle"),
    nav = document.getElementById("primary-nav");
  function setTheme(dark) {
    root.dataset.theme = dark ? "dark" : "light";
    theme.setAttribute("aria-pressed", String(dark));
    theme.setAttribute("aria-label", dark ? "מעבר למצב יום" : "מעבר למצב לילה");
    theme.firstElementChild.textContent = dark ? "☀" : "◐";
    document.querySelector('meta[name="theme-color"]').content = dark
      ? "#112329"
      : "#f6f8f8";
    try {
      localStorage.setItem("gav-theme", dark ? "dark" : "light");
    } catch (_) {}
  }
  setTheme(root.dataset.theme === "dark");
  theme.addEventListener("click", () =>
    setTheme(root.dataset.theme !== "dark"),
  );
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
  }
  menu.addEventListener("click", () =>
    setMenu(menu.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".connected-header")) setMenu(false);
  });
  const video = document.getElementById("roadFilm"),
    toggle = document.querySelector('[data-video-toggle="roadFilm"]'),
    reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyPaused = false;
  function syncVideo() {
    if (!video || !toggle) return;
    const paused = video.paused;
    toggle.textContent = paused ? "הפעלת הסרטון" : "השהיית הסרטון";
    toggle.setAttribute(
      "aria-label",
      paused ? "הפעלת סרטון הרקע" : "השהיית סרטון הרקע",
    );
    toggle.setAttribute("aria-pressed", String(!video.paused));
  }
  function markVideoUnavailable() {
    video.closest(".windshield")?.classList.add("video-unavailable");
  }
  video.addEventListener("play", syncVideo);
  video.addEventListener("pause", syncVideo);
  video.addEventListener("error", markVideoUnavailable);
  video.addEventListener("canplay", () =>
    video.closest(".windshield")?.classList.remove("video-unavailable"),
  );
  toggle.addEventListener("click", () => {
    if (video.paused) {
      manuallyPaused = false;
      video.play().catch(syncVideo);
    } else {
      manuallyPaused = true;
      video.pause();
    }
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (
            e.isIntersecting &&
            !reduced.matches &&
            !manuallyPaused &&
            !navigator.connection?.saveData
          ) {
            video.play().catch(syncVideo);
          } else video.pause();
        });
      },
      { threshold: 0.15 },
    ).observe(video);
    const sticky = document.querySelector(".mobile-action"),
      hero = document.querySelector(".connected-hero"),
      lead = document.getElementById("lead");
    let heroVisible = true,
      leadVisible = false;
    const update = () =>
      sticky.classList.toggle("is-visible", !heroVisible && !leadVisible);
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === hero) heroVisible = e.isIntersecting;
          else leadVisible = e.isIntersecting;
        });
        update();
      },
      { threshold: 0 },
    ).observe(hero);
    const lo = new IntersectionObserver(
      (entries) => {
        leadVisible = entries[0].isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    lo.observe(lead);

    const revealTargets = Array.from(
      document.querySelectorAll(
        ".trust-rail, .real-product-copy, .real-product-gallery figure, .section-heading, .benefit-grid article, .demo-section > div, .demo-section > video, .faq details",
      ),
    );
    if (revealTargets.length && !reduced.matches) {
      revealTargets.forEach((element) =>
        element.classList.add("reveal-on-scroll"),
      );
      root.classList.add("reveal-ready");
      const revealObserver = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in-view");
            currentObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
      );
      revealTargets.forEach((element) => revealObserver.observe(element));
    }
  }
  reduced.addEventListener("change", () => {
    if (reduced.matches) video.pause();
  });
  syncVideo();
})();
