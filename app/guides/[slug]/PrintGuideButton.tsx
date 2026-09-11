"use client";

export function PrintGuideButton() {
  return (
    <button type="button" className="g-print-btn" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
