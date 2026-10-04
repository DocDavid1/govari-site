(function () {
  "use strict";
  const root = document.documentElement,
    theme = document.querySelector(".theme-switch"),
    menu = document.querySelector(".menu-toggle"),
    nav = document.getElementById("primary-nav");
  function setTheme(dark, remember) {
    root.dataset.theme = dark ? "dark" : "light";
    theme.setAttribute("aria-pressed", String(dark));
    theme.setAttribute("aria-label", dark ? "מעבר למצב יום" : "מעבר למצב לילה");
    theme.firstElementChild.textContent = dark ? "☀" : "◐";
    document.querySelector('meta[name="theme-color"]').content = dark
      ? "#112329"
      : "#f6f8f8";
    // Dark is the default; only an explicit choice is remembered.
    if (remember)
      try {
        localStorage.setItem("gav-theme-choice", dark ? "dark" : "light");
      } catch (_) {}
  }
  setTheme(root.dataset.theme === "dark");
  theme.addEventListener("click", () =>
    setTheme(root.dataset.theme !== "dark", true),
  );
  const scrim = document.querySelector(".menu-scrim");
  const sheet = matchMedia("(max-width: 980px)");
  function setMenu(open) {
    if (open && !sheet.matches) open = false;
    nav.classList.toggle("is-open", open);
    root.classList.toggle("menu-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    if (scrim) scrim.hidden = !open;
    if (open) {
      const first = nav.querySelector("a");
      if (first)
        setTimeout(() => {
          if (nav.classList.contains("is-open")) first.focus({ preventScroll: true });
        }, 60);
    }
  }
  menu.addEventListener("click", () =>
    setMenu(menu.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  if (scrim) scrim.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (menu.getAttribute("aria-expanded") !== "true") return;
    if (e.key === "Escape") {
      setMenu(false);
      menu.focus();
      return;
    }
    if (e.key !== "Tab") return;
    // Keep focus inside the open sheet (toggle + menu items).
    const items = [menu, ...nav.querySelectorAll("a[href]")];
    const first = items[0],
      last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!items.includes(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  });
  sheet.addEventListener("change", () => setMenu(false));
  const video = document.getElementById("roadFilm"),
    toggle = document.querySelector('[data-video-toggle="roadFilm"]'),
    reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let manuallyPaused = false;
  // Product tilt: the floating camera leans gently toward the pointer.
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const tilts = [
      ...document.querySelectorAll("[data-tilt] .lv-body"),
      ...document.querySelectorAll(".hero-scene .camera-platform"),
    ];
    tilts.forEach((body) => {
      const zone = body.closest("section, figure") || body.parentElement;
      let frame = 0;
      zone.addEventListener("pointermove", (e) => {
        if (reduced.matches || frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const r = zone.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          body.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
          body.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
        });
      });
      zone.addEventListener("pointerleave", () => {
        body.style.setProperty("--ry", "0deg");
        body.style.setProperty("--rx", "0deg");
      });
    });
  }
  // Exploded camera (mobile / static story): apart in the middle of the screen,
  // reassembled while entering and leaving.
  const xstages = [...document.querySelectorAll(".xplode--scroll")];
  if (xstages.length) {
    let xf = 0;
    const paintX = () => {
      xf = 0;
      xstages.forEach((st) => {
        if (!st.offsetParent) return;
        const r = st.getBoundingClientRect(),
          mid = r.top + r.height / 2,
          d = Math.abs(mid - innerHeight / 2) / (innerHeight * 0.62),
          p = reduced.matches ? 1 : Math.max(0, Math.min(1, (1 - d) * 1.7));
        const v = p.toFixed(3);
        if (st.dataset.p !== v) {
          st.dataset.p = v;
          st.style.setProperty("--p", v);
        }
      });
    };
    addEventListener("scroll", () => xf || (xf = requestAnimationFrame(paintX)), { passive: true });
    addEventListener("resize", paintX);
    reduced.addEventListener("change", paintX);
    paintX();
  }
  // WhatsApp process slider: auto-advances, pauses on hover/focus/touch and
  // for reduced motion; messages pop in on the active chat.
  document.querySelectorAll("[data-wa-slider]").forEach((slider) => {
    const track = slider.querySelector(".wa-track"),
      slides = [...track.children],
      dots = [...slider.querySelectorAll(".wa-dot")],
      pauseBtn = slider.querySelector("[data-wa-pause]");
    if (!slides.length) return;
    if (!reduced.matches) slider.classList.add("wa-anim");
    let index = 0,
      timer = 0,
      userPaused = reduced.matches,
      hovering = false,
      inView = false;
    const live = (i) => {
      slides.forEach((s, k) => {
        s.classList.toggle("is-live", k === i);
      });
      dots.forEach((d, k) =>
        k === i ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"),
      );
    };
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      const slide = slides[index];
      // RTL-safe: align the slide's start (right) edge with the track's.
      const delta =
        slide.getBoundingClientRect().right - track.getBoundingClientRect().right;
      track.scrollBy({ left: delta, behavior: reduced.matches ? "auto" : "smooth" });
      live(index);
    };
    const stop = () => {
      clearInterval(timer);
      timer = 0;
    };
    const start = () => {
      stop();
      if (userPaused || hovering || !inView || reduced.matches) return;
      timer = setInterval(() => go(index + 1), 5600);
    };
    slider.querySelector("[data-wa-next]").addEventListener("click", () => {
      go(index + 1);
      start();
    });
    slider.querySelector("[data-wa-prev]").addEventListener("click", () => {
      go(index - 1);
      start();
    });
    dots.forEach((d, k) =>
      d.addEventListener("click", () => {
        go(k);
        start();
      }),
    );
    pauseBtn.addEventListener("click", () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.setAttribute(
        "aria-label",
        userPaused ? "הפעלת ההחלפה האוטומטית" : "עצירת ההחלפה האוטומטית",
      );
      pauseBtn.innerHTML = userPaused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor"/></svg>';
      userPaused ? stop() : start();
    });
    if (reduced.matches) {
      pauseBtn.setAttribute("aria-pressed", "true");
      pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    }
    slider.addEventListener("pointerenter", () => {
      hovering = true;
      stop();
    });
    slider.addEventListener("pointerleave", () => {
      hovering = false;
      start();
    });
    slider.addEventListener("focusin", () => {
      hovering = true;
      stop();
    });
    slider.addEventListener("focusout", () => {
      hovering = false;
      start();
    });
    track.addEventListener("touchstart", stop, { passive: true });
    // Swipes: follow the chat that lands in view.
    let st = 0;
    track.addEventListener(
      "scroll",
      () => {
        clearTimeout(st);
        st = setTimeout(() => {
          const edge = track.getBoundingClientRect().right;
          let best = 0,
            dist = Infinity;
          slides.forEach((s, k) => {
            const d = Math.abs(s.getBoundingClientRect().right - edge);
            if (d < dist) {
              dist = d;
              best = k;
            }
          });
          if (best !== index) {
            index = best;
            live(index);
          }
        }, 120);
      },
      { passive: true },
    );
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting;
          if (inView && !slides.some((s) => s.classList.contains("is-live"))) live(index);
          inView ? start() : stop();
        },
        { threshold: 0.35 },
      ).observe(slider);
    } else {
      inView = true;
      live(0);
      start();
    }
  });
  // Feature cards: staggered reveal as the grid scrolls in.
  const cards = [...document.querySelectorAll(".benefit-grid article")];
  if (cards.length && "IntersectionObserver" in window && !reduced.matches) {
    root.classList.add("js-reveal");
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          reveal.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((c, i) => {
      c.style.setProperty("--i", String(i % 4));
      reveal.observe(c);
    });
  }
  // Inner pages share this header but have no hero film or lead form.
  if (!video || !toggle) {
    const sticky = document.querySelector(".mobile-action"),
      intro = document.querySelector(".page-hero"),
      closing = document.querySelector(".cta-band");
    if (sticky && intro && "IntersectionObserver" in window) {
      const seen = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        sticky.classList.toggle(
          "is-visible",
          ![...seen.values()].some(Boolean),
        );
      });
      io.observe(intro);
      if (closing) io.observe(closing);
    }
    return;
  }
  function syncVideo() {
    const label = video.paused ? "הפעלת סרטון הרקע" : "השהיית סרטון הרקע";
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
  const heroSection = document.querySelector(".hero-scene"),
    heroCamera = heroSection && heroSection.querySelector(".camera-platform");
  if (heroSection && heroCamera) {
    let cameraFrame = 0,
      lastP = "";
    const updateCamera = () => {
      cameraFrame = 0;
      // Reduced motion: show the separated, labelled view as a still image.
      const raw = reduced.matches
        ? 1
        : Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.32)));
      const p = (1 - Math.pow(1 - raw, 3)).toFixed(3);
      if (p === lastP) return;
      lastP = p;
      heroSection.style.setProperty("--p", p);
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
    const update = () => {
      sticky.classList.toggle("is-visible", !heroVisible && !leadVisible);
      // The film toggle only matters while the film is on screen.
      document.body.classList.toggle("hero-out", !heroVisible);
    };
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
  // Show which homepage section the visitor is in.
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll('a[href^="#"]')],
      watched = links
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean),
      seen = new Map(),
      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => seen.set(e.target, e.isIntersecting));
          const current = watched.find((el) => seen.get(el));
          links.forEach((a) => {
            if (current && a.getAttribute("href") === "#" + current.id)
              a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
    watched.forEach((el) => spy.observe(el));
  }
  syncVideo();
})();
