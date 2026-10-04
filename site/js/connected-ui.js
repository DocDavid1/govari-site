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
    const label = video.paused ? "הפעלת סרטון הרקע" : "השהיית הסרטון";
    toggle.dataset.videoState = video.paused ? "paused" : "playing";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    toggle.setAttribute("aria-pressed", String(!video.paused));
  }
  video.addEventListener("play", syncVideo);
  video.addEventListener("pause", syncVideo);
  syncVideo();
  toggle.addEventListener("click", () => {
    if (video.paused) {
      manuallyPaused = false;
      video.play().catch(syncVideo);
    } else {
      manuallyPaused = true;
      video.pause();
    }
  });
  const heroSection = document.querySelector(".connected-hero"),
    heroCamera = document.querySelector(".hero-scene .camera-platform");
  if (heroSection && heroCamera) {
    const heroStart = heroSection.getBoundingClientRect().top + window.scrollY;
    let cameraFrame = 0;
    const updateCamera = () => {
      cameraFrame = 0;
      const progress = reduced.matches ? 0 : Math.max(
        0,
        Math.min(1, (window.scrollY - heroStart) / (window.innerHeight * 0.8)),
      );
      heroCamera.style.setProperty("--hero-camera-y", `${progress * -14}px`);
      heroCamera.style.setProperty(
        "--hero-camera-scale",
        String(1 + progress * 0.1),
      );
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!cameraFrame)
          cameraFrame = window.requestAnimationFrame(updateCamera);
      },
      { passive: true },
    );
    reduced.addEventListener("change", updateCamera);
    updateCamera();
  }
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
  }
  reduced.addEventListener("change", () => {
    if (reduced.matches) video.pause();
  });
  syncVideo();
})();
