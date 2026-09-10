import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Circuit Designer",
  description: "Screen load current, protective-device coordination, representative cable capacity, derating, and voltage drop with visible assumptions.",
};

export default function DesignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
