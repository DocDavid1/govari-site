// Read-only layout/interaction audit. Lead requests are covered by funnel-reliability.cjs.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict"),
  fs = require("node:fs");
const BASE = process.env.QA_BASE_URL || "http://localhost:3013",
  OUT = process.env.QA_OUTPUT_DIR || "/tmp/govari-connected-qa";
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const errors = [];
  for (const width of [320, 390, 430, 768, 1024, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 600 ? 844 : 960 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() =>
      localStorage.setItem("govari_analytics_consent_v1", "denied"),
    );
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await page.waitForTimeout(900);
    const roadFilm = await page.locator("#roadFilm").evaluate((video) => ({
      readyState: video.readyState,
      currentTime: video.currentTime,
      width: video.videoWidth,
      height: video.videoHeight,
      unavailable: video.closest(".windshield")?.classList.contains("video-unavailable"),
    }));
    assert.ok(roadFilm.readyState >= 2, `${width}: hero video is not ready`);
    assert.ok(roadFilm.currentTime > 0, `${width}: hero video did not start`);
    assert.equal(roadFilm.unavailable, false, `${width}: hero video fallback shown`);
    assert.deepEqual([roadFilm.width, roadFilm.height], [1280, 720]);
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") await page.locator(".theme-switch").click();
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.theme),
        theme,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${width}/${theme} horizontal overflow`,
      );
      await page.screenshot({ path: `${OUT}/hero-${width}-${theme}.png` });
    }
    await page.locator(".theme-switch").click();
    if (width <= 980) {
      await page.locator(".menu-toggle").click();
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "true",
      );
      assert.ok(
        await page.getByRole("navigation", { name: "ניווט ראשי" }).isVisible(),
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
      assert.equal(
        await page
          .locator("#connected-story")
          .evaluate((e) => e.classList.contains("is-animated")),
        false,
      );
    }
    await page.locator("[data-video-toggle]").click();
    const paused = await page.locator("#roadFilm").evaluate((v) => v.paused);
    await page.locator("[data-video-toggle]").click();
    await page.waitForTimeout(200);
    assert.notEqual(
      await page.locator("#roadFilm").evaluate((v) => v.paused),
      paused,
    );
    if (width >= 1024) {
      assert.ok(
        await page
          .locator("#connected-story")
          .evaluate((e) => e.classList.contains("is-animated")),
      );
      for (let i = 0; i < 6; i++) {
        await page.locator(`[data-build-go="${i}"]`).evaluate((b) => b.click());
        await page.waitForTimeout(1500);
        assert.equal(
          await page.locator(".build-step.is-active").getAttribute("data-step"),
          String(i),
        );
        await page.screenshot({ path: `${OUT}/story-${width}-${i}.png` });
      }
    }
    await page.locator(".header-cta").evaluate((a) => a.click());
    await page.waitForTimeout(300);
    const lead = await page.locator("form").boundingBox();
    assert.ok(lead);
    await page.locator("form").scrollIntoViewIfNeeded();
    assert.equal(await page.locator(".form-card").evaluate((e) => getComputedStyle(e).opacity), "1");
    await page.screenshot({ path: `${OUT}/form-${width}.png` });
    assert.equal(await page.locator("form input[required]").count(), 2);
    await page.locator("#faq details").first().locator("summary").click();
    assert.ok(
      (await page.locator("#faq details").first().getAttribute("open")) !==
        null,
    );
    console.log(
      `PASS ${width}px: light/dark, overflow, video, form, FAQ${width < 981 ? ", menu/static story" : ", six pinned phases"}`,
    );
    await page.close();
  }
  for (const mode of ["reduced", "blocked"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    await page.addInitScript(() =>
      localStorage.setItem("govari_analytics_consent_v1", "denied"),
    );
    if (mode === "blocked")
      await page.route("**/js/vendor/**", (r) => r.abort());
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    assert.equal(
      await page
        .locator("#connected-story")
        .evaluate((e) => e.classList.contains("is-animated")),
      false,
    );
    assert.equal(await page.locator(".build-step:visible").count(), 6);
    await page.locator("form").scrollIntoViewIfNeeded();
    assert.ok(await page.locator("form button[type=submit]").isVisible());
    console.log(`PASS ${mode}: all content and lead form accessible`);
    await page.close();
  }
  const p = await browser.newPage();
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  const links = await p
    .locator("a[href],img[src],script[src],link[rel=stylesheet]")
    .evaluateAll((es) => [
      ...new Set(
        es
          .map((e) => e.getAttribute("href") || e.getAttribute("src"))
          .filter(
            (s) =>
              s && !s.startsWith("#") && !/^(https?:|mailto:|tel:)/.test(s),
          ),
      ),
    ]);
  for (const path of links) {
    const r = await p.request.get(new URL(path, BASE).href);
    assert.ok(r.ok(), `${path}: ${r.status()}`);
  }
  assert.deepEqual(errors, []);
  console.log(
    `PASS ${links.length} local destinations/assets, no JS exceptions`,
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
