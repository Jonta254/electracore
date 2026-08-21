# Payments and monetization audit

Audit date: 2026-08-21.

## Current repository state

ElectraCore contains pricing and future-Pro marketing copy on the homepage. The checked repository does **not** currently contain:

- M-Pesa provider code
- Checkout routes or components
- Payment callbacks
- Transaction models or state machines
- Server-side entitlement checks
- Payment environment variables
- Provider-secret handling
- Idempotency or callback-validation logic

Accordingly, the application must not describe checkout or M-Pesa as operational. No payment implementation was deleted or modified because none exists in this repository revision.

## Preserved commercial foundation

The homepage pricing metadata and future-Pro positioning remain intact. Learning access is now decided by the typed `app/learn/accessPolicy.ts` module. Its current mode is `open-preview`; future `paid` and `mixed` modes have explicit denial/entitlement behavior, but changing the constant alone does not create a secure payment system.

## Security boundary for future implementation

Before enabling paid access:

1. Add a server-side provider integration and authoritative product-price mapping.
2. Never accept price, entitlement, or successful-payment state from the browser.
3. Verify callback authenticity and amount/currency against server-owned data.
4. Make transaction creation idempotent.
5. Store provider secrets only in server environment variables.
6. Grant entitlements only after verified server-side settlement.
7. Add replay, callback, amount-tampering, and duplicate-request tests.
8. Document incomplete or sandbox-only behavior honestly.
