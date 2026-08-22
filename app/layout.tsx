import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://electracore.vercel.app"),
  title: { default: "ElectraCore", template: "%s · ElectraCore" },
  description: "The complete electrical platform for students, engineers, and trade workers. Circuit calculators, wiring guides, learning courses, load analysis, and cable sizing — built by an electrician with real site experience.",
  keywords: ["electrical calculator", "ohm's law", "cable sizing", "wiring guide", "electrician tools", "electrical engineering", "load calculation", "voltage drop"],
  openGraph: {
    title: "ElectraCore — The Complete Electrical Platform",
    description: "Circuit tools, learning paths, and wiring guides for students, engineers, and electricians.",
    type: "website",
    images: [{ url: "/electracore-profile-logo.png", width: 1280, height: 1280, alt: "ElectraCore lightning bolt and circuit emblem" }],
  },
  twitter: {
    card: "summary",
    title: "ElectraCore — The Complete Electrical Platform",
    description: "Circuit tools, learning paths, and wiring guides for students, engineers, and electricians.",
    images: ["/electracore-profile-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div id="main-content">{children}</div>
        <aside className="site-safety-notice" aria-label="Electrical safety notice">
          <strong>Educational use:</strong> ElectraCore supports learning and preliminary checks. It does not replace a competent electrician or engineer. Verify results, equipment data, and current local regulations before installation or live work.
        </aside>
      </body>
    </html>
  );
}
