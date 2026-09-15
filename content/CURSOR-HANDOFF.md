# GovAri — handoff, 15 September 2026

Project: /Users/davud/Desktop/מצלמה-עדכני
GitHub: DocDavid1/govari-site, main. Production: https://govari-site.vercel.app

## Run
Run `npm ci` at repository root and `npm ci --prefix server`, then `npm start --prefix server`. Existing local server uses port 3010; check before starting another. Never print environment values or commit .env files.

## This pass
- Removed 200+ lines of conflicting hero overrides. Hero uses the existing transparent camera cutout over road footage, a separate copy column on desktop and stacked mobile layout.
- Fixed desktop CTA escaping header, tablet hamburger escaping header, mobile theme control, visible mobile video pause control.
- Fixed sticky assembly parent overflow creating a blank scrolling area; constrained labels/scene and separated heading.
- Added keyboard focus cycling/restoration to conversion dialog.
- Polished internal-sounding copy and voluntary form disclosure.
- Added Vercel waitUntil for post-response notifications, cron auth compatibility, immutable notification submission data, uncached admin responses.

## Evidence
17 backend tests pass. Real Chrome/Playwright checks at widths 390,820,1440: menu open/Escape, theme toggle, video pause, no page JS errors or horizontal page overflow. Mobile app/features/privacy/terms/accessibility return 200 with no horizontal overflow. Screenshots from this session: /tmp/govari-final (temporary, not deployment assets). Browser script: content/qa/browser-audit.cjs, requires Playwright and installed Chrome; set PLAYWRIGHT_MODULE if external install.

Production health before deployment: DB healthy, email configured, outbox pending/failed/stuck = 0. This proves configuration and queue state, NOT receipt in the owner's inbox. Previous QA lead remains as documented in conversation. Do not delete real leads.

## Remaining launch gates — do not claim these are complete
- Confirm an actual notification arrives in davidazulay75@gmail.com after production deployment; configured email is not proof of inbox delivery.
- Fallback retry cron is daily. Fast retry SLA requires a verified more frequent scheduler/appropriate plan. Do not silently change paid plans.
- Exploded internal electronics are an illustrative CSS visualization, not an engineering teardown or photorealistic asset matching the user's reference. That art-direction request remains incomplete.
- Reservist stamp is a CSS approximation, not the supplied original mark. Replace with authorized original artwork if exact matching remains required.
- Qualified Israeli privacy/accessibility/consumer-law review remains unverified. Source checked: https://www.gov.il/BlobFolder/legalinfo/duty_to_notify/he/notify13.pdf . Do not claim legal certification.
- No full performance/Lighthouse audit completed in this pass.
- CSS still has legacy rules outside hero/header; refactor with visual regression coverage, not another pile of overrides.

Preserve video, no online payment, 12 months warranty, optional annual SIM 199₪, owner business 207575192, free installation center/Jerusalem by coordination, phone/video self-install discount by agreement. Never invent 4K/360/AI capabilities from decorative reference art.
