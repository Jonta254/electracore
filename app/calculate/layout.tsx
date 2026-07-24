import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electrical Calculators",
  description:
    "Validated electrical calculators — Ohm's law, voltage drop, cable sizing, power factor, LED resistor, and voltage divider. Each shows the formula it used and saves to your calculation history. Always verify results against BS 7671 / NEC.",
};

export default function CalculateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
