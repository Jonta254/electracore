import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Reference Guides",
  description: "Practical electrical reference guides covering wiring, safety, testing, calculations, and standards.",
};

export default function GuidesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
