import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Courses",
  description: "Nine structured electrical courses with 280 lessons, worked examples, assessments, sources, and device-local progress.",
};

export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
