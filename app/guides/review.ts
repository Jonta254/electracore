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
export const GUIDE_REVIEWS: Record<string, TechnicalReview> = {
  "electrical-symbols-diagrams": {
    jurisdiction: "International reference with local-rule qualification",
    sources: [
      { title: "IEC 60617 Graphical symbols for diagrams", edition: "2026 database release" },
      { title: "IEC 60445 Terminal and conductor identification", edition: "2021" },
      { title: "IEC 61082-1 Preparation of electrotechnical documents", edition: "2014" },
    ],
    reviewedAt: null,
    status: "pending-professional-review",
  },
  "electrical-field-toolkit": {
    jurisdiction: "International workflow with GB and US safety-source examples",
    sources: [
      { title: "Skills England Installation and maintenance electrician", edition: "ST0152 version 1.2" },
      { title: "HSE Electricity at work: safe working practices", edition: "HSG85" },
      { title: "HSE Electrical test equipment", edition: "GS38 fourth edition" },
      { title: "OSHA Electrical safety-related work practices", edition: "29 CFR 1910 guidance" },
    ],
    reviewedAt: null,
    status: "pending-professional-review",
  },
};
export function getGuideReview(slug: string): TechnicalReview {
  return GUIDE_REVIEWS[slug] ?? DEFAULT_GUIDE_REVIEW;
}
