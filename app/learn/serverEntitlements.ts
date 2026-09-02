import "server-only";

import type { TrustedLearningAccessContext } from "./accessPolicy";

export interface EntitlementRecord {
  userId: string;
  productId: string;
  status: "active" | "revoked";
  provider: "paystack";
  providerReference: string;
}

export type EntitlementLookup = (userId: string, productId: string) => Promise<EntitlementRecord | null>;

export async function resolveLearningAccessContext(
  authenticatedUserId: string | null,
  productId: string,
  lookup: EntitlementLookup,
): Promise<TrustedLearningAccessContext> {
  if (!authenticatedUserId) return { entitlement: "none" };
  const record = await lookup(authenticatedUserId, productId);
  return { entitlement: record?.status === "active" ? "verified" : "none" };
}
