import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ElectraCore", template: "%s Â· ElectraCore" },
  description: "The complete electrical platform for students, engineers, and trade workers. Circuit calculators, wiring guides, learning paths, load analysis, and project tools â€” built by an electrician with real site experience.",
  keywords: ["electrical calculator", "ohm's law", "cable sizing", "wiring guide", "electrician tools", "electrical engineering", "load calculation", "voltage drop"],
  openGraph: {
    title: "ElectraCore â€” The Complete Electrical Platform",
    description: "Circuit tools, learning paths, and wiring guides for students, engineers, and electricians.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
