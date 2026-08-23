export type ReviewStatus = "pending-professional-review" | "professionally-reviewed";
export interface TechnicalReview {
  jurisdiction: string;
  sources: { title: string; edition: string }[];
  reviewedAt: string | null;
  status: ReviewStatus;
}
export const DEFAULT_GUIDE_REVIEW: TechnicalReview = {
  jurisdiction: "United Kingdom",
  sources: [
    { title: "BS 7671 Requirements for Electrical Installations", edition: "2018+A4:2026" },
    { title: "IET On-Site Guide", edition: "Current edition must be confirmed before use" },
  ],
  reviewedAt: null,
  status: "pending-professional-review",
};
export const GUIDE_REVIEWS: Record<string, TechnicalReview> = {};
export function getGuideReview(slug: string): TechnicalReview {
  return GUIDE_REVIEWS[slug] ?? DEFAULT_GUIDE_REVIEW;
}
