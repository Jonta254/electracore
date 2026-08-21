# ElectraCore

ElectraCore is an educational electrical-learning and preliminary calculation platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

It includes eight calculators, a connected circuit-design workflow, nine courses, nine reference guides, inline technical diagrams, browser-local progress tracking, calculation history, and printable/PDF summaries.

## Safety and scope

ElectraCore does not replace a competent electrician, engineer, equipment manufacturer, or the regulations applicable to an installation. Capacity tables, correction factors, voltage-drop limits, and worked examples are educational and representative unless a page identifies a source, jurisdiction, edition, and review date. Verify every real design locally before installation or live work.

## Development

Run `npm ci`, then `npm run dev`. Use `npm run verify` for lint, TypeScript, calculation tests, and the production build.

## Routes

- `/` — overview
- `/calculate` — calculators and saved history
- `/design` — connected design workflow
- `/learn` and `/learn/[slug]` — courses and lessons
- `/guides` and `/guides/[slug]` — reference guides and print views

## Browser-data compatibility

No migration is performed. Existing keys remain supported:

- `electracore.calc.history.v1`: JSON calculation-history array.
- `ec-progress`: JSON object mapping course slugs to completion percentages.
- `ec-completed-{courseSlug}`: JSON array of completed lesson IDs.

Do not rename, clear, or change these schemas without a versioned, non-destructive migration.

## Technical-content maintenance

For regulatory content, record the source title, jurisdiction, edition/version, relevant section or table, and review date. Content without those fields must remain labelled educational or representative. Safety-critical content requires qualified professional review before being described as authoritative.
