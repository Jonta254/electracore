// Keep this index lightweight: do not import the full guide article/diagram bundle into the global header.
export type SiteSearchItem = { title: string; type: "Course" | "Calculator" | "Guide" | "Tool"; description: string; href: string; keywords?: string };
const courseRows = [
  ["Electrical Fundamentals", "electrical-fundamentals", "Voltage, current, resistance, power and circuit theory."],
  ["Domestic Wiring", "domestic-wiring", "Consumer units, ring and radial circuits, lighting and earthing."],
  ["Protection & Fault Analysis", "protection-fault-analysis", "Overcurrent protection, RCDs, fault current and selectivity."],
  ["Three-Phase Systems", "three-phase-systems", "Star and delta systems, motors, distribution and power factor."],
  ["Cable Sizing & Installation", "cable-sizing", "Current capacity, derating, voltage drop and installation methods."],
  ["Solar PV & Renewables", "solar-pv", "PV design, inverters, batteries, grid connection and metering."],
  ["Industrial Control & PLCs", "industrial-control", "Motor control, contactors, ladder logic and industrial panels."],
  ["Inspection & Testing", "inspection-testing", "Continuity, insulation resistance, loop impedance, RCDs and EICRs."],
  ["LED & Lighting Design", "led-lighting", "LED drivers, emergency lighting, lux, dimming and DALI."],
];
const calculatorRows = [
  ["Ohm's Law", "ohms", "Calculate voltage, current or resistance from any two known values."],
  ["Power (P = VI)", "power", "Calculate electrical power from voltage and current."],
  ["Voltage Drop", "vdrop", "Check single-phase voltage drop across a cable run."],
  ["Series and Parallel Resistance", "res", "Find total resistance for a resistor network."],
  ["LED Resistor", "led", "Choose a series resistor for an LED circuit."],
  ["Power Factor", "pf", "Calculate power factor from real and apparent power."],
  ["Cable Sizing", "cable", "Estimate minimum copper cross-section from voltage drop."],
  ["Voltage Divider", "divider", "Calculate unloaded output voltage from a resistive divider."],
];
const guideRows = [
  ["Safe Isolation Procedure", "safe-isolation", "The correct sequence for proving a circuit dead before work begins.", "Safety"],
  ["Cable Colour Codes - All Regions", "cable-colour-codes", "Conductor colours for the UK, Europe, North America and Australia/New Zealand.", "Standards"],
  ["RCD Types - AC, A, F and B Explained", "rcd-types", "Residual-current device types for modern loads, EV charging, solar and drives.", "Safety"],
  ["Earthing Systems - TN-S, TN-C-S and TT", "earthing-systems", "Supply earthing arrangements and their implications for protection.", "Standards"],
  ["Insulation Resistance Testing", "insulation-resistance-testing", "How to perform and interpret 250 V and 500 V insulation tests.", "Testing"],
  ["Earth Fault Loop Impedance", "loop-impedance-testing", "Measure Ze and Zs and verify protective-device disconnection.", "Testing"],
  ["Conduit Fill and Cable Capacity", "conduit-cable-fill", "Estimate how many cables can be installed safely in conduit.", "Calculations"],
  ["Maximum Demand and Diversity", "maximum-demand", "Estimate realistic domestic maximum demand.", "Calculations"],
  ["Single-Phase Socket Outlet Wiring", "single-phase-socket-wiring", "Ring and radial final circuits, spurs, terminations and checks.", "Wiring"],
];
export const SITE_SEARCH_ITEMS: SiteSearchItem[] = [
  { title: "Circuit Designer", type: "Tool", description: "Size and check a circuit from load through protective device, cable and voltage drop.", href: "/design", keywords: "load design report" },
  { title: "Saved calculations", type: "Tool", description: "Review calculations stored on this device and prepare a printable report.", href: "/calculate#saved-calculations", keywords: "history reports" },
  ...courseRows.map(([title, slug, description]) => ({ title, type: "Course" as const, description, href: `/learn/${slug}` })),
  ...calculatorRows.map(([title, id, description]) => ({ title, type: "Calculator" as const, description, href: `/calculate#${id}` })),
  ...guideRows.map(([title, slug, description, keywords]) => ({ title, type: "Guide" as const, description, href: `/guides/${slug}`, keywords })),
];
