export interface ProfessionalContentApproval {
  lessonKey: string;
  reviewerName: string;
  reviewerCredential: string;
  reviewScope: "technical-content-and-safety";
  approvedOn: string;
  contentSha256: string;
  sourceSnapshotSha256: string;
}

const PROFESSIONAL_APPROVALS: Readonly<Record<string, ProfessionalContentApproval>> = Object.freeze({});

export function getProfessionalApproval(lessonKey: string) {
  return PROFESSIONAL_APPROVALS[lessonKey] ?? null;
}

export function isValidProfessionalApproval(record: ProfessionalContentApproval) {
  const sha256 = /^[a-f0-9]{64}$/;
  return Boolean(
    record.lessonKey
    && record.reviewerName.trim()
    && record.reviewerCredential.trim()
    && /^\d{4}-\d{2}-\d{2}$/.test(record.approvedOn)
    && sha256.test(record.contentSha256)
    && sha256.test(record.sourceSnapshotSha256),
  );
}
