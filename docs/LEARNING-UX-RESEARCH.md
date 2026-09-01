# Learning experience research record

Reviewed: 2026-09-01.

## Evidence applied

- W3C WAI menu guidance recommends semantic navigation, consistent ordering, descriptive labels, and `aria-current="page"` for the active destination: https://www.w3.org/WAI/tutorials/menus/structure/
- Next.js App Router guidance identifies `Link` as the primary navigation mechanism and explains that route links provide client transitions and prefetching: https://nextjs.org/docs/app/getting-started/linking-and-navigating
- Next.js dynamic-segment guidance supports stable, directly addressable content URLs: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Paystack and account work remains outside this learning-flow change. Learning access stays in documented open-preview mode.
- Next.js recommends rendering static content in Server Components, narrowing `use client` boundaries, and passing only serializable data needed by interactive children. This supports server-selecting one enhanced lesson instead of fetching the complete lesson registry after hydration: https://nextjs.org/docs/app/getting-started/server-and-client-components
- W3C WCAG guidance requires dynamically displayed result and completion messages to be programmatically determinable. Assessment results therefore use a status region and completion requirements remain visible in text: https://www.w3.org/WAI/WCAG21/Understanding/status-messages
- W3C form guidance recommends concise, clear success feedback after submission. ElectraCore now displays attempt count, best score, current score, and retry state together: https://www.w3.org/WAI/tutorials/forms/notifications/
- The U.S. Institute of Education Sciences practice guide recommends active-retrieval quizzing and timely, targeted performance feedback. ElectraCore treats assessments as learning checkpoints, records completed attempts, and shows answer-specific explanations; it does not represent them as professional certification: https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/20072004.pdf

## Resulting interaction model

1. `/learn/[course]` is a course overview and ordered syllabus, not a container that expands full lessons inline.
2. `/learn/[course]/[lesson]` is the stable, shareable lesson destination.
3. The reader always exposes course, module, lesson position, completion state, syllabus context, and previous/next destinations.
4. The current syllabus item is marked semantically with `aria-current="page"`.
5. Mobile preserves the same lesson ordering and destinations without horizontal overflow.
6. Visuals are deterministic SVG teaching diagrams with titles and accessible names. Decorative generated photography is intentionally excluded; electrical relationships must be reviewable in code.
7. Substantive lesson content is selected during server rendering and included in the initial HTML; browser code handles only local progress, navigation, notes, and assessment interaction.
8. Reading lessons permit deliberate manual completion. Exercises require explicit exercise completion. Assessments require a recorded score of at least 70% before new completion credit; previously stored completion remains preserved for compatibility.
9. Assessment history is device-local and visibly reports best score and attempt count. It is learning feedback, not accreditation evidence.

## Technical-diagram reference discipline

- Electrical lesson visuals remain original SVGs with explicit titles and accessible names. They are classified by instructional purpose rather than added decoratively.
- HSE HSG253 is used to cross-check isolation boundaries, multiple energy sources, discharge, and securing-isolation concepts: https://books.hse.gov.uk/gempdf/hsg253.pdf
- IET public consumer-unit guidance is used to cross-check functional device labels and the RCCB/RCBO distinction: https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/faqs/consumer-units-and-protective-devices-faqs/
- IET public RCD guidance is used to cross-check the current-balance teaching model: https://electrical.theiet.org/media/1142/rcds-everything-an-electrician-should-know.pdf
- Source figures are references, not reusable art. ElectraCore does not copy licensed standards tables, proprietary manufacturer drawings, or IET/HSE figure artwork. Final installation decisions still require current standards, manufacturer data, local rules, and competent review.

## Verification contract

- Every preserved lesson remains present: 9 courses, 280 unique lesson IDs.
- Direct lesson routing, current-page state, previous/next navigation, technical-visual coverage, and completion persistence have automated or browser checks.
- Existing browser-local progress keys remain versioned and backward compatible.
