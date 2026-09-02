# Professional lesson review workflow

A lesson must remain labelled `professional-review-pending` until all steps below are complete. Editorial checks, automated tests, or source collection alone do not count as professional approval.

1. Freeze the lesson text and source list for review.
2. Record SHA-256 hashes for the lesson content and source snapshot.
3. Assign a competent reviewer whose credential and practical scope match the topic.
4. Review technical statements, calculations, diagrams, safety boundaries, local-code caveats, assessment answers, and source relevance.
5. Resolve every finding and create a new content hash after any change.
6. Obtain final reviewer sign-off against the exact final hashes.
7. Add one `ProfessionalContentApproval` record containing the reviewer, credential, date, scope, and both hashes.
8. Change the lesson status to `professionally-reviewed` only in the same reviewed change set.
9. Require a new review when technical meaning, safety guidance, diagrams, calculations, assessments, or governing source editions change.

The approval registry deliberately starts empty. This prevents software checks from being presented as professional electrical sign-off.
