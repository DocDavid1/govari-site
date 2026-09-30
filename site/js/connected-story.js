(function () {
  "use strict";

  function init() {
    var story = document.getElementById("connected-story");
    if (!story) return;

    var steps = Array.from(story.querySelectorAll(".build-step[data-step]"));
    var buttons = Array.from(story.querySelectorAll("[data-build-go]"));
    var progress = story.querySelector(".build-progress span");
    var phaseNames = [
      "components",
      "installation",
      "four_channels",
      "phone",
      "gps",
      "summary",
    ];
    var tracked = new Set();
    var activePhase = -1;
    var timeline = null;
    var trigger = null;
    var context = null;
    var observer = null;
    var animated = false;
    var originalStepState = steps.map(function (step) {
      return { hidden: step.getAttribute("aria-hidden"), inert: step.inert };
    });
    var media = window.matchMedia(
      "(min-width: 981px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
    );

    function trackPhase(index) {
      if (tracked.has(index) || typeof window.govariTrack !== "function")
        return;
      try {
        window.govariTrack("product_engagement", {
          location: "connected_story",
          phase: index + 1,
          phase_name: phaseNames[index],
        });
        tracked.add(index);
      } catch (_) {
        /* Analytics must never interrupt the product story. */
      }
    }

    function activate(index, shouldTrack) {
      index = Math.max(0, Math.min(5, index));
      if (shouldTrack) trackPhase(index);
      if (index === activePhase) return;
      activePhase = index;
      steps.forEach(function (step) {
        var current = Number(step.dataset.step) === index;
        step.classList.toggle("is-active", current);
        if (animated) {
          step.setAttribute("aria-hidden", current ? "false" : "true");
          step.inert = !current;
        }
      });
      buttons.forEach(function (button) {
        var current = Number(button.dataset.buildGo) === index;
        button.classList.toggle("is-active", current);
        if (current) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
      if (!animated && progress)
        progress.style.width = ((index + 1) / 6) * 100 + "%";
    }

    function observeStaticSteps() {
      if (observer) observer.disconnect();
      if (!("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated)
              activate(Number(entry.target.dataset.step), true);
          });
        },
        { threshold: 0.45 },
      );
      steps.forEach(function (step) {
        observer.observe(step);
      });
    }

    function restoreStatic() {
      if (context) {
        context.revert();
        context = null;
      }
      timeline = null;
      trigger = null;
      animated = false;
      story.classList.remove("is-animated");
      steps.forEach(function (step, index) {
        var original = originalStepState[index];
        if (original.hidden === null) step.removeAttribute("aria-hidden");
        else step.setAttribute("aria-hidden", original.hidden);
        step.inert = original.inert;
      });
      activePhase = -1;
      activate(0, false);
      observeStaticSteps();
    }

    function enableAnimation() {
      var gsap = window.gsap;
      var ScrollTrigger = window.ScrollTrigger;
      if (!media.matches || !gsap || !ScrollTrigger || animated) return;
      var pin = story.querySelector(".build-pin");
      var visual = story.querySelector(".build-visual");
      var camera = story.querySelector(".build-camera");
      var parts = Array.from(story.querySelectorAll(".build-part"));
      var install = story.querySelector(".build-install");
      var rear = story.querySelector(".build-rear");
      var channels = story.querySelector(".build-channels");
      var phone = story.querySelector(".build-phone");
      var signal = story.querySelector(".build-signal");
      var route = story.querySelector(".build-route");
      var path = story.querySelector("#journey-route");
      var dot = story.querySelector("#journey-dot");
      var summary = story.querySelector(".build-summary");
      if (
        !pin ||
        !visual ||
        !camera ||
        parts.length !== 6 ||
        steps.length !== 6 ||
        !install ||
        !rear ||
        !channels ||
        !phone ||
        !signal ||
        !route ||
        !path ||
        !dot ||
        !summary
      )
        return;

      try {
        var pathLength = path.getTotalLength();
        if (!pathLength) return;
        gsap.registerPlugin(ScrollTrigger);
        if (observer) observer.disconnect();
        context = gsap.context(function () {}, story);
        context.add(function () {
          animated = true;
          story.classList.add("is-animated");
          activePhase = -1;
          activate(0, false);
          gsap.set(camera, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
          });
          gsap.set(parts, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            rotation: 0,
            autoAlpha: 0,
          });
          gsap.set([install, rear, channels, phone, signal, route, summary], {
            autoAlpha: 0,
          });
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
          var journey = { position: 0 };
          var firstPoint = path.getPointAtLength(0);
          // SVG coordinates keep the marker on the route at every viewport size.
          gsap.set(dot, { attr: { cx: firstPoint.x, cy: firstPoint.y } });
          var setDot = function () {
            var point = path.getPointAtLength(pathLength * journey.position);
            dot.setAttribute("cx", point.x);
            dot.setAttribute("cy", point.y);
          };

          timeline = gsap.timeline({
            defaults: { ease: "power1.inOut" },
            onUpdate: function () {
              activate(
                Math.min(5, Math.floor(timeline.time())),
                Boolean(trigger && trigger.isActive),
              );
              if (progress)
                progress.style.width = timeline.progress() * 100 + "%";
            },
          });
          phaseNames.forEach(function (name, index) {
            timeline.addLabel(name, index);
          });

          // 0: the assembled device gently opens into its six callouts.
          timeline.to(
            parts,
            {
              autoAlpha: 1,
              x: function (_, part) {
                return (
                  (visual.clientWidth * (Number(part.dataset.x) || 0)) / 100
                );
              },
              y: function (_, part) {
                return (
                  (visual.clientHeight * (Number(part.dataset.y) || 0)) / 100
                );
              },
              rotation: function (_, part) {
                return Number(part.dataset.rotate) || 0;
              },
              duration: 0.58,
              stagger: 0.025,
            },
            0.1,
          );
          timeline.to(camera, { scale: 0.83, duration: 0.6 }, 0.1);

          // 1: the pieces return, then the front and rear installation appears.
          timeline.to(
            parts,
            { x: 0, y: 0, rotation: 0, autoAlpha: 0, duration: 0.3 },
            1,
          );
          timeline.to(install, { autoAlpha: 1, duration: 0.42 }, 1.22);
          timeline.to(
            camera,
            {
              x: function () {
                return visual.clientWidth * 0.14;
              },
              y: function () {
                return -visual.clientHeight * 0.005;
              },
              scale: 0.23,
              duration: 0.55,
            },
            1.2,
          );
          timeline.to(rear, { autoAlpha: 1, duration: 0.4 }, 1.48);

          // 2: all four channels share one composed view.
          timeline.to([camera, rear], { autoAlpha: 0, duration: 0.25 }, 2);
          timeline.to(install, { autoAlpha: 0, duration: 0.3 }, 2);
          timeline.to(channels, { autoAlpha: 1, duration: 0.5 }, 2.1);

          // 3: the remote view moves to the phone, with a subtle signal cue.
          timeline.to(channels, { autoAlpha: 0, duration: 0.32 }, 3);
          timeline.to(install, { autoAlpha: 0, duration: 0.32 }, 3);
          timeline.fromTo(
            phone,
            { y: 24, scale: 0.96 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.55 },
            3.1,
          );
          timeline.fromTo(
            signal,
            { scale: 0.88 },
            { scale: 1, autoAlpha: 1, duration: 0.45 },
            3.35,
          );

          // 4: draw the route and move its marker using the same progress value.
          timeline.to([phone, signal], { autoAlpha: 0, duration: 0.3 }, 4);
          timeline.to(route, { autoAlpha: 1, duration: 0.3 }, 4.08);
          timeline.to(
            path,
            { strokeDashoffset: 0, ease: "none", duration: 0.7 },
            4.22,
          );
          timeline.to(
            journey,
            { position: 1, ease: "none", duration: 0.7, onUpdate: setDot },
            4.22,
          );

          // 5: a quiet hold on the offer leaves time to read or continue.
          timeline.to(route, { autoAlpha: 0, duration: 0.3 }, 5);
          timeline.fromTo(
            summary,
            { y: 18 },
            { y: 0, autoAlpha: 1, duration: 0.5 },
            5.1,
          );
          timeline.to({}, { duration: 0.4 }, 5.6);

          trigger = ScrollTrigger.create({
            trigger: story,
            animation: timeline,
            pin: pin,
            start: "top top",
            end: "+=4200",
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: function () {
              activate(Math.min(5, Math.floor(timeline.time())), true);
            },
            onEnterBack: function () {
              activate(Math.min(5, Math.floor(timeline.time())), true);
            },
          });
        });
      } catch (_) {
        // Partial setup must never leave the static content hidden or pinned.
        restoreStatic();
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.dataset.buildGo);
        if (!Number.isInteger(index) || index < 0 || index > 5) return;
        if (animated && trigger && timeline) {
          var moment = index + (index === 4 ? 0.88 : 0.75);
          window.scrollTo({
            top:
              trigger.start +
              ((trigger.end - trigger.start) * moment) / timeline.duration(),
            behavior: "smooth",
          });
        } else {
          var step = steps.find(function (item) {
            return Number(item.dataset.step) === index;
          });
          if (step)
            step.scrollIntoView({
              block: "center",
              behavior: media.matches ? "smooth" : "auto",
            });
          activate(index, true);
        }
      });
    });

    function updateMode() {
      if (media.matches) enableAnimation();
      else if (animated) restoreStatic();
    }
    restoreStatic();
    updateMode();
    if (media.addEventListener) media.addEventListener("change", updateMode);
    else media.addListener(updateMode);
    // Refresh after intrinsic image sizes/fonts settle, including restored pages.
    window.addEventListener(
      "load",
      function () {
        if (trigger) trigger.refresh();
      },
      { once: true },
    );
    window.addEventListener("pageshow", function (event) {
      if (event.persisted && trigger) trigger.refresh();
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
