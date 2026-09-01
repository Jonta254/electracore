# Learning experience research record

Reviewed: 2026-09-01.

## Evidence applied

- W3C WAI menu guidance recommends semantic navigation, consistent ordering, descriptive labels, and `aria-current="page"` for the active destination: https://www.w3.org/WAI/tutorials/menus/structure/
- Next.js App Router guidance identifies `Link` as the primary navigation mechanism and explains that route links provide client transitions and prefetching: https://nextjs.org/docs/app/getting-started/linking-and-navigating
- Next.js dynamic-segment guidance supports stable, directly addressable content URLs: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Paystack and account work remains outside this learning-flow change. Learning access stays in documented open-preview mode.

## Resulting interaction model

1. `/learn/[course]` is a course overview and ordered syllabus, not a container that expands full lessons inline.
2. `/learn/[course]/[lesson]` is the stable, shareable lesson destination.
3. The reader always exposes course, module, lesson position, completion state, syllabus context, and previous/next destinations.
4. The current syllabus item is marked semantically with `aria-current="page"`.
5. Mobile preserves the same lesson ordering and destinations without horizontal overflow.
6. Visuals are deterministic SVG teaching diagrams with titles and accessible names. Decorative generated photography is intentionally excluded; electrical relationships must be reviewable in code.

## Verification contract

- Every preserved lesson remains present: 9 courses, 280 unique lesson IDs.
- Direct lesson routing, current-page state, previous/next navigation, technical-visual coverage, and completion persistence have automated or browser checks.
- Existing browser-local progress keys remain versioned and backward compatible.
