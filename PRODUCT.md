# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** front-end engineers, design engineers and product designers at FinTech, enterprise, CRM, ERP and SaaS teams who are evaluating a React design system for dense, data-heavy interfaces. They arrive from GitHub, npm or a referral and need to decide quickly whether the library fits their stack (React 18.3/19, Ant Design 6) and their quality bar.
- **Secondary:** people curious about Techosoul, the umbrella brand behind the library, and its founder.

## Product Purpose

Techosoul UI (`@techosoul/ui`, MIT, preview 0.3.0) is an open-source React design system that extends Ant Design 6 with semantic tokens, financial display components and consistent interaction patterns. Success is a qualified evaluator installing the package, opening the live Showcase, or starring/following the GitHub repo.

## Positioning

FinTech-first: built from real financial-product requirements (dense readable tables, precise money display, distinguishable states, keyboard efficiency, Light/Dark themes, Comfortable/Compact density), then generalized to any data-intensive software. It extends Ant Design rather than replacing it, so teams keep one control framework. Financial values are display-only; there is no ledger, trading engine, broker integration, payment system or live data feed.

## Operating Context

Evaluators read the README, scan the live Showcase (https://morimdn.github.io/Techosoul-UI/), check peer versions and bundle shape, then try `npm install @techosoul/ui antd`. Documentation lives in `docs/` and inside the Showcase (`/#docs-getting-started`).

## Capabilities and Constraints

- Themes: TechosoulProvider, useTechosoulTheme, typed colorOverrides, `--techosoul-*` CSS variables, generated tokens.json; Light/Dark and Comfortable/Compact as independent axes.
- Components: Ant Design re-exports plus Techosoul wrappers — DataGrid (controlled column resize/ordering), CurrencyAmount, formatCurrency, PnLIndicator, WalletBalanceCard, AccountSummary, FinancialKPICard, KYCStatus, ClientStatus, TransactionStatus, RiskLevelIndicator, SymbolPriceDisplay, BidAskDisplay, StatusIndicator, Chip, IconButton, TechosoulIcon (36 curated Lucide icons), FormModal.
- Native ESM + TypeScript declarations; React, React DOM and Ant Design are peers. Validated on React 18.3.1/19.3.1 × Ant Design 6.0.0/6.6.6.
- Repo: npm workspaces monorepo (`packages/techosoul-ui`, `apps/showcase`, now `apps/landing`), Vite, Node 24.

## Brand Commitments

- Names: "Techosoul UI" (library), "Techosoul" (umbrella brand). Taglines: "FinTech-first. Built for modern software." and "Techosoul — Technology with a Human Soul".
- No official logo yet; a typographic wordmark stands in.
- `techosoul.com` is reserved for a future site and must not be presented as live; `ui.techosoul.com` is planned, not active.
- Founder & lead maintainer: Dr. Mirmorsal Madani (Ph.D. Computer Engineering — Software Systems; currently a Chief Product Officer in FinTech). Links: https://github.com/morimdn, https://www.linkedin.com/in/mirmorsal-madani/.
- Brand voice in existing copy: precise, sober, evidence-bound; it separates recorded decisions from interpretation.

## Evidence on Hand

- Live Showcase and real Chromium captures in `docs/screenshots/`.
- Engineering evaluations, synthetic datasets, automated tests (contrast, a11y via axe, consumer validation matrix) in `docs/` and `tests/`.
- Absent and never to be fabricated: customers, testimonials, download counts, GitHub star counts, benchmarks beyond `docs/grid-benchmark.json` and `docs/package-metrics.json`, partnerships, headcount, legal company status, pricing.

## Product Principles

1. Prove with the real thing: show actual components and real APIs, never mockups of capabilities that do not exist.
2. Precision over flourish: financial values, states and numbers must read unambiguously.
3. Honest scope: say what the library is not (no ledger, no live data) as plainly as what it is.
4. Extend, don't replace: respect the Ant Design foundation teams already use.

## Accessibility & Inclusion

WCAG AA contrast is enforced by tests in both themes; keyboard parity and reduced-motion support are existing commitments the landing page must keep.
