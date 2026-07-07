"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import { ElectraCoreLogoMark } from "../../components/Logo";

/* ─── Course Database ─── */
const COURSES: Record<string, {
  title: string; color: string; level: string; category: string;
  modules: Module[]; intro: string; prerequisites: string[]; outcomes: string[];
}> = {
  "electrical-fundamentals": {
    title: "Electrical Fundamentals",
    color: "#F0A500",
    level: "Beginner",
    category: "Theory",
    intro: "Everything in electrical engineering rests on a handful of core relationships. This course builds them from first principles — starting with what electricity actually is at the atomic level and ending with real circuit analysis using Kirchhoff's laws.",
    prerequisites: ["Basic maths (algebra)", "No prior electrical knowledge required"],
    outcomes: [
      "Apply Ohm's Law to calculate voltage, current, and resistance",
      "Analyse series and parallel circuits with confidence",
      "Calculate power and energy in DC and AC circuits",
      "Read and interpret basic circuit diagrams",
      "Use Kirchhoff's Voltage and Current Laws",
      "Understand capacitors and inductors and their behaviour",
    ],
    modules: [
      {
        id: "m1", title: "Atoms, Electrons & Electric Charge", duration: "38min",
        lessons: [
          { id: "l1", title: "What is electricity? — atomic model", duration: "9min", type: "video" },
          { id: "l2", title: "Electric charge and the coulomb", duration: "7min", type: "video" },
          { id: "l3", title: "Conductors, insulators, and semiconductors", duration: "8min", type: "video" },
          { id: "l4", title: "Conventional current vs electron flow", duration: "7min", type: "video" },
          { id: "l5", title: "Module quiz", duration: "7min", type: "quiz" },
        ],
      },
      {
        id: "m2", title: "Voltage, Current & Resistance", duration: "44min",
        lessons: [
          { id: "l6", title: "Potential difference — the driving force", duration: "8min", type: "video" },
          { id: "l7", title: "Current — the rate of charge flow", duration: "7min", type: "video" },
          { id: "l8", title: "Resistance and resistivity", duration: "9min", type: "video" },
          { id: "l9", title: "Ohm's Law — derivation and examples", duration: "12min", type: "video" },
          { id: "l10", title: "Worked examples — Ohm's Law problems", duration: "8min", type: "exercise" },
        ],
      },
      {
        id: "m3", title: "Series & Parallel Circuits", duration: "52min",
        lessons: [
          { id: "l11", title: "Series circuits — characteristics and rules", duration: "10min", type: "video" },
          { id: "l12", title: "Parallel circuits — characteristics and rules", duration: "10min", type: "video" },
          { id: "l13", title: "Combined series-parallel networks", duration: "12min", type: "video" },
          { id: "l14", title: "Voltage dividers and current dividers", duration: "10min", type: "video" },
          { id: "l15", title: "Circuit analysis practice", duration: "10min", type: "exercise" },
        ],
      },
      {
        id: "m4", title: "Kirchhoff's Laws", duration: "40min",
        lessons: [
          { id: "l16", title: "KCL — Kirchhoff's Current Law", duration: "9min", type: "video" },
          { id: "l17", title: "KVL — Kirchhoff's Voltage Law", duration: "9min", type: "video" },
          { id: "l18", title: "Mesh and nodal analysis", duration: "12min", type: "video" },
          { id: "l19", title: "Kirchhoff's law problems set", duration: "10min", type: "exercise" },
        ],
      },
      {
        id: "m5", title: "Power & Energy", duration: "35min",
        lessons: [
          { id: "l20", title: "Electrical power — watts and horsepower", duration: "8min", type: "video" },
          { id: "l21", title: "Energy — kilowatt-hours and joules", duration: "7min", type: "video" },
          { id: "l22", title: "Efficiency and power loss in cables", duration: "8min", type: "video" },
          { id: "l23", title: "Power quiz", duration: "12min", type: "quiz" },
        ],
      },
      {
        id: "m6", title: "Alternating Current Fundamentals", duration: "48min",
        lessons: [
          { id: "l24", title: "AC vs DC — why AC won", duration: "8min", type: "video" },
          { id: "l25", title: "Sinusoidal waveforms — peak, RMS, average", duration: "10min", type: "video" },
          { id: "l26", title: "Frequency and period", duration: "7min", type: "video" },
          { id: "l27", title: "Phase relationships", duration: "10min", type: "video" },
          { id: "l28", title: "AC circuit analysis introduction", duration: "13min", type: "video" },
        ],
      },
      {
        id: "m7", title: "Capacitors & Inductors", duration: "50min",
        lessons: [
          { id: "l29", title: "Capacitor construction and capacitance", duration: "9min", type: "video" },
          { id: "l30", title: "Capacitors in AC circuits — reactance", duration: "10min", type: "video" },
          { id: "l31", title: "Inductor construction and inductance", duration: "9min", type: "video" },
          { id: "l32", title: "Inductors in AC circuits — reactance", duration: "10min", type: "video" },
          { id: "l33", title: "RC and RL circuits — time constants", duration: "12min", type: "video" },
        ],
      },
      {
        id: "m8", title: "Measurement & Instruments", duration: "35min",
        lessons: [
          { id: "l34", title: "Multimeters — AC/DC voltage and current", duration: "9min", type: "video" },
          { id: "l35", title: "Clamp meters and measuring live current", duration: "7min", type: "video" },
          { id: "l36", title: "Oscilloscopes — reading waveforms", duration: "10min", type: "video" },
          { id: "l37", title: "Final assessment", duration: "9min", type: "quiz" },
        ],
      },
    ],
  },

  "domestic-wiring": {
    title: "Domestic Wiring",
    color: "#34D399",
    level: "Beginner",
    category: "Installation",
    intro: "Fixed wiring in UK homes follows a set of well-defined rules — ring finals, lighting circuits, earthing, bonding. This course teaches you every circuit type you'll encounter in domestic work, with full wiring diagrams and fault-finding techniques.",
    prerequisites: ["Electrical Fundamentals (recommended)", "Basic hand tool skills"],
    outcomes: [
      "Design and install ring final circuits to BS 7671",
      "Wire lighting circuits including two-way and intermediate switching",
      "Understand consumer unit layout, MCBs, RCDs, and RCBOs",
      "Apply earthing and bonding requirements",
      "Diagnose common domestic wiring faults",
      "Read and produce simple domestic wiring diagrams",
    ],
    modules: [
      {
        id: "m1", title: "Consumer Unit Design", duration: "45min",
        lessons: [
          { id: "l1", title: "Consumer unit layout and components", duration: "10min", type: "video" },
          { id: "l2", title: "MCBs — types, ratings, and selection", duration: "9min", type: "video" },
          { id: "l3", title: "RCDs vs RCBOs — when to use which", duration: "9min", type: "video" },
          { id: "l4", title: "Split load vs dual RCD boards", duration: "8min", type: "video" },
          { id: "l5", title: "Module quiz", duration: "9min", type: "quiz" },
        ],
      },
      {
        id: "m2", title: "Ring Final Circuits", duration: "50min",
        lessons: [
          { id: "l6", title: "How ring circuits work — the topology", duration: "10min", type: "video" },
          { id: "l7", title: "Cable selection for ring finals", duration: "9min", type: "video" },
          { id: "l8", title: "Spur outlets — fused and unfused", duration: "9min", type: "video" },
          { id: "l9", title: "Radial circuits — when to use them", duration: "8min", type: "video" },
          { id: "l10", title: "Wiring practice problems", duration: "14min", type: "exercise" },
        ],
      },
      {
        id: "m3", title: "Lighting Circuits", duration: "55min",
        lessons: [
          { id: "l11", title: "Junction box vs loop-in wiring methods", duration: "10min", type: "video" },
          { id: "l12", title: "One-way switching — full diagram", duration: "8min", type: "video" },
          { id: "l13", title: "Two-way switching — staircase wiring", duration: "10min", type: "video" },
          { id: "l14", title: "Intermediate switching for long runs", duration: "9min", type: "video" },
          { id: "l15", title: "Dimmer circuits and LED compatibility", duration: "8min", type: "video" },
          { id: "l16", title: "Lighting circuit quiz", duration: "10min", type: "quiz" },
        ],
      },
      {
        id: "m4", title: "Earthing & Bonding", duration: "42min",
        lessons: [
          { id: "l17", title: "Types of earthing — TN-S, TN-C-S, TT", duration: "10min", type: "video" },
          { id: "l18", title: "Main protective bonding", duration: "8min", type: "video" },
          { id: "l19", title: "Supplementary bonding requirements", duration: "8min", type: "video" },
          { id: "l20", title: "Earth electrode installation for TT", duration: "8min", type: "video" },
          { id: "l21", title: "Bonding quiz", duration: "8min", type: "quiz" },
        ],
      },
      {
        id: "m5", title: "Special Locations", duration: "40min",
        lessons: [
          { id: "l22", title: "Bathroom zones — Zone 0, 1, 2", duration: "10min", type: "video" },
          { id: "l23", title: "Kitchen wiring requirements", duration: "8min", type: "video" },
          { id: "l24", title: "Garage and outbuilding circuits", duration: "10min", type: "video" },
          { id: "l25", title: "Garden power — outdoor sockets and lighting", duration: "12min", type: "video" },
        ],
      },
      {
        id: "m6", title: "Cables & Containment", duration: "35min",
        lessons: [
          { id: "l26", title: "Twin-and-earth cable construction", duration: "7min", type: "video" },
          { id: "l27", title: "Installing in walls — notching and chasing", duration: "8min", type: "video" },
          { id: "l28", title: "Trunking, conduit and dado systems", duration: "8min", type: "video" },
          { id: "l29", title: "Cable in ceilings and floor voids", duration: "7min", type: "video" },
          { id: "l30", title: "Depths and zones quiz", duration: "5min", type: "quiz" },
        ],
      },
      {
        id: "m7", title: "Fault Finding", duration: "48min",
        lessons: [
          { id: "l31", title: "Systematic fault finding process", duration: "10min", type: "video" },
          { id: "l32", title: "Open circuits — symptoms and finding them", duration: "9min", type: "video" },
          { id: "l33", title: "Short circuits and cross-connections", duration: "9min", type: "video" },
          { id: "l34", title: "RCD nuisance tripping", duration: "10min", type: "video" },
          { id: "l35", title: "Fault finding case studies", duration: "10min", type: "exercise" },
        ],
      },
      {
        id: "m8", title: "Wiring Regulations", duration: "30min",
        lessons: [
          { id: "l36", title: "BS 7671 structure and using the regs", duration: "8min", type: "video" },
          { id: "l37", title: "Notification, certification and sign-off", duration: "8min", type: "video" },
          { id: "l38", title: "Part P and building control", duration: "7min", type: "video" },
          { id: "l39", title: "Final assessment", duration: "7min", type: "quiz" },
        ],
      },
    ],
  },

  "protection-fault-analysis": {
    title: "Protection & Fault Analysis",
    color: "#FF6B35",
    level: "Intermediate",
    category: "Protection",
    intro: "A circuit that trips saves lives — but only if the protective device operates correctly and in time. This course goes deep into overcurrent protection, earth fault loop impedance, RCD selection, and discrimination between cascading devices.",
    prerequisites: ["Electrical Fundamentals", "Domestic Wiring (recommended)"],
    outcomes: [
      "Select the correct protective device type for any circuit",
      "Calculate fault loop impedance and verify protection operates",
      "Understand and apply discrimination between protective devices",
      "Specify RCDs and RCBOs to meet regulations",
      "Calculate prospective fault current at any point in a system",
      "Design protection systems that meet BS 7671",
    ],
    modules: [
      { id: "m1", title: "Overcurrent Protection Devices", duration: "45min", lessons: [
        { id: "l1", title: "Rewirable fuses vs cartridge fuses", duration: "9min", type: "video" },
        { id: "l2", title: "MCB operating characteristics — B, C, D curves", duration: "10min", type: "video" },
        { id: "l3", title: "RCBO — combined RCD + MCB operation", duration: "9min", type: "video" },
        { id: "l4", title: "AFDD — arc fault detection", duration: "9min", type: "video" },
        { id: "l5", title: "Device selection quiz", duration: "8min", type: "quiz" },
      ]},
      { id: "m2", title: "Fault Loop Impedance", duration: "50min", lessons: [
        { id: "l6", title: "What is earth fault loop impedance?", duration: "10min", type: "video" },
        { id: "l7", title: "Ze — external impedance measurement", duration: "9min", type: "video" },
        { id: "l8", title: "Zs — total loop impedance calculations", duration: "10min", type: "video" },
        { id: "l9", title: "Disconnection time requirements — Table 41.1", duration: "9min", type: "video" },
        { id: "l10", title: "Zs calculation exercises", duration: "12min", type: "exercise" },
      ]},
      { id: "m3", title: "RCDs and Residual Current", duration: "40min", lessons: [
        { id: "l11", title: "How RCDs work — the core balance principle", duration: "9min", type: "video" },
        { id: "l12", title: "RCD types — Type AC, A, F, B", duration: "9min", type: "video" },
        { id: "l13", title: "RCD ratings — 10, 30, 100, 300mA", duration: "7min", type: "video" },
        { id: "l14", title: "RCD testing and nuisance trips", duration: "8min", type: "video" },
        { id: "l15", title: "RCD selection quiz", duration: "7min", type: "quiz" },
      ]},
      { id: "m4", title: "Prospective Fault Current", duration: "38min", lessons: [
        { id: "l16", title: "PFC — what it is and why it matters", duration: "9min", type: "video" },
        { id: "l17", title: "Calculating PFC at the origin", duration: "9min", type: "video" },
        { id: "l18", title: "PFC at distribution boards downstream", duration: "8min", type: "video" },
        { id: "l19", title: "Fault current rating of devices", duration: "7min", type: "video" },
        { id: "l20", title: "PFC worked problems", duration: "5min", type: "exercise" },
      ]},
      { id: "m5", title: "Discrimination & Coordination", duration: "35min", lessons: [
        { id: "l21", title: "What is discrimination and why it matters", duration: "8min", type: "video" },
        { id: "l22", title: "Current discrimination", duration: "7min", type: "video" },
        { id: "l23", title: "Time discrimination", duration: "7min", type: "video" },
        { id: "l24", title: "Energy discrimination for MCBs", duration: "8min", type: "video" },
        { id: "l25", title: "Discrimination case study", duration: "5min", type: "exercise" },
      ]},
      { id: "m6", title: "Testing for Protection", duration: "38min", lessons: [
        { id: "l26", title: "Testing Zs with loop testers", duration: "9min", type: "video" },
        { id: "l27", title: "Measuring PFC at the board", duration: "8min", type: "video" },
        { id: "l28", title: "RCD trip time testing", duration: "9min", type: "video" },
        { id: "l29", title: "Final assessment", duration: "12min", type: "quiz" },
      ]},
    ],
  },

  "three-phase-systems": {
    title: "Three-Phase Systems",
    color: "#A855F7",
    level: "Intermediate",
    category: "Power Systems",
    intro: "Three-phase power is how almost all large-scale electricity is generated, transmitted, and used. From industrial motors to commercial buildings, understanding three-phase is essential for anyone moving beyond domestic work.",
    prerequisites: ["Electrical Fundamentals", "Basic AC circuit knowledge"],
    outcomes: [
      "Explain why three-phase systems are used over single-phase",
      "Calculate line and phase voltages and currents in star and delta",
      "Analyse balanced and unbalanced three-phase loads",
      "Understand and calculate three-phase power and power factor",
      "Select motor starters for three-phase induction motors",
      "Read and produce three-phase wiring diagrams",
    ],
    modules: [
      { id: "m1", title: "Three-Phase Fundamentals", duration: "42min", lessons: [
        { id: "l1", title: "Why three-phase? — advantages over single-phase", duration: "8min", type: "video" },
        { id: "l2", title: "Generation of three-phase voltages", duration: "9min", type: "video" },
        { id: "l3", title: "Phase sequence — L1, L2, L3", duration: "8min", type: "video" },
        { id: "l4", title: "Phasor representation of three-phase", duration: "9min", type: "video" },
        { id: "l5", title: "Phase fundamentals quiz", duration: "8min", type: "quiz" },
      ]},
      { id: "m2", title: "Star (Wye) Connection", duration: "44min", lessons: [
        { id: "l6", title: "Star connection topology", duration: "9min", type: "video" },
        { id: "l7", title: "Line voltage = √3 × phase voltage — proof", duration: "10min", type: "video" },
        { id: "l8", title: "Neutral current in star systems", duration: "9min", type: "video" },
        { id: "l9", title: "Star circuit analysis problems", duration: "16min", type: "exercise" },
      ]},
      { id: "m3", title: "Delta Connection", duration: "38min", lessons: [
        { id: "l10", title: "Delta connection topology", duration: "8min", type: "video" },
        { id: "l11", title: "Line current = √3 × phase current — proof", duration: "9min", type: "video" },
        { id: "l12", title: "Circulating currents in delta", duration: "7min", type: "video" },
        { id: "l13", title: "Delta circuit analysis problems", duration: "14min", type: "exercise" },
      ]},
      { id: "m4", title: "Three-Phase Power", duration: "40min", lessons: [
        { id: "l14", title: "Active, reactive, and apparent power", duration: "9min", type: "video" },
        { id: "l15", title: "Power factor in three-phase", duration: "9min", type: "video" },
        { id: "l16", title: "Two-wattmeter method", duration: "10min", type: "video" },
        { id: "l17", title: "Power correction capacitor sizing", duration: "7min", type: "video" },
        { id: "l18", title: "Three-phase power quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m5", title: "Three-Phase Induction Motors", duration: "48min", lessons: [
        { id: "l19", title: "How induction motors work", duration: "10min", type: "video" },
        { id: "l20", title: "Motor nameplate data and efficiency classes", duration: "8min", type: "video" },
        { id: "l21", title: "Starting currents and starting methods", duration: "9min", type: "video" },
        { id: "l22", title: "DOL starters — design and wiring", duration: "10min", type: "video" },
        { id: "l23", title: "Star-delta starters — wiring and timing", duration: "11min", type: "video" },
      ]},
      { id: "m6", title: "Transformers", duration: "40min", lessons: [
        { id: "l24", title: "Transformer construction and principles", duration: "9min", type: "video" },
        { id: "l25", title: "Turns ratio and voltage/current transformation", duration: "9min", type: "video" },
        { id: "l26", title: "Three-phase transformer connections", duration: "10min", type: "video" },
        { id: "l27", title: "Transformer quiz", duration: "7min", type: "quiz" },
        { id: "l28", title: "Final assessment", duration: "5min", type: "quiz" },
      ]},
    ],
  },

  "cable-sizing": {
    title: "Cable Sizing & Installation",
    color: "#00D4FF",
    level: "Advanced",
    category: "Design",
    intro: "Selecting the correct cable is one of the most safety-critical decisions in electrical design. Get it wrong and cables overheat, insulation fails, fires start. This course teaches the full BS 7671 cable sizing methodology — current capacity, derating factors, voltage drop, and installation method selection.",
    prerequisites: ["Electrical Fundamentals", "Domestic Wiring or equivalent"],
    outcomes: [
      "Select cable size using current-carrying capacity tables",
      "Apply all derating factors — grouping, thermal, depth of burial",
      "Calculate voltage drop to verify compliance",
      "Select installation methods and apply the correct CCC tables",
      "Size armoured cables for underground and industrial use",
      "Design busbar trunking systems",
    ],
    modules: [
      { id: "m1", title: "Current-Carrying Capacity", duration: "44min", lessons: [
        { id: "l1", title: "How CCC tables work — Appendix 4", duration: "10min", type: "video" },
        { id: "l2", title: "Reference method A — enclosed in conduit", duration: "8min", type: "video" },
        { id: "l3", title: "Reference method B — clipped direct", duration: "8min", type: "video" },
        { id: "l4", title: "Reference methods C, E, F, G", duration: "10min", type: "video" },
        { id: "l5", title: "CCC selection problems", duration: "8min", type: "exercise" },
      ]},
      { id: "m2", title: "Derating & Correction Factors", duration: "50min", lessons: [
        { id: "l6", title: "Ambient temperature correction (Ca)", duration: "9min", type: "video" },
        { id: "l7", title: "Grouping correction factor (Cg)", duration: "10min", type: "video" },
        { id: "l8", title: "Thermal insulation factor (Ci)", duration: "9min", type: "video" },
        { id: "l9", title: "Depth of burial correction (Cs)", duration: "8min", type: "video" },
        { id: "l10", title: "Applying multiple correction factors", duration: "14min", type: "exercise" },
      ]},
      { id: "m3", title: "Voltage Drop Calculations", duration: "42min", lessons: [
        { id: "l11", title: "Why voltage drop matters — Reg 525", duration: "8min", type: "video" },
        { id: "l12", title: "mV/A/m tables and how to use them", duration: "9min", type: "video" },
        { id: "l13", title: "Calculating voltage drop for single-phase", duration: "9min", type: "video" },
        { id: "l14", title: "Three-phase voltage drop", duration: "8min", type: "video" },
        { id: "l15", title: "Voltage drop problems set", duration: "8min", type: "exercise" },
      ]},
      { id: "m4", title: "Armoured Cables", duration: "38min", lessons: [
        { id: "l16", title: "SWA construction — layers and materials", duration: "8min", type: "video" },
        { id: "l17", title: "Underground cable installation methods", duration: "9min", type: "video" },
        { id: "l18", title: "SWA as protective conductor?", duration: "7min", type: "video" },
        { id: "l19", title: "XLPE vs PVC insulation", duration: "8min", type: "video" },
        { id: "l20", title: "SWA sizing exercise", duration: "6min", type: "exercise" },
      ]},
      { id: "m5", title: "Mineral Insulated (MICC) Cable", duration: "28min", lessons: [
        { id: "l21", title: "MICC construction and applications", duration: "8min", type: "video" },
        { id: "l22", title: "Fire performance cables — FP200, LSOH", duration: "8min", type: "video" },
        { id: "l23", title: "Cable selection for life safety systems", duration: "7min", type: "video" },
        { id: "l24", title: "Fire cable quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m6", title: "Full Cable Sizing Design", duration: "45min", lessons: [
        { id: "l25", title: "End-to-end cable sizing — worked design", duration: "15min", type: "video" },
        { id: "l26", title: "Documenting the cable schedule", duration: "8min", type: "video" },
        { id: "l27", title: "Common errors and how to avoid them", duration: "7min", type: "video" },
        { id: "l28", title: "Final assessment", duration: "15min", type: "quiz" },
      ]},
    ],
  },

  "solar-pv": {
    title: "Solar PV & Renewables",
    color: "#34D399",
    level: "Intermediate",
    category: "Renewables",
    intro: "Solar PV installation is one of the fastest-growing electrical trades. This course covers everything from panel physics to grid connection standards, battery storage sizing, and the regulations governing PV systems in the UK.",
    prerequisites: ["Electrical Fundamentals", "Domestic Wiring (helpful)"],
    outcomes: [
      "Explain how photovoltaic cells generate electricity",
      "Design a PV string array for a given roof orientation",
      "Select and size an inverter for a residential installation",
      "Size battery storage systems for self-consumption targets",
      "Understand G98/G99 grid connection requirements",
      "Commission and verify a PV system safely",
    ],
    modules: [
      { id: "m1", title: "PV Physics & Panel Technology", duration: "40min", lessons: [
        { id: "l1", title: "Photovoltaic effect — how a cell works", duration: "9min", type: "video" },
        { id: "l2", title: "Monocrystalline vs polycrystalline vs thin-film", duration: "9min", type: "video" },
        { id: "l3", title: "Panel specifications — Voc, Vmp, Isc, Imp", duration: "9min", type: "video" },
        { id: "l4", title: "Temperature and irradiance effects", duration: "8min", type: "video" },
        { id: "l5", title: "PV physics quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m2", title: "System Design & Sizing", duration: "50min", lessons: [
        { id: "l6", title: "Site survey — roof orientation, shading, pitch", duration: "10min", type: "video" },
        { id: "l7", title: "String sizing — voltage and current matching", duration: "10min", type: "video" },
        { id: "l8", title: "Series vs parallel string configurations", duration: "9min", type: "video" },
        { id: "l9", title: "Yield estimation — kWh/kWp calculations", duration: "10min", type: "video" },
        { id: "l10", title: "System sizing design exercise", duration: "11min", type: "exercise" },
      ]},
      { id: "m3", title: "Inverters", duration: "38min", lessons: [
        { id: "l11", title: "String inverters — topology and MPPT", duration: "9min", type: "video" },
        { id: "l12", title: "Microinverters and power optimisers", duration: "8min", type: "video" },
        { id: "l13", title: "Hybrid inverters for battery systems", duration: "8min", type: "video" },
        { id: "l14", title: "Inverter selection criteria", duration: "8min", type: "video" },
        { id: "l15", title: "Inverter quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m4", title: "Battery Storage", duration: "42min", lessons: [
        { id: "l16", title: "Battery chemistries — LFP vs NMC", duration: "9min", type: "video" },
        { id: "l17", title: "Battery sizing for self-consumption", duration: "10min", type: "video" },
        { id: "l18", title: "AC vs DC coupled systems", duration: "9min", type: "video" },
        { id: "l19", title: "Battery safety and installation requirements", duration: "9min", type: "video" },
        { id: "l20", title: "Battery sizing exercise", duration: "5min", type: "exercise" },
      ]},
      { id: "m5", title: "Grid Connection", duration: "35min", lessons: [
        { id: "l21", title: "G98 — systems up to 3.68kW per phase", duration: "8min", type: "video" },
        { id: "l22", title: "G99 — larger systems, DNO approval", duration: "8min", type: "video" },
        { id: "l23", title: "Export limitation and smart export tariffs", duration: "8min", type: "video" },
        { id: "l24", title: "Generation and export metering", duration: "6min", type: "video" },
        { id: "l25", title: "Grid connection quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m6", title: "Installation & Commissioning", duration: "35min", lessons: [
        { id: "l26", title: "Roof mounting systems — rail and clamp", duration: "8min", type: "video" },
        { id: "l27", title: "DC cable sizing and routing", duration: "8min", type: "video" },
        { id: "l28", title: "Commissioning and functional testing", duration: "10min", type: "video" },
        { id: "l29", title: "Final assessment", duration: "9min", type: "quiz" },
      ]},
    ],
  },

  "industrial-control": {
    title: "Industrial Control & PLCs",
    color: "#A855F7",
    level: "Advanced",
    category: "Industrial",
    intro: "Industrial electrical work is a different world — motor starters, control panels, PLC logic, and automation systems. This course bridges the gap between domestic competency and industrial capability.",
    prerequisites: ["Electrical Fundamentals", "Three-Phase Systems"],
    outcomes: [
      "Design DOL and star-delta motor starter circuits",
      "Wire control circuits with contactors, overloads, and pilot devices",
      "Read and draw IEC-standard control circuit diagrams",
      "Write basic PLC ladder logic programs",
      "Understand industrial safety systems — E-stops, interlocks",
      "Apply safe isolation procedures for industrial equipment",
    ],
    modules: [
      { id: "m1", title: "Motor Starters", duration: "50min", lessons: [
        { id: "l1", title: "DOL starter — main and control circuit", duration: "10min", type: "video" },
        { id: "l2", title: "Star-delta starter — wiring and timer", duration: "11min", type: "video" },
        { id: "l3", title: "Soft starters — operation and parameters", duration: "9min", type: "video" },
        { id: "l4", title: "Variable speed drives — inverter drives", duration: "10min", type: "video" },
        { id: "l5", title: "Motor starter quiz", duration: "10min", type: "quiz" },
      ]},
      { id: "m2", title: "Contactors & Overloads", duration: "42min", lessons: [
        { id: "l6", title: "Contactor construction and ratings", duration: "9min", type: "video" },
        { id: "l7", title: "Auxiliary contacts and interlocking", duration: "9min", type: "video" },
        { id: "l8", title: "Thermal overload relays — setting the dial", duration: "9min", type: "video" },
        { id: "l9", title: "Electronic overloads and motor protection relays", duration: "9min", type: "video" },
        { id: "l10", title: "Contactor circuit problems", duration: "6min", type: "exercise" },
      ]},
      { id: "m3", title: "Control Circuit Diagrams", duration: "45min", lessons: [
        { id: "l11", title: "IEC 60617 symbols — reading control diagrams", duration: "10min", type: "video" },
        { id: "l12", title: "Ladder diagrams — European and American styles", duration: "9min", type: "video" },
        { id: "l13", title: "Drawing a full DOL control circuit", duration: "13min", type: "video" },
        { id: "l14", title: "Forward-reverse motor control", duration: "8min", type: "video" },
        { id: "l15", title: "Diagram reading exercises", duration: "5min", type: "exercise" },
      ]},
      { id: "m4", title: "Safety Systems", duration: "40min", lessons: [
        { id: "l16", title: "Emergency stop requirements — IEC 60204", duration: "9min", type: "video" },
        { id: "l17", title: "Safety relays and safety PLCs", duration: "9min", type: "video" },
        { id: "l18", title: "Light curtains and safety interlocks", duration: "9min", type: "video" },
        { id: "l19", title: "Safe isolation procedure — Reg 514", duration: "8min", type: "video" },
        { id: "l20", title: "Safety systems quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m5", title: "PLC Fundamentals", duration: "52min", lessons: [
        { id: "l21", title: "What is a PLC and where is it used?", duration: "8min", type: "video" },
        { id: "l22", title: "PLC architecture — CPU, I/O modules, power", duration: "9min", type: "video" },
        { id: "l23", title: "Ladder logic basics — contacts and coils", duration: "10min", type: "video" },
        { id: "l24", title: "Timers and counters in ladder logic", duration: "10min", type: "video" },
        { id: "l25", title: "Writing a simple motor control program", duration: "15min", type: "exercise" },
      ]},
      { id: "m6", title: "Panel Layout & Installation", duration: "38min", lessons: [
        { id: "l26", title: "Panel design — layout and component spacing", duration: "9min", type: "video" },
        { id: "l27", title: "Cable management inside panels", duration: "8min", type: "video" },
        { id: "l28", title: "Labelling, ferrules, and documentation", duration: "8min", type: "video" },
        { id: "l29", title: "Panel testing and commissioning checklist", duration: "8min", type: "video" },
        { id: "l30", title: "Final assessment", duration: "5min", type: "quiz" },
      ]},
    ],
  },

  "inspection-testing": {
    title: "Inspection & Testing",
    color: "#00D4FF",
    level: "Advanced",
    category: "Testing",
    intro: "Inspection and testing is the verification step that ensures electrical installations are safe. Whether you're completing an initial verification on new work or a periodic inspection on an existing installation, this course covers every test, every limit, and every form.",
    prerequisites: ["Domestic Wiring", "Protection & Fault Analysis"],
    outcomes: [
      "Carry out all tests in the correct sequence to BS 7671",
      "Use loop testers, insulation resistance testers, and RCD test equipment",
      "Calculate and verify test results against maximum allowable values",
      "Complete an Electrical Installation Certificate and test schedule",
      "Carry out Electrical Installation Condition Reports (EICRs)",
      "Identify and code observation items correctly",
    ],
    modules: [
      { id: "m1", title: "Test Sequence & Preparation", duration: "35min", lessons: [
        { id: "l1", title: "Why test sequence matters — safety", duration: "8min", type: "video" },
        { id: "l2", title: "Dead tests before live tests", duration: "7min", type: "video" },
        { id: "l3", title: "Test instrument calibration and leads", duration: "7min", type: "video" },
        { id: "l4", title: "BS 7671 Appendix 6 test schedule", duration: "8min", type: "video" },
        { id: "l5", title: "Preparation quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m2", title: "Continuity Testing", duration: "42min", lessons: [
        { id: "l6", title: "Ring final continuity — three tests explained", duration: "10min", type: "video" },
        { id: "l7", title: "Protective conductor continuity", duration: "9min", type: "video" },
        { id: "l8", title: "Main and supplementary bonding continuity", duration: "8min", type: "video" },
        { id: "l9", title: "Continuity test results — limits and recording", duration: "9min", type: "video" },
        { id: "l10", title: "Continuity exercise", duration: "6min", type: "exercise" },
      ]},
      { id: "m3", title: "Insulation Resistance", duration: "38min", lessons: [
        { id: "l11", title: "IR testing principles — 500V, 1000V", duration: "9min", type: "video" },
        { id: "l12", title: "Testing between live conductors and earth", duration: "8min", type: "video" },
        { id: "l13", title: "Low IR readings — causes and diagnosis", duration: "9min", type: "video" },
        { id: "l14", title: "Electronic equipment and IR testing", duration: "7min", type: "video" },
        { id: "l15", title: "IR testing quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m4", title: "Earth Fault Loop Impedance", duration: "40min", lessons: [
        { id: "l16", title: "External impedance Ze measurement", duration: "9min", type: "video" },
        { id: "l17", title: "Total loop impedance Zs measurement", duration: "9min", type: "video" },
        { id: "l18", title: "Comparing Zs to Table 41.1 limits", duration: "9min", type: "video" },
        { id: "l19", title: "Correcting excessive Zs readings", duration: "8min", type: "video" },
        { id: "l20", title: "Zs measurement exercise", duration: "5min", type: "exercise" },
      ]},
      { id: "m5", title: "RCD Testing", duration: "35min", lessons: [
        { id: "l21", title: "RCD tripping current tests — half-rated and rated", duration: "8min", type: "video" },
        { id: "l22", title: "RCD trip time testing at 1× and 5× rated current", duration: "9min", type: "video" },
        { id: "l23", title: "Maximum trip time limits for different RCD types", duration: "7min", type: "video" },
        { id: "l24", title: "Recording RCD test results", duration: "6min", type: "video" },
        { id: "l25", title: "RCD testing quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m6", title: "Polarity & PFC", duration: "28min", lessons: [
        { id: "l26", title: "Polarity testing — dead and live methods", duration: "8min", type: "video" },
        { id: "l27", title: "PFC measurement at origin and boards", duration: "8min", type: "video" },
        { id: "l28", title: "Verifying PFC against device ratings", duration: "7min", type: "video" },
        { id: "l29", title: "Polarity and PFC quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m7", title: "Certification & EICRs", duration: "35min", lessons: [
        { id: "l30", title: "EIC — Electrical Installation Certificate", duration: "8min", type: "video" },
        { id: "l31", title: "Minor Works Certificate — when to use", duration: "7min", type: "video" },
        { id: "l32", title: "EICR — periodic inspection", duration: "8min", type: "video" },
        { id: "l33", title: "Observation codes C1, C2, C3, FI", duration: "7min", type: "video" },
        { id: "l34", title: "EICR coding exercise", duration: "5min", type: "exercise" },
      ]},
      { id: "m8", title: "Final Assessment", duration: "30min", lessons: [
        { id: "l35", title: "Full mock test schedule — complete it", duration: "20min", type: "exercise" },
        { id: "l36", title: "Final written assessment", duration: "10min", type: "quiz" },
      ]},
    ],
  },

  "led-lighting": {
    title: "LED & Lighting Design",
    color: "#F0A500",
    level: "Beginner",
    category: "Technology",
    intro: "LEDs have replaced every other light source in commercial and domestic installations. Understanding the technology, driver circuits, emergency lighting, and lux calculations makes you a more complete electrician.",
    prerequisites: ["Electrical Fundamentals (or equivalent understanding of voltage and current)"],
    outcomes: [
      "Explain how LEDs work and why they're efficient",
      "Select driver types — constant current, constant voltage, DALI",
      "Design emergency lighting to BS 5266",
      "Calculate illuminance levels using the lumen method",
      "Specify dimming and control systems for commercial projects",
      "Understand colour rendering, colour temperature, and glare ratings",
    ],
    modules: [
      { id: "m1", title: "LED Technology", duration: "35min", lessons: [
        { id: "l1", title: "How LEDs produce light — p-n junction", duration: "8min", type: "video" },
        { id: "l2", title: "Efficacy — lumens per watt explained", duration: "7min", type: "video" },
        { id: "l3", title: "LED chip formats — COB, SMD, filament", duration: "7min", type: "video" },
        { id: "l4", title: "Thermal management — heatsinks and junction temperature", duration: "8min", type: "video" },
        { id: "l5", title: "LED technology quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m2", title: "Driver Circuits", duration: "38min", lessons: [
        { id: "l6", title: "Constant current vs constant voltage drivers", duration: "9min", type: "video" },
        { id: "l7", title: "Driver efficiency and power factor", duration: "8min", type: "video" },
        { id: "l8", title: "Dimming methods — PWM, 0-10V, DALI", duration: "9min", type: "video" },
        { id: "l9", title: "Driver selection and compatibility", duration: "7min", type: "video" },
        { id: "l10", title: "Driver circuit quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m3", title: "Emergency Lighting", duration: "35min", lessons: [
        { id: "l11", title: "BS 5266 categories — escape, standby, high-risk", duration: "8min", type: "video" },
        { id: "l12", title: "Self-contained vs central battery systems", duration: "8min", type: "video" },
        { id: "l13", title: "Maintained vs non-maintained operation", duration: "7min", type: "video" },
        { id: "l14", title: "Testing requirements and log books", duration: "7min", type: "video" },
        { id: "l15", title: "Emergency lighting quiz", duration: "5min", type: "quiz" },
      ]},
      { id: "m4", title: "Lux Calculations", duration: "30min", lessons: [
        { id: "l16", title: "Illuminance, luminous flux, and efficacy", duration: "7min", type: "video" },
        { id: "l17", title: "Lumen method — average illuminance", duration: "8min", type: "video" },
        { id: "l18", title: "Room index, UF, and MF", duration: "7min", type: "video" },
        { id: "l19", title: "Lux calculation worked example", duration: "8min", type: "exercise" },
      ]},
      { id: "m5", title: "Lighting Control & Quality", duration: "32min", lessons: [
        { id: "l20", title: "Colour temperature — warm, neutral, cool white", duration: "7min", type: "video" },
        { id: "l21", title: "Colour rendering index (Ra/CRI)", duration: "6min", type: "video" },
        { id: "l22", title: "Glare — UGR and how to reduce it", duration: "7min", type: "video" },
        { id: "l23", title: "Smart lighting systems — DALI 2 and IoT", duration: "7min", type: "video" },
        { id: "l24", title: "Final assessment", duration: "5min", type: "quiz" },
      ]},
    ],
  },
};

interface Lesson { id: string; title: string; duration: string; type: "video" | "quiz" | "exercise"; }
interface Module { id: string; title: string; duration: string; lessons: Lesson[]; }

const LESSON_ICONS = { video: "▶", quiz: "✦", exercise: "⚡" };
const LESSON_COLORS = { video: "#00D4FF", quiz: "#A855F7", exercise: "#F0A500" };

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = COURSES[slug];

  const [expanded, setExpanded] = useState<Set<string>>(new Set(["m1"]));
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    try {
      const key = `ec-completed-${slug}`;
      const saved = localStorage.getItem(key);
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, [slug]);

  const toggleComplete = (lessonId: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      try {
        localStorage.setItem(`ec-completed-${slug}`, JSON.stringify([...next]));
        // Update overall progress
        if (course) {
          const total = course.modules.reduce((a, m) => a + m.lessons.length, 0);
          const pct = Math.round((next.size / total) * 100);
          const allProg = JSON.parse(localStorage.getItem("ec-progress") || "{}");
          allProg[slug] = pct;
          localStorage.setItem("ec-progress", JSON.stringify(allProg));
        }
      } catch {}
      return next;
    });
  };

  if (!course) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <div style={{ fontSize: "3rem" }}>🔌</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Course not found</h1>
        <Link href="/learn" style={{ color: "var(--core)", textDecoration: "none" }}>← Back to all courses</Link>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const progressPct = Math.round((completed.size / totalLessons) * 100);
  const totalMinutes = course.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + parseInt(l.duration), 0), 0);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/calculate" className="nav-link">Calculate</Link>
          <Link href="/guides" className="nav-link">Guides</Link>
          <Link href="/learn" className="nav-link" style={{ color: "var(--core)" }}>← All Courses</Link>
        </div>
        <Link href="/calculate" className="nav-cta">Open Calculator</Link>
      </nav>

      <main style={{ paddingTop: "64px" }}>
        {/* COURSE HERO */}
        <div className="course-page-hero" style={{ borderBottom: `1px solid rgba(${course.color === "#F0A500" ? "240,165,0" : course.color === "#34D399" ? "52,211,153" : course.color === "#00D4FF" ? "0,212,255" : course.color === "#A855F7" ? "168,85,247" : "255,107,53"},0.2)` }}>
          <div className="course-page-hero-glow" style={{ background: `radial-gradient(ellipse 60% 70% at 0% 50%, ${course.color}22 0%, transparent 60%)` }} />
          <div className="course-page-hero-inner">
            {/* Breadcrumb */}
            <div className="course-breadcrumb">
              <Link href="/learn" style={{ color: "var(--text-mute)", textDecoration: "none", fontSize: "0.82rem" }}>Courses</Link>
              <span style={{ color: "var(--text-mute)", margin: "0 6px" }}>›</span>
              <span style={{ color: course.color, fontSize: "0.82rem" }}>{course.category}</span>
            </div>
            {/* Title block */}
            <div className="course-page-layout">
              <div className="course-page-left">
                <div className="course-level-tag" style={{ color: course.color, borderColor: `${course.color}44`, background: `${course.color}14` }}>
                  {course.level}
                </div>
                <h1 className="course-page-title">{course.title}</h1>
                <p className="course-page-intro">{course.intro}</p>
                {/* Meta row */}
                <div className="course-meta-row">
                  {[
                    { icon: "📚", label: `${course.modules.length} modules` },
                    { icon: "🎬", label: `${totalLessons} lessons` },
                    { icon: "⏱", label: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}min` },
                    { icon: "🆓", label: "Free forever" },
                  ].map(m => (
                    <span key={m.label} className="course-meta-item">
                      <span>{m.icon}</span> {m.label}
                    </span>
                  ))}
                </div>
                {/* Progress */}
                {completed.size > 0 && (
                  <div className="course-progress-section">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Your progress</span>
                      <span style={{ fontSize: "0.8rem", color: course.color, fontWeight: 700 }}>{progressPct}%</span>
                    </div>
                    <div className="course-progress-track">
                      <div className="course-progress-fill-bar" style={{ width: `${progressPct}%`, background: course.color }} />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-mute)", marginTop: "0.3rem" }}>
                      {completed.size} of {totalLessons} lessons complete
                    </div>
                  </div>
                )}
              </div>
              {/* Side cards */}
              <div className="course-page-sidebar">
                <div className="course-sidebar-card">
                  <h3 className="sidebar-card-title">What you&apos;ll learn</h3>
                  <ul className="sidebar-outcomes">
                    {course.outcomes.map((o, i) => (
                      <li key={i} className="sidebar-outcome">
                        <span style={{ color: course.color, flexShrink: 0 }}>✓</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="course-sidebar-card" style={{ marginTop: "1rem" }}>
                  <h3 className="sidebar-card-title">Prerequisites</h3>
                  <ul className="sidebar-prereqs">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "0.4rem", paddingLeft: "1rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--text-mute)" }}>·</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRICULUM */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
          <div className="curriculum-layout">
            <div className="curriculum-main">
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                Course Curriculum
              </h2>
              <div className="modules-list">
                {course.modules.map((mod, mi) => {
                  const isOpen = expanded.has(mod.id);
                  const modCompleted = mod.lessons.filter(l => completed.has(l.id)).length;
                  return (
                    <div key={mod.id} className="module-item">
                      <button
                        className="module-header"
                        onClick={() => setExpanded(prev => {
                          const n = new Set(prev);
                          if (n.has(mod.id)) n.delete(mod.id); else n.add(mod.id);
                          return n;
                        })}
                      >
                        <div className="module-header-left">
                          <div className="module-num" style={{ color: course.color }}>
                            {String(mi + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <div className="module-title">{mod.title}</div>
                            <div className="module-subtitle">
                              {mod.lessons.length} lessons · {mod.duration}
                              {modCompleted > 0 && (
                                <span style={{ color: course.color, marginLeft: 8 }}>· {modCompleted}/{mod.lessons.length} done</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="module-chevron" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                      </button>
                      {isOpen && (
                        <div className="module-lessons">
                          {mod.lessons.map((lesson, li) => {
                            const isDone = completed.has(lesson.id);
                            const isActive = activeLesson === lesson.id;
                            return (
                              <div key={lesson.id} className={`lesson-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                                onClick={() => setActiveLesson(isActive ? null : lesson.id)}>
                                <div className="lesson-left">
                                  <button
                                    className="lesson-check"
                                    style={{ borderColor: isDone ? course.color : undefined, background: isDone ? course.color : undefined }}
                                    onClick={e => { e.stopPropagation(); toggleComplete(lesson.id); }}
                                    title={isDone ? "Mark incomplete" : "Mark complete"}
                                  >
                                    {isDone && <span style={{ color: "#000", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>}
                                  </button>
                                  <span className="lesson-type-icon" style={{ color: LESSON_COLORS[lesson.type] }}>
                                    {LESSON_ICONS[lesson.type]}
                                  </span>
                                  <div>
                                    <div className="lesson-title" style={{ color: isDone ? "var(--text-mute)" : undefined, textDecoration: isDone ? "line-through" : undefined }}>
                                      {String(li + 1).padStart(2, "0")}. {lesson.title}
                                    </div>
                                  </div>
                                </div>
                                <div className="lesson-right">
                                  <span className="lesson-type-badge" style={{ color: LESSON_COLORS[lesson.type], background: `${LESSON_COLORS[lesson.type]}15`, border: `1px solid ${LESSON_COLORS[lesson.type]}30` }}>
                                    {lesson.type}
                                  </span>
                                  <span className="lesson-duration">{lesson.duration}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Sticky progress sidebar */}
            <div className="curriculum-sidebar">
              <div className="progress-sticky-card" style={{ borderColor: `${course.color}30` }}>
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                  <div className="progress-ring-wrap">
                    <svg viewBox="0 0 80 80" width="80" height="80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="34" fill="none" stroke={course.color} strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 34 * progressPct / 100} ${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                        strokeLinecap="round" strokeDashoffset={2 * Math.PI * 34 * 0.25}
                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                      />
                      <text x="40" y="46" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="16" fontWeight="900" fill={course.color}>{progressPct}%</text>
                    </svg>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
                    {completed.size} / {totalLessons} lessons
                  </div>
                </div>
                <div className="progress-stats">
                  {[
                    { label: "Modules", val: course.modules.length },
                    { label: "Hours", val: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m` },
                    { label: "Level", val: course.level },
                    { label: "Cost", val: "Free" },
                  ].map(s => (
                    <div key={s.label} className="progress-stat-row">
                      <span style={{ color: "var(--text-mute)", fontSize: "0.8rem" }}>{s.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: s.label === "Cost" ? "#34D399" : "var(--text)" }}>{s.val}</span>
                    </div>
                  ))}
                </div>
                {completed.size > 0 && (
                  <button
                    onClick={() => {
                      setCompleted(new Set());
                      try {
                        localStorage.removeItem(`ec-completed-${slug}`);
                        const allProg = JSON.parse(localStorage.getItem("ec-progress") || "{}");
                        delete allProg[slug];
                        localStorage.setItem("ec-progress", JSON.stringify(allProg));
                      } catch {}
                    }}
                    style={{ width: "100%", marginTop: "1rem", padding: "8px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-mute)", fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    Reset progress
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .course-page-hero { position: relative; overflow: hidden; background: var(--bg); padding: 3.5rem 0 3rem; }
        .course-page-hero-glow { position: absolute; inset: 0; pointer-events: none; }
        .course-page-hero-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
        .course-breadcrumb { display: flex; align-items: center; margin-bottom: 1.25rem; }
        .course-page-layout { display: grid; grid-template-columns: 1fr 360px; gap: 3rem; align-items: start; }
        @media (max-width: 900px) { .course-page-layout { grid-template-columns: 1fr; } .course-page-sidebar { display: none; } }
        .course-level-tag { display: inline-flex; padding: 3px 12px; border-radius: 100px; border: 1px solid; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
        .course-page-title { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
        .course-page-intro { font-size: 1rem; color: var(--text-dim); line-height: 1.75; margin-bottom: 1.5rem; max-width: 580px; }
        .course-meta-row { display: flex; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .course-meta-item { display: flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-dim); }
        .course-progress-section { padding: 1rem; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); }
        .course-progress-track { height: 4px; border-radius: 100px; background: var(--border); overflow: hidden; }
        .course-progress-fill-bar { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
        .course-sidebar-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; }
        .sidebar-card-title { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-mute); margin-bottom: 0.875rem; }
        .sidebar-outcomes { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .sidebar-outcome { display: flex; gap: 8px; font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; }
        .sidebar-prereqs { list-style: none; }
        .curriculum-layout { display: grid; grid-template-columns: 1fr 280px; gap: 3rem; align-items: start; }
        @media (max-width: 900px) { .curriculum-layout { grid-template-columns: 1fr; } .curriculum-sidebar { display: none; } }
        .modules-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .module-item { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .module-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--bg2); border: none; cursor: pointer; text-align: left; transition: background 0.2s; }
        .module-header:hover { background: var(--bg3); }
        .module-header-left { display: flex; align-items: center; gap: 1rem; }
        .module-num { font-family: 'JetBrains Mono', monospace; font-size: 1rem; font-weight: 700; }
        .module-title { font-size: 0.95rem; font-weight: 700; color: var(--text); }
        .module-subtitle { font-size: 0.78rem; color: var(--text-mute); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }
        .module-chevron { font-size: 1.3rem; color: var(--text-mute); transition: transform 0.25s; line-height: 1; }
        .module-lessons { border-top: 1px solid var(--border); }
        .lesson-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; cursor: pointer; transition: background 0.15s; gap: 0.5rem; }
        .lesson-item:hover { background: rgba(255,255,255,0.025); }
        .lesson-item.done { opacity: 0.6; }
        .lesson-left { display: flex; align-items: center; gap: 0.875rem; flex: 1; min-width: 0; }
        .lesson-check { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .lesson-type-icon { font-size: 0.75rem; flex-shrink: 0; width: 18px; text-align: center; }
        .lesson-title { font-size: 0.875rem; color: var(--text-dim); line-height: 1.4; }
        .lesson-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
        .lesson-type-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 2px 7px; border-radius: 100px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .lesson-duration { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-mute); white-space: nowrap; }
        .progress-sticky-card { position: sticky; top: 90px; background: var(--bg2); border: 1px solid; border-radius: 14px; padding: 1.5rem; }
        .progress-ring-wrap { display: flex; justify-content: center; }
        .progress-stats { display: flex; flex-direction: column; gap: 0.6rem; }
        .progress-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
        .progress-stat-row:last-child { border-bottom: none; }
      `}</style>
    </>
  );
}
