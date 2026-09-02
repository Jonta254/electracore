# Paystack access-control readiness

ElectraCore currently runs in `open-preview` mode. No lesson route treats browser state, query parameters, or client input as proof of payment.

Before paid access is enabled, the server implementation must satisfy every control below.

1. Authenticate the learner on the server and bind every entitlement to that stable user ID.
2. Initialize Paystack transactions on the server using a server-owned product and price catalogue.
3. Generate a unique internal order ID before redirecting to Paystack.
4. Verify the Paystack transaction reference on the server. Confirm success, currency, exact amount, customer identity, and expected product before granting access.
5. Validate webhook signatures against the unmodified request body.
6. Store provider event IDs and transaction references with unique constraints so webhook retries are idempotent.
7. Grant, revoke, and query entitlements in persistent server storage. Never accept an entitlement boolean from the browser.
8. Record payment and entitlement state transitions for reconciliation and support.
9. Return a generic failure to the browser while retaining diagnostic detail in protected server logs.
10. Test duplicate webhooks, forged signatures, altered amounts, abandoned checkout, delayed success, refund, chargeback, and replayed references.

`serverEntitlements.ts` defines the trusted lookup boundary. The current default is denied unless a server lookup returns an active Paystack-backed record. Checkout and webhook endpoints should not be added until authentication, persistent storage, product pricing, secrets, and refund policy are decided.
