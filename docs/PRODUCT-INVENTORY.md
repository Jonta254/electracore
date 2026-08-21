# Product inventory

Inventory date: 2026-08-14.

## Preserved product

Routes: `/`, `/calculate`, `/design`, `/learn`, `/learn/[slug]`, `/guides`, and `/guides/[slug]`.

The platform has eight calculators (Ohm's law, power, voltage drop, resistor networks, LED resistor, power factor, cable sizing, voltage divider); a single/three-phase circuit designer with device selection, derating, thermal sizing, voltage-drop sizing and a printable verdict; nine courses; nine guides; inline lesson and guide diagrams; calculation-history export; course progress; and browser print/PDF layouts.

Persistence contracts are `electracore.calc.history.v1` (history array), `ec-progress` (course percentage map), and `ec-completed-{courseSlug}` (lesson-ID array). They remain unchanged.

The design uses amber `#F0A500`, cyan `#00D4FF`, green `#34D399`, hazard red `#FF4444`, and graphite surfaces from `#0A0A0C` to `#1E1E24`.

## Baseline findings

TypeScript passed. The production bundle compiled, but the sandboxed Windows build ended with `spawn EPERM` after compilation. Vercel reported success for the latest commit. Lint was not reproducible because the repository lacked a local ESLint configuration and inherited a parent workspace config. There were no automated tests, README, root loading state, error boundary, or tailored not-found state.

The application is client-heavy, repeats navigation markup, and contains large lesson/guide modules. Existing data is browser-local and has no account sync.

## Professional review required

BS 7671 limits, RCD selection, safe isolation, earthing, cable capacities, diversity and testing thresholds need centralized source metadata and qualified professional review before ElectraCore can be called authoritative or production-ready.
