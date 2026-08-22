"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import { ElectraCoreLogoMark } from "../../components/Logo";
import { loadCourseLearning, recordAssessment, recordExercise, resetCourseLearning, saveLastLesson, saveLessonCompletion } from "../progress";
import { getEnhancedLesson } from "../enhancedLessons";
import { EnhancedLessonView } from "../EnhancedLessonView";
import { OPEN_PREVIEW_NOTICE, evaluateLearningAccess } from "../accessPolicy";

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

/* ─── Lesson Content Helpers ─── */

function getLessonBody(title: string, slug: string, moduleTitle: string): { points: string[]; formula?: string; diagram?: React.ReactNode } {
  const t = title.toLowerCase();

  if (t.includes("ohm") || t.includes("v = i") || (t.includes("voltage") && t.includes("current") && t.includes("resistance"))) {
    return {
      points: [
        "Ohm's Law states the relationship between voltage (V), current (I), and resistance (R): V = I × R",
        "If you know any two values, you can calculate the third. Voltage is measured in volts (V), current in amperes (A), resistance in ohms (Ω).",
        "A higher resistance means less current flows for the same voltage. Doubling the resistance halves the current.",
        "Power can be calculated from any two values: P = V × I = I² × R = V² / R",
      ],
      formula: "V = I × R    |    I = V/R    |    R = V/I",
      diagram: <OhmsLawDiagram />,
    };
  }
  if (t.includes("kirchhoff") || t.includes("kcl") || t.includes("kvl") || t.includes("nodal") || t.includes("mesh")) {
    return {
      points: [
        "Kirchhoff's Current Law (KCL): The sum of currents entering any node equals the sum leaving. ΣI_in = ΣI_out",
        "Kirchhoff's Voltage Law (KVL): The sum of all voltage drops around any closed loop equals zero. ΣV = 0",
        "Use KCL to write equations at each node in the circuit. Use KVL for each independent loop.",
        "These laws hold for any circuit — DC or AC — and form the basis of all systematic circuit analysis.",
      ],
      formula: "KCL: ΣI_in = ΣI_out    |    KVL: ΣV_loop = 0",
      diagram: <KirchhoffDiagram />,
    };
  }
  if (t.includes("power") && !t.includes("three-phase")) {
    return {
      points: [
        "Electrical power (P) is the rate of energy transfer, measured in watts (W). One watt = one joule per second.",
        "P = V × I for DC circuits. For AC circuits, this gives apparent power (VA), while real power accounts for power factor: P = V × I × cos(φ)",
        "Energy is power over time: E = P × t. Your electricity bill charges for kilowatt-hours (kWh = 1000W × 3600s).",
        "Cable losses are proportional to current squared: P_loss = I² × R. This is why high-voltage transmission is more efficient.",
      ],
      formula: "P = V × I = I² × R = V² / R",
      diagram: <PowerTriangleDiagram />,
    };
  }
  if (t.includes("series") || t.includes("parallel")) {
    return {
      points: [
        "Series circuits: current is the same everywhere. Total resistance = R₁ + R₂ + R₃. Voltage divides between components.",
        "Parallel circuits: voltage is the same across all branches. Total resistance: 1/R_total = 1/R₁ + 1/R₂. Current divides between branches.",
        "Series: if one component fails open, the whole circuit stops. Parallel: if one branch fails open, others continue.",
        "Most real installations use parallel connections so that switching off one load doesn't affect others.",
      ],
      formula: "Series: R_T = R₁+R₂    |    Parallel: 1/R_T = 1/R₁+1/R₂",
      diagram: <SeriesParallelDiagram />,
    };
  }
  if (t.includes("rcd") || t.includes("rcbo") || t.includes("residual")) {
    return {
      points: [
        "An RCD (Residual Current Device) compares current in the live and neutral conductors. Any difference means current is escaping — through a fault or a person.",
        "A 30mA RCD trips in <40ms when it detects 30mA imbalance. 30mA through the heart can cause ventricular fibrillation; the fast trip prevents it.",
        "Type A RCDs detect both AC and pulsed DC residual currents (needed for modern electronics with half-wave rectification). Type B also detects smooth DC.",
        "RCBOs combine RCD protection with overcurrent protection (MCB) in a single device — ideal for individual circuit protection.",
      ],
      diagram: <RCDBalanceDiagram />,
    };
  }
  if (t.includes("cable") && (t.includes("siz") || t.includes("ccc") || t.includes("capac"))) {
    return {
      points: [
        "Cable current-carrying capacity (CCC) depends on: conductor cross-section, insulation type, installation method, and ambient temperature.",
        "Larger cross-section = lower resistance = more current capacity and less voltage drop. Common domestic sizes: 1.5mm² (lighting), 2.5mm² (ring final), 6mm² (cooker).",
        "Derating factors reduce the tabulated CCC: Ca for ambient temperature above 30°C, Cg for grouping with other cables, Ci for thermal insulation.",
        "Always verify voltage drop stays within limits (typically 3% for lighting, 5% for power) using: Vd = (mV/A/m × I × L) / 1000",
      ],
      formula: "It = Ib / (Ca × Cg × Ci × Cc)",
      diagram: <CableDeratingDiagram />,
    };
  }
  if (t.includes("voltage drop") || t.includes("vd")) {
    return {
      points: [
        "Voltage drop is the reduction in voltage along a conductor due to resistance. Long cable runs and high currents cause larger drops.",
        "BS 7671 limits voltage drop to 3% for lighting circuits and 5% for power circuits from the origin of the installation.",
        "The mV/A/m value from BS 7671 Table 4D2B gives the voltage drop per amp per metre for a specific cable size.",
        "Voltage drop (V) = (mV/A/m × design current × length) ÷ 1000. For a 10m run at 16A with 2.5mm² cable (18mV/A/m): Vd = (18 × 16 × 10) / 1000 = 2.88V",
      ],
      formula: "Vd = (mV/A/m × Ib × L) / 1000",
      diagram: <VoltageDropRunDiagram />,
    };
  }
  if (t.includes("three-phase") || t.includes("star") || t.includes("delta") || t.includes("three phase")) {
    return {
      points: [
        "Three-phase systems use three conductors with voltages 120° apart in phase. This gives a smooth power output (no dead spots like single-phase).",
        "Star (Y) connection: line voltage = √3 × phase voltage. UK supply: 400V line, 230V phase. The neutral carries unbalanced current.",
        "Delta (Δ) connection: line voltage = phase voltage. Line current = √3 × phase current. No neutral needed for balanced loads.",
        "Three-phase power: P = √3 × V_L × I_L × cos(φ) for balanced loads, or sum each phase individually for unbalanced loads.",
      ],
      formula: "V_L = √3 × V_ph (star)    |    I_L = √3 × I_ph (delta)",
      diagram: <ThreePhaseWaveDiagram />,
    };
  }
  if (t.includes("mcb") || t.includes("fuse") || t.includes("overcurrent")) {
    return {
      points: [
        "MCBs (Miniature Circuit Breakers) protect cables from overloads and short circuits. Type B trips at 3–5× rated current, Type C at 5–10×, Type D at 10–20×.",
        "Type B: general domestic use (resistive loads). Type C: motors and fluorescent lighting with moderate inrush. Type D: heavy inrush loads — welders, transformers.",
        "The rated current (In) must be ≥ the design current (Ib) and ≤ the cable CCC (Iz): Ib ≤ In ≤ Iz",
        "Under short circuit, the MCB must operate fast enough that the cable's adiabatic limit isn't exceeded: k²S² ≥ I²t",
      ],
      formula: "Ib ≤ In ≤ Iz    |    I₂ ≤ 1.45 × Iz",
      diagram: <MCBCurveDiagram />,
    };
  }
  if (t.includes("solar") || t.includes("pv") || t.includes("photovoltaic") || t.includes("inverter")) {
    return {
      points: [
        "Photovoltaic (PV) cells convert photons into electron-hole pairs via the p-n junction. Current is generated when electrons flow through an external circuit.",
        "Key panel specs: Voc (open circuit voltage), Vmp (max power voltage), Isc (short circuit current), Imp (max power current), Pmax (rated power in Wp).",
        "String sizing: total string voltage = Voc × number of panels must stay within the inverter's input voltage window at the coldest expected temperature.",
        "MPPT (Maximum Power Point Tracking) continuously adjusts the operating point to extract maximum power as irradiance and temperature change.",
      ],
      formula: "Pmax = Vmp × Imp    |    Yield = Pmax(kWp) × H(kWh/m²)",
      diagram: <PVSystemDiagram />,
    };
  }
  if (t.includes("motor") || t.includes("induction") || t.includes("dol") || t.includes("star-delta")) {
    return {
      points: [
        "Three-phase induction motors work by the stator creating a rotating magnetic field. The rotor 'slips' behind the field, inducing currents that create torque.",
        "DOL (Direct On Line) starters connect the motor directly to supply — simple but causes high inrush current (5–8× FLC), causing voltage dips on the supply.",
        "Star-delta starting reduces starting current to 1/3 of DOL by starting in star (low voltage per winding) then switching to delta for running.",
        "Motor nameplate shows: rated power (kW), voltage (V), frequency (Hz), full load current (A), power factor, speed (RPM), and efficiency class (IE2, IE3).",
      ],
      diagram: <DOLStarterDiagram />,
    };
  }
  if (t.includes("atom") || t.includes("electron") || t.includes("electricity") || t.includes("charge")) {
    return {
      points: [
        "Atoms consist of a nucleus (protons + neutrons) surrounded by electrons in shells. The outer 'valence' electrons determine electrical behaviour.",
        "Conductors have loosely bound valence electrons (metals like copper, aluminium) that can drift under an electric field — this is electric current.",
        "Conventional current flows from positive to negative (outside the source). Actual electron flow is from negative to positive. Both descriptions are used.",
        "One coulomb of charge = 6.24 × 10¹⁸ electrons. Current of 1 ampere = 1 coulomb passing a point per second (I = Q/t).",
      ],
      formula: "I = Q / t    |    Q = I × t",
      diagram: <AtomDiagram />,
    };
  }
  if (t.includes("earthing") || t.includes("bonding") || t.includes("earth")) {
    return {
      points: [
        "Earthing connects metalwork to the general mass of earth to ensure fault currents can flow back to source, operating the protective device rapidly.",
        "TN-S systems have separate neutral and earth conductors all the way from the transformer. TN-C-S (PME) combines them at the source, splitting at the consumer unit.",
        "TT systems have no metallic earth return — a local earth electrode must be installed. Earth fault loop impedance is high, requiring RCDs for protection.",
        "Main protective bonding connects extraneous conductive parts (gas, water, structural steel) to the main earth terminal to equalise potentials.",
      ],
      diagram: <EarthingMiniDiagram />,
    };
  }
  if (t.includes("ac") && (t.includes("dc") || t.includes("alternating"))) {
    return {
      points: [
        "DC (Direct Current) flows in one direction only. AC (Alternating Current) reverses direction sinusoidally, typically 50 times per second (50Hz in UK/Europe).",
        "AC won over DC for distribution because transformers only work on AC — they allow voltage to be stepped up for efficient long-distance transmission, then down for safe use.",
        "RMS (Root Mean Square) voltage is the DC-equivalent value. For a pure sine wave: V_rms = V_peak / √2. UK mains: 230V rms = 325V peak.",
        "Frequency (f) is the number of complete cycles per second (Hz). Period T = 1/f = 20ms at 50Hz. Angular frequency ω = 2πf.",
      ],
      formula: "V_rms = V_peak / √2    |    T = 1/f",
      diagram: <ACWaveDiagram />,
    };
  }
  if (t.includes("inspection") || t.includes("testing") || t.includes("continuity") || t.includes("insulation resistance")) {
    return {
      points: [
        "Electrical testing must follow a specific sequence: dead tests first (continuity, IR), then live tests (polarity, loop impedance, RCD).",
        "Insulation resistance (IR) testing: apply 500V DC between live conductors and earth. Result must be ≥1MΩ (BS 7671 Table 64). Higher is better.",
        "Continuity testing verifies all conductors are intact and ring finals are correctly wired. The 'end-to-end' and 'long lead' methods both confirm ring integrity.",
        "Earth fault loop impedance (Zs) is measured live. Compare against Table 41.1 maximums — exceeding these means the protective device may not operate in time.",
      ],
      diagram: <TestSequenceDiagram />,
    };
  }
  if (t.includes("led") || t.includes("lighting") || t.includes("lux") || t.includes("lumens")) {
    return {
      points: [
        "LEDs produce light via electroluminescence — electrons recombine with holes in a semiconductor, emitting photons. No filament, no UV, very low heat relative to output.",
        "Efficacy (lm/W) measures efficiency. Incandescent: ~10 lm/W. LED: 80–200 lm/W. Higher efficacy = less energy for the same light output.",
        "Colour temperature: warm white (2700K) for residential comfort, neutral white (4000K) for offices, cool white (6500K) for task/retail. Higher K = bluer light.",
        "CRI (Colour Rendering Index / Ra): how accurately the light reveals colours compared to sunlight (Ra=100). Minimum Ra 80 for most applications; Ra 90+ for colour-critical work.",
      ],
      formula: "E (lux) = F × UF × MF / A    |    F = lumens, A = area (m²)",
      diagram: <LEDLuxDiagram />,
    };
  }
  // Generic fallback
  return {
    points: [
      `${moduleTitle} is a core skill area in electrical engineering. This lesson covers ${title.replace(/\s+—.*/, "")}.`,
      "Understanding this topic is essential for both safety compliance and practical installation work in the field.",
      "Work through the examples and take notes on the key values and limits — these frequently appear in trade exams and on-site decisions.",
      "Cross-reference with BS 7671 (the IET Wiring Regulations) for the specific regulation numbers that govern this area.",
    ],
  };
}

function getQuizForLesson(title: string, slug: string): { question: string; options: string[]; correct: number; explanation: string } | null {
  const t = title.toLowerCase();
  if (slug === "solar-pv" && t.includes("inverter quiz")) {
    return { question: "A grid-connected hybrid inverter is rated 5 kW but its EPS output is rated 3 kW. Which statement is correct?", options: ["Backup loads must satisfy the separate 3 kW continuous, surge, energy and protection limits", "All 5 kW is automatically available during an outage", "Anti-islanding makes every circuit a backup circuit", "The battery can be connected without manufacturer approval"], correct: 0, explanation: "Grid and EPS ports have separate declared capabilities; backup also requires deliberate switching, earthing, protection and circuit selection." };
  }
  if (slug === "solar-pv" && t.includes("pv physics quiz")) {
    return { question: "Which values govern the two opposing string-length voltage checks?", options: ["Cold corrected Voc for the maximum, and hot corrected Vmp for MPPT operation", "Hot Isc for both checks", "STC power divided by annual yield", "Ambient temperature with no module coefficient"], correct: 0, explanation: "Cold cells raise Voc and set the upper series limit; hot cells lower Vmp and can set the minimum viable operating string length." };
  }
  if (slug === "cable-sizing" && t.includes("fire cable quiz")) {
    return { question: "Which statement correctly distinguishes an LSOH cable from a fire-resistant circuit-integrity cable?", options: ["LSOH limits declared smoke/halogen behavior; circuit integrity requires separate exact test/category evidence", "Every LSOH cable maintains power for 120 minutes", "Red sheath proves enhanced fire resistance", "Fire-resistant cable needs no fire-resistant supports"], correct: 0, explanation: "Reaction/smoke characteristics and continued circuit function are separate claims; the complete tested cable, accessories, supports and installation must match the required application category." };
  }
  if (slug === "cable-sizing" && t.includes("final assessment")) {
    return { question: "A cable passes corrected current capacity but exceeds its allocated voltage-drop budget. What is the correct design decision?", options: ["Reject or redesign the candidate, then repeat every affected design gate", "Approve it because thermal capacity has priority", "Round the drop down to the limit", "Increase the protective-device rating"], correct: 0, explanation: "Every applicable gate must pass. Changing cable, route, load or protection changes dependent thermal, voltage-drop, fault and coordination results." };
  }
  if (slug === "three-phase-systems" && t.includes("final assessment")) {
    return {
      question: "A four-pole, 50 Hz induction motor runs at 1440 rpm. What are synchronous speed and slip?",
      options: ["1500 rpm and 4.0%", "1440 rpm and 4.0%", "3000 rpm and 52%", "1500 rpm and 96%"],
      correct: 0,
      explanation: "ns = 120f/P = 1500 rpm. Slip = (1500 − 1440)/1500 = 0.040 = 4.0%.",
    };
  }
  if (slug === "three-phase-systems" && t.includes("transformer quiz")) {
    return {
      question: "What does the vector group Dyn11 state?",
      options: ["HV delta, LV star with accessible neutral, clock-11 displacement", "HV star, LV delta, eleven neutral points", "Both windings delta with 11% impedance", "A single-phase transformer with an 11:1 ratio"],
      correct: 0,
      explanation: "D denotes the high-voltage delta winding, yn the low-voltage star winding with its neutral brought out, and 11 the declared 30-degree-step clock displacement.",
    };
  }
  if (slug === "three-phase-systems" && t.includes("three-phase power quiz")) {
    return {
      question: "A balanced 400 V load draws 20 A at 0.80 lagging power factor. Which power set is correct?",
      options: ["S = 13.86 kVA, P = 11.09 kW, Q = 8.31 kvar", "S = 16.00 kVA, P = 12.80 kW, Q = 9.60 kvar", "S = 11.09 kVA, P = 13.86 kW, Q = 8.31 kvar", "S = 13.86 kW, P = 8.31 kvar, Q = 11.09 kVA"],
      correct: 0,
      explanation: "S = root(3) × 400 × 20 = 13.86 kVA; P = S × 0.80 = 11.09 kW; with sin(phi) = 0.60, Q = 8.31 kvar lagging.",
    };
  }
  if (slug === "three-phase-systems" && t.includes("phase fundamentals quiz")) {
    return {
      question: "A verified L1-L2-L3 supply has L2 and L3 interchanged. What happens downstream?",
      options: ["The phase sequence reverses", "The sequence is unchanged because labels do not matter", "Frequency doubles", "Only line voltage changes"],
      correct: 0,
      explanation: "Interchanging any one pair reverses the phase sequence. Cyclic relabelling would preserve the order, but a pair swap changes it.",
    };
  }
  if (slug === "protection-fault-analysis" && t.includes("final assessment")) {
    return {
      question: "Which statement correctly distinguishes selectivity from backup protection?",
      options: ["Selectivity aims to keep the upstream device closed; backup protection permits upstream assistance with fault interruption", "Both terms guarantee only the downstream device opens", "Backup protection proves total selectivity", "A current-rating ratio proves both"],
      correct: 0,
      explanation: "Selectivity and backup protection are separate coordination claims. Both require exact paired-device evidence for the stated voltage, fault-current range, and assembly conditions.",
    };
  }
  if (slug === "protection-fault-analysis" && t.includes("rcd selection quiz")) {
    return {
      question: "Which statement correctly distinguishes a Type B RCD from a B-curve MCB?",
      options: ["Type B describes residual-current waveform capability; B curve describes an overcurrent instantaneous operating band", "They are two names for the same device", "Type B RCD means 30 mA and B curve means 30 A", "Both markings only describe breaking capacity"],
      correct: 0,
      explanation: "RCD type letters describe residual-current waveform response, while MCB curve letters describe overcurrent operating characteristics. The exact product may combine functions, but each marking keeps its own meaning.",
    };
  }
  if (slug === "protection-fault-analysis" && t.includes("device selection quiz")) {
    return {
      question: "A verified transformer inrush trips a Type B MCB. What must happen before substituting a Type C device?",
      options: ["Check inrush against the exact curve and re-verify Zs, disconnection, conductor protection, breaking capacity, and coordination", "Change to Type C because transformers always require it", "Increase the current rating until trips stop", "Keep Type B and bypass it during starting"],
      correct: 0,
      explanation: "A Type C device generally tolerates more inrush but requires more fault current for rapid operation. The exact device curve and the complete protection design must be rechecked.",
    };
  }
  if (slug === "domestic-wiring" && t.includes("final assessment")) {
    return {
      question: "A new final circuit is installed in an English dwelling. Which statement is correct?",
      options: ["Use the applicable Electrical Installation Certificate and complete the separate authorised Part P notification route", "A Minor Works certificate automatically completes Building Regulations notification", "An EICR is the certificate for the new circuit", "No Part P duty exists if the work passes electrical tests"],
      correct: 0,
      explanation: "A new circuit needs the applicable EIC documentation and is a current notification trigger in England. Electrical certification and Building Regulations compliance evidence are distinct, coordinated records.",
    };
  }
  if (slug === "domestic-wiring" && t.includes("depths and zones quiz")) {
    return {
      question: "A cable concealed diagonally between two wall accessories has 30 mA RCD protection but no other declared protection. What is the correct conclusion?",
      options: ["RCD protection alone does not make an unrecognisable concealed route acceptable", "The route is acceptable because it joins accessories", "The route is acceptable if the wall is plasterboard", "RCD protection counts as mechanical armour"],
      correct: 0,
      explanation: "Additional RCD protection does not replace prescribed routing, sufficient depth, or a current permitted mechanical/protective wiring method. Structural and building-performance checks also remain.",
    };
  }
  if (slug === "domestic-wiring" && t.includes("lighting circuit quiz")) {
    return {
      question: "In a conventional two-way lighting circuit, what does each end switch do?",
      options: ["Connect its common terminal to one of two strapper terminals", "Switch neutral and CPC together", "Cross both strappers internally at all times", "Provide overcurrent protection for the lamp"],
      correct: 0,
      explanation: "Each end device is a single-pole changeover switch. Its common selects one of two strapper paths; an intermediate switch, if fitted, performs the crossover function.",
    };
  }
  if (slug === "domestic-wiring" && t.includes("bonding quiz")) {
    return {
      question: "What makes a conductive service part an extraneous-conductive-part for bonding assessment?",
      options: ["It is liable to introduce a potential, generally Earth potential", "It is made from any metal", "It is visible inside a bathroom", "It has no paint on its surface"],
      correct: 0,
      explanation: "Classification depends on whether the part can introduce a potential, not on material or location alone. The actual service construction and current requirements must be assessed.",
    };
  }
  if (slug === "domestic-wiring" && t.includes("module quiz")) {
    return {
      question: "Which statement correctly distinguishes an RCCB from an RCBO?",
      options: ["An RCCB provides residual-current protection but needs coordinated overcurrent protection; an RCBO combines both", "An RCCB always protects one circuit and an RCBO always protects several", "An RCCB is an isolation switch only", "They are different names for the same device"],
      correct: 0,
      explanation: "An RCCB detects residual-current imbalance but does not itself provide overload/short-circuit protection. An RCBO combines residual-current and overcurrent protection for its circuit.",
    };
  }
  if (slug === "electrical-fundamentals" && t.includes("final assessment")) {
    return {
      question: "A 100 µF ideal capacitor is connected to a 50 Hz sinusoidal source. Which result and phase statement are correct?",
      options: ["XC ≈ 31.8 Ω; current leads voltage by 90°", "XC ≈ 31.8 Ω; current lags voltage by 90°", "XL ≈ 31.8 Ω; current leads voltage", "XC increases when frequency increases"],
      correct: 0,
      explanation: "XC = 1/(2πfC) = 31.8 Ω. For an ideal capacitor in sinusoidal steady state, current leads voltage by 90°, and XC falls as frequency rises.",
    };
  }
  if (slug === "electrical-fundamentals" && t.includes("power quiz")) {
    return {
      question: "A 2 kW heater runs for 30 minutes. How much electrical energy does it use?",
      options: ["1 kWh", "4 kWh", "60 kWh", "1 kW"],
      correct: 0,
      explanation: "Thirty minutes is 0.5 h, so E = Pt = 2 kW × 0.5 h = 1 kWh. Kilowatts measure power; kilowatt-hours measure energy.",
    };
  }
  if (slug === "electrical-fundamentals" && t.includes("module quiz")) {
    return {
      question: "Which statement correctly compares conventional current with electron drift in a copper conductor?",
      options: ["They always move in the same direction", "Conventional current follows positive-charge direction; electrons drift oppositely", "Only electron direction may be used in circuit analysis", "Neither direction can be assigned"],
      correct: 1,
      explanation: "Conventional current is the positive-charge reference direction. Copper conduction uses negative electrons, so their net drift is opposite; consistent circuit equations remain valid.",
    };
  }

  if (t.includes("ohm") || t.includes("potential difference") || t.includes("resistance and resistivity")) {
    return {
      question: "A 12V supply is connected across a 4Ω resistor. What is the current?",
      options: ["48A", "3A", "0.33A", "8A"],
      correct: 1,
      explanation: "Using Ohm's Law: I = V/R = 12/4 = 3A. Voltage divided by resistance gives current.",
    };
  }
  if (t.includes("rcd") || t.includes("rcbo")) {
    return {
      question: "What is the standard trip current for a domestic RCD protecting a bathroom circuit?",
      options: ["100mA", "300mA", "30mA", "10mA"],
      correct: 2,
      explanation: "30mA RCDs are required for circuits in bathrooms and for most general-purpose socket outlets. At 30mA the device trips in <40ms, preventing lethal electrocution.",
    };
  }
  if (t.includes("mcb") || t.includes("overcurrent")) {
    return {
      question: "Which MCB type is most suitable for a domestic ring final circuit with standard socket outlets?",
      options: ["Type D", "Type C", "Type B", "Type A"],
      correct: 2,
      explanation: "Type B MCBs trip at 3–5× rated current, which is appropriate for resistive and lighting loads in domestic properties. Type C is for motors, Type D for heavy inrush loads.",
    };
  }
  if (t.includes("series") || t.includes("parallel") || t.includes("kirchhoff")) {
    return {
      question: "Two resistors of 6Ω and 3Ω are connected in parallel. What is the total resistance?",
      options: ["9Ω", "2Ω", "4.5Ω", "18Ω"],
      correct: 1,
      explanation: "For parallel resistors: 1/R_total = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. So R_total = 2Ω. The result is always less than the smallest individual resistor.",
    };
  }
  if (t.includes("star") || t.includes("delta") || t.includes("three-phase")) {
    return {
      question: "In a star-connected system, the line voltage is 400V. What is the phase voltage?",
      options: ["400V", "231V", "693V", "115V"],
      correct: 1,
      explanation: "In a star connection: V_phase = V_line / √3 = 400 / 1.732 ≈ 231V. This is why UK single-phase supply is 230V — it's the phase voltage of the 400V three-phase supply.",
    };
  }
  if (t.includes("cable") || t.includes("ccc") || t.includes("current-carry")) {
    return {
      question: "What effect does grouping three current-carrying cables together have on their current-carrying capacity?",
      options: ["No effect", "Increases it slightly", "Reduces it — apply grouping factor Cg", "Doubles it"],
      correct: 2,
      explanation: "Grouping cables reduces their ability to dissipate heat. A correction factor Cg (always <1.0) must be applied to the tabulated CCC. For 3 cables, Cg is typically 0.70.",
    };
  }
  if (t.includes("insulation") || t.includes("ir test")) {
    return {
      question: "What is the minimum insulation resistance for a 230V circuit under BS 7671?",
      options: ["0.5MΩ", "1MΩ", "10MΩ", "0.1MΩ"],
      correct: 1,
      explanation: "BS 7671 Table 64 requires a minimum insulation resistance of 1MΩ for circuits up to 500V when tested at 500V DC. In practice, values below 2MΩ warrant investigation.",
    };
  }
  // Generic quiz
  return {
    question: "Which standard governs electrical installations in the UK?",
    options: ["BS 5266", "BS 7671", "BS 1362", "BS EN 60898"],
    correct: 1,
    explanation: "BS 7671 (Requirements for Electrical Installations) is the IET Wiring Regulations — the primary standard for fixed electrical installations in the UK. It is based on IEC 60364.",
  };
}

function getExerciseForLesson(title: string, _slug: string): { problem: string; steps: string[]; answer: string } | null {
  const t = title.toLowerCase();
  if (_slug === "solar-pv" && t.includes("battery sizing exercise")) {
    return { problem: "A household wants 6.0 kWh delivered after charging. The supplied battery usable fraction is 90%, charge-path efficiency 96%, and discharge-path efficiency 94%. Find nominal capacity when the 6.0 kWh is measured at the AC load, then check a 3 kW battery against a 4.2 kW simultaneous backup load.", steps: ["Combined usable delivery factor = 0.90 × 0.96 × 0.94 = 0.81216.", "Nominal energy = 6.0/0.81216 = 7.387 kWh; select a suitable product capacity without rounding the requirement downward.", "The 4.2 kW simultaneous load exceeds the supplied 3 kW battery/converter power limit, regardless of sufficient kWh.", "Reprofile or shed loads and verify surge, phase, EPS, reserve SoC, aging, PAS 63100/fire location, protection and exact manufacturer compatibility."], answer: "Minimum illustrative nominal capacity ≈ 7.39 kWh; the proposed 4.2 kW backup load fails the separate 3 kW power limit" };
  }
  if (_slug === "solar-pv" && t.includes("system sizing design exercise")) {
    return { problem: "A supplied module has Pmp=430 W, corrected cold Voc=54.9 V and corrected hot Vmp=35.2 V. The inverter maximum is 600 V, MPPT minimum is 250 V, and input current permits one 10.5 A string per MPPT. Find the feasible integer string range and nominal DC power for a 10-module string.", steps: ["Cold upper bound: 600/54.9=10.93, so maximum integer length is 10 modules; never round this limit upward.", "Hot lower bound: 250/35.2=7.10, so at least 8 modules are required to remain at or above the supplied MPPT minimum.", "The feasible voltage-only range is therefore 8–10 modules, subject to start voltage, tolerances, absolute component limits and every current/protection/manufacturer rule.", "For 10 modules, nominal STC DC power is 10×430=4.30 kWp. This is not annual energy or guaranteed field output."], answer: "Feasible supplied voltage range: 8–10 modules per string; 10 modules give 4.30 kWp nominal DC capacity" };
  }
  if (_slug === "cable-sizing" && t.includes("voltage drop problems set")) {
    return {
      problem: "A supplied single-phase table gives 4 mm² vd = 11 mV/A/m and 6 mm² vd = 7.3 mV/A/m. Ib = 28 A, one-way length = 42 m, and the allocated circuit budget is 8.0 V. Screen both candidates.",
      steps: [
        "4 mm²: ΔV = 11 × 28 × 42 / 1000 = 12.936 V, so it fails the supplied 8.0 V budget.",
        "6 mm²: ΔV = 7.3 × 28 × 42 / 1000 = 8.5848 V, so it also fails; do not round it into compliance.",
        "Select the next matching table candidate or redesign the route/load, then include upstream drop and equipment tolerance.",
        "Repeat CCC/corrections, ADS/Zs, short-circuit withstand, terminals, protection, installation and all other design checks after changing conductor or route.",
      ],
      answer: "Neither supplied candidate passes the 8.0 V budget: 4 mm² gives 12.94 V and 6 mm² gives 8.58 V",
    };
  }
  if (_slug === "cable-sizing" && t.includes("swa sizing exercise")) {
    return {
      problem: "A fictional SWA feeder has Ib = 46 A and In = 50 A. Supplied candidate data: It = 67 A, Ca = 0.94, Cg = 0.90, vd = 2.9 mV/A/m, length = 65 m. The allocated voltage-drop budget is 7.0 V. Screen capacity and drop, then state the armour evidence still required.",
      steps: [
        "Corrected capacity: Iz = 67 × 0.94 × 0.90 = 56.682 A; the basic 46 ≤ 50 ≤ 56.682 A thermal relation passes on the supplied basis.",
        "Voltage drop: ΔV = 2.9 × 46 × 65 / 1000 = 8.671 V, so the 7.0 V allocated budget fails.",
        "A larger conductor or redesigned route/load is required, followed by every affected thermal, voltage-drop, fault and protection calculation.",
        "Armour as CPC remains unproved: verify effective armour data, steel k, adiabatic withstand, resistance/reactance and Zs/disconnection, glands/earth tags, continuity, corrosion and any parallel CPC/current sharing.",
      ],
      answer: "The supplied candidate passes only the thermal screen (Iz ≈ 56.7 A) but fails voltage drop (8.67 V > 7.0 V); armour-CPC capability also remains to be proven",
    };
  }
  if (_slug === "cable-sizing" && t.includes("ccc selection problems")) {
    return {
      problem: "Using only this supplied fictional table row: 4 mm² It = 37 A and 6 mm² It = 47 A for the declared cable and method. Ib = 32 A, In = 32 A, Ca = 0.94 and Cg = 0.80. Screen both candidates thermally, then state what the result does not prove.",
      steps: [
        "Calculate the combined supplied factor: 0.94 × 0.80 = 0.752.",
        "For 4 mm², illustrative Iz = 37 × 0.752 = 27.8 A, so In ≤ Iz fails.",
        "For 6 mm², illustrative Iz = 47 × 0.752 = 35.3 A, so the basic Ib ≤ In ≤ Iz thermal screen passes.",
        "Do not approve from this screen: verify the current standard's exact overload formula, table and factors, plus voltage drop, fault/disconnection, short-circuit withstand, terminals, harmonics, neutral, environment and installation requirements.",
      ],
      answer: "4 mm² fails the supplied thermal screen; 6 mm² passes that screen at Iz ≈ 35.3 A, but is not a completed or approved cable design",
    };
  }
  if (_slug === "cable-sizing" && t.includes("applying multiple correction factors")) {
    return {
      problem: "For a fictional declared case, Ib = 36 A, In = 40 A and supplied factors are Ca = 0.94, Cg = 0.80 and Ci = 0.89. On the stated design basis It must be at least In/(Ca×Cg×Ci). Find the minimum It and screen a supplied 63 A table candidate.",
      steps: [
        "Confirm these factors apply to the same base table and are not already embodied in it; factors must not be multiplied blindly.",
        "Combined factor = 0.94 × 0.80 × 0.89 = 0.66928.",
        "Required tabulated capacity = 40/0.66928 = 59.77 A, so do not round this requirement downward.",
        "For the supplied 63 A candidate, illustrative Iz = 63 × 0.66928 = 42.16 A; the basic 36 ≤ 40 ≤ 42.16 A thermal relation passes. Complete every other design and verification gate using current authoritative data.",
      ],
      answer: "Required It ≈ 59.8 A; the supplied 63 A candidate gives Iz ≈ 42.2 A and passes only the stated thermal screen",
    };
  }
  if (_slug === "three-phase-systems" && t.includes("delta circuit analysis problems")) {
    return {
      problem: "A balanced 400 V three-phase delta load has 40 ohms resistance per branch. Calculate phase current, line current, and total active power.",
      steps: [
        "In delta, Vph = VL = 400 V.",
        "Branch current: Iph = 400/40 = 10 A.",
        "Balanced delta line current: IL = root(3) × 10 = 17.32 A.",
        "For a resistive balanced load, P = 3 × Vph × Iph = 3 × 400 × 10 = 12.0 kW; the line formula gives the same result.",
      ],
      answer: "Iph = 10 A; IL approximately 17.32 A; total active power = 12.0 kW",
    };
  }
  if (_slug === "three-phase-systems" && t.includes("star circuit analysis problems")) {
    return {
      problem: "A balanced 400 V line-to-line, three-phase star load has 20 ohms resistance per phase. Calculate phase voltage, line current, neutral current, and total active power.",
      steps: [
        "Phase voltage: Vph = VL/root(3) = 400/1.732 = 230.9 V.",
        "Phase and line current in star: IL = Iph = 230.9/20 = 11.55 A.",
        "For equal sinusoidal phase currents separated by 120 degrees, the fundamental neutral-current phasor sum is 0 A.",
        "For a resistive balanced load, P = root(3) × VL × IL × power factor = 1.732 × 400 × 11.55 × 1 = approximately 8.00 kW.",
      ],
      answer: "Vph approximately 230.9 V; IL = Iph approximately 11.55 A; fundamental IN = 0 A; total active power approximately 8.00 kW",
    };
  }
  if (_slug === "protection-fault-analysis" && t.includes("discrimination case study")) {
    return {
      problem: "A 16 A downstream MCB is supplied by a 63 A upstream MCB. The prospective fault current at the downstream board is 2.4 kA. Decide what evidence is needed before claiming selectivity.",
      steps: [
        "Identify the exact manufacturer, product family, voltage, poles, settings, and editions of data for both devices.",
        "Compare complete time-current tolerance envelopes through overload and instantaneous regions; the 16 A-to-63 A rating ratio is not proof.",
        "Use the manufacturer selectivity table or tested coordination data to obtain any declared selectivity limit for the exact pair.",
        "Claim total selectivity only if the declared limit covers 2.4 kA and all disconnection, breaking/conditional, conductor, and assembly checks pass; otherwise state the partial limit or redesign.",
      ],
      answer: "The ratings alone cannot approve the pair; exact manufacturer data must demonstrate selectivity through the 2.4 kA site fault level and every related protection check must pass",
    };
  }
  if (_slug === "protection-fault-analysis" && t.includes("pfc worked problems")) {
    return {
      problem: "At 230 V, verified origin PSCC is 4.6 kA. A downstream feeder adds 0.10 Ω line-neutral impedance. Estimate downstream PSCC using a simple resistive model and identify the approval gates.",
      steps: [
        "Convert the origin fault level to source impedance: Zsource = 230/4600 = 0.050 Ω.",
        "Add compatible feeder impedance: Ztotal = 0.050 + 0.100 = 0.150 Ω.",
        "Estimate downstream PSCC: 230/0.150 ≈ 1533 A = 1.53 kA.",
        "Verify impedance/voltage/fault-type bases, uncertainty, temperature/reactance, every local source, and the declared breaking/withstand or conditional rating of the complete downstream assembly.",
      ],
      answer: "Estimated downstream PSCC ≈ 1.53 kA; final approval requires validated inputs, all source contributions, and proven device/assembly capability",
    };
  }
  if (_slug === "protection-fault-analysis" && t.includes("zs calculation exercises")) {
    return {
      problem: "A TN circuit design uses Ze = 0.28 Ω and a corrected design-temperature R1+R2 = 0.64 Ω. Calculate conceptual design Zs, then state what still must be verified before approval.",
      steps: [
        "Combine compatible design components: Zs = 0.28 + 0.64 = 0.92 Ω.",
        "Identify the exact protective device, product standard, rating/curve, earthing system, circuit class, and required disconnection time.",
        "Compare 0.92 Ω with the current-edition or manufacturer maximum using the correct voltage/temperature basis; check breaking capacity, conductor fault withstand, RCD provisions, and coordination.",
        "Reconcile the design with inspection, protective-conductor continuity, polarity, safe measured evidence, instrument uncertainty, and any parallel-path effects.",
      ],
      answer: "Conceptual design Zs = 0.92 Ω; this is not approval until the exact device/time limit and the complete ADS verification pass",
    };
  }
  if (_slug === "domestic-wiring" && t.includes("fault finding case studies")) {
    return {
      problem: "After work in a two-gang switch box, an RCBO for Circuit A trips only when Circuit B is also energised. Both circuits serve loads in the box. Plan a safe diagnosis without repeatedly resetting either device.",
      steps: [
        "Record the exact device states, circuit schedules, recent work, and every possible source before disturbing conductors.",
        "Secure and prove safe isolation for both circuits, proving the voltage indicator before and after and checking for alternative supplies.",
        "Use circuit ownership, continuity, and appropriate insulation tests with sensitive loads disconnected to test the shared/borrowed-neutral hypothesis.",
        "Correct identified conductor ownership or termination defects, then complete required continuity, insulation, polarity, protective-device, functional, and documentation checks for both circuits.",
      ],
      answer: "Treat both circuits as interacting until proven otherwise; isolate both, establish conductor ownership by dead testing, repair the root cross-connection, and verify both circuits",
    };
  }
  if (_slug === "domestic-wiring" && t.includes("wiring practice problems")) {
    return {
      problem: "A paper design shows a 32 A ring final with one existing unfused spur. A proposal extends that spur to three additional socket outlets and routes part of the branch through thermal insulation. Identify the topology and design issues; do not select a final cable size.",
      steps: [
        "Trace topology: the added outlets form a multi-outlet branch outside the ring return path, not new points on the ring.",
        "Protection: without a suitable local protective arrangement, aggregate branch loading is not bounded as an ordinary single unfused spur.",
        "Thermal route: insulation can reduce current-carrying capacity, so the actual reference method and correction factors are required.",
        "Resolution: redesign a compliant ring/radial/fused arrangement, then verify capacity, voltage drop, fault protection, RCD requirements, connections, inspection, and tests against current guidance.",
      ],
      answer: "Do not approve the proposed branch; redesign and complete the full BS 7671 design and verification workflow",
    };
  }
  if (t.includes("kirchhoff's law problems")) {
    return {
      problem: "A 12 V source supplies a 2 Ω resistor in series with a node that splits into 6 Ω and 3 Ω parallel branches. Use Kirchhoff's laws to find source current, node voltage, and branch currents.",
      steps: [
        "Reduce only as a check: 6 Ω || 3 Ω = 2 Ω, so total resistance is 4 Ω and source current is 3 A.",
        "KVL: 12 − (3 A)(2 Ω) − Vnode = 0, giving Vnode = 6 V.",
        "Branch currents: I6 = 6/6 = 1 A and I3 = 6/3 = 2 A.",
        "KCL check: 3 A entering the node = 1 A + 2 A leaving; KVL check: 12 V = 6 V + 6 V.",
      ],
      answer: "Source current 3 A; node voltage 6 V; branch currents 1 A and 2 A",
    };
  }

  if (t.includes("ohm") || t.includes("worked example")) {
    return {
      problem: "A 240V circuit supplies a heater with a resistance of 48Ω. Calculate: (a) the current drawn, (b) the power consumed, (c) the energy used in 2 hours.",
      steps: [
        "Part (a) Current: Apply Ohm's Law → I = V/R = 240/48 = 5A",
        "Part (b) Power: P = V × I = 240 × 5 = 1200W (1.2kW). Verify: P = V²/R = 240²/48 = 57600/48 = 1200W ✓",
        "Part (c) Energy: E = P × t = 1200W × 2h = 2400Wh = 2.4kWh. On a standard tariff at 28p/kWh, cost = 2.4 × 28p = 67.2p",
      ],
      answer: "(a) 5A  (b) 1200W  (c) 2.4 kWh",
    };
  }
  if (t.includes("circuit analysis practice")) {
    return {
      problem: "A 4 Ω resistor is in series with a parallel network of 6 Ω and 3 Ω across a 12 V DC source. Calculate equivalent resistance, source current, voltage across the parallel network, and both branch currents.",
      steps: [
        "Parallel equivalent: Rp = (1/6 + 1/3)⁻¹ = 2 Ω.",
        "Total resistance: Rt = 4 + 2 = 6 Ω; source current It = 12/6 = 2 A.",
        "Series-resistor drop is 2 × 4 = 8 V, leaving 4 V across each parallel branch.",
        "Branch currents are 4/6 = 0.667 A and 4/3 = 1.333 A; their sum is 2 A.",
      ],
      answer: "Rt = 6 Ω; It = 2 A; Vparallel = 4 V; branches = 0.667 A and 1.333 A",
    };
  }
  if (t.includes("voltage drop")) {
    return {
      problem: "A 2.5mm² twin-and-earth cable runs 18 metres to supply a 13A socket outlet. The design current is 13A. Calculate the voltage drop. Is it within the 5% limit for a 230V supply?",
      steps: [
        "From BS 7671 Table 4D2B, the mV/A/m for 2.5mm² clipped direct cable is 18 mV/A/m",
        "Voltage drop = (mV/A/m × Ib × L) / 1000 = (18 × 13 × 18) / 1000 = 4212 / 1000 = 4.21V",
        "Percentage drop = (4.21 / 230) × 100 = 1.83%",
        "Compare to limit: 1.83% < 5% limit ✓  The cable is acceptable.",
      ],
      answer: "4.21V (1.83%) — within the 5% limit. ✓",
    };
  }
  if (t.includes("cable siz") || t.includes("end-to-end") || t.includes("sizing")) {
    return {
      problem: "A ring final circuit serves 8 single-phase socket outlets. Design current Ib = 20A. The circuit is run in 2.5mm² T&E clipped direct (Iz = 27A). Is the cable adequately sized? Check all three BS 7671 conditions.",
      steps: [
        "Condition 1 — Design current ≤ rated current: Ib (20A) ≤ In (32A) ✓  (standard 32A MCB for ring final)",
        "Condition 2 — Rated current ≤ cable CCC: In (32A) ≤ Iz (27A) ✗  Wait — ring finals are split: each half carries Ib/2 = 10A, so effective It per half = 13.5A. With diversity, this is acceptable.",
        "Condition 3 — Overload condition: I₂ ≤ 1.45 × Iz = 1.45 × 27 = 39.15A. MCB I₂ = 1.45 × In = 1.45 × 32 = 46.4A. The ring configuration means fault current operates the MCB before the cable overloads.",
        "BS 7671 Regulation 433.1.1 specifically exempts ring final circuits from the standard conditions — the ring topology provides inherent protection.",
      ],
      answer: "2.5mm² is standard and accepted for ring finals — confirmed by BS 7671 ✓",
    };
  }
  if (t.includes("three-phase") || t.includes("star-delta") || t.includes("balanced")) {
    return {
      problem: "A balanced three-phase star-connected load has a phase resistance of 22Ω per phase. Line voltage is 400V. Calculate: (a) phase voltage, (b) phase current, (c) total three-phase power.",
      steps: [
        "Part (a) Phase voltage: V_ph = V_L / √3 = 400 / 1.732 = 231V",
        "Part (b) Phase current: I_ph = V_ph / R_ph = 231 / 22 = 10.5A. In star, line current = phase current, so I_L = 10.5A",
        "Part (c) Total power: P = 3 × V_ph × I_ph = 3 × 231 × 10.5 = 7,281W (7.28kW). Or: P = √3 × V_L × I_L = 1.732 × 400 × 10.5 = 7,274W ✓ (minor rounding difference)",
      ],
      answer: "V_ph = 231V  |  I_L = 10.5A  |  P = 7.28kW",
    };
  }
  if (t.includes("lux") || t.includes("illumin") || t.includes("lumen")) {
    return {
      problem: "An office 10m × 8m (80m²) requires 500 lux at desk level. Each luminaire provides 4000 lumens. Utilisation Factor (UF) = 0.65, Maintenance Factor (MF) = 0.80. How many luminaires are needed?",
      steps: [
        "Rearrange lumen method: N = (E × A) / (F × UF × MF)",
        "E = 500 lux (required), A = 80m², F = 4000 lumens/luminaire",
        "N = (500 × 80) / (4000 × 0.65 × 0.80) = 40,000 / 2,080 = 19.2",
        "Round up to 20 luminaires to ensure the required 500 lux is achieved.",
      ],
      answer: "20 luminaires required",
    };
  }
  // Generic exercise
  return {
    problem: "A 230V single-phase circuit feeds a load drawing 8A at a power factor of 0.85 lagging. Calculate: (a) the apparent power in VA, (b) the true power in watts, (c) the reactive power in VAr.",
    steps: [
      "Part (a) Apparent power: S = V × I = 230 × 8 = 1,840 VA",
      "Part (b) True (real) power: P = S × cos(φ) = 1,840 × 0.85 = 1,564 W",
      "Part (c) Reactive power: Q = S × sin(φ). sin(φ) = √(1 - cos²φ) = √(1 - 0.7225) = √0.2775 = 0.527. Q = 1,840 × 0.527 = 969 VAr",
    ],
    answer: "S = 1,840 VA  |  P = 1,564 W  |  Q = 969 VAr",
  };
}

function OhmsLawDiagram() {
  return (
    <svg viewBox="0 0 400 160" width="100%" style={{ display: "block", background: "#0A0C10" }}>
      <defs>
        <radialGradient id="og1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F0A500" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#F0A500" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="160" fill="url(#og1)"/>
      {/* Battery */}
      <line x1="40" y1="80" x2="40" y2="40" stroke="#F0A500" strokeWidth="2" opacity="0.9"/>
      <line x1="30" y1="40" x2="50" y2="40" stroke="#F0A500" strokeWidth="3" opacity="0.9"/>
      <line x1="33" y1="33" x2="47" y2="33" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <line x1="40" y1="120" x2="40" y2="80" stroke="#F0A500" strokeWidth="2" opacity="0.9"/>
      <line x1="30" y1="120" x2="50" y2="120" stroke="#F0A500" strokeWidth="3" opacity="0.9"/>
      <line x1="33" y1="127" x2="47" y2="127" stroke="#F0A500" strokeWidth="1.5" opacity="0.7"/>
      <text x="16" y="84" fontFamily="monospace" fontSize="11" fill="#F0A500" opacity="0.8" textAnchor="middle">V</text>
      {/* Wires */}
      <line x1="40" y1="33" x2="200" y2="33" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      <line x1="200" y1="33" x2="200" y2="50" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      <rect x="188" y="50" width="24" height="60" rx="5" fill="none" stroke="#00D4FF" strokeWidth="1.8" opacity="0.85"/>
      <text x="200" y="82" fontFamily="monospace" fontSize="9" fill="#00D4FF" opacity="0.8" textAnchor="middle">R</text>
      <text x="200" y="93" fontFamily="monospace" fontSize="8" fill="#00D4FF" opacity="0.55" textAnchor="middle">Ω</text>
      <line x1="200" y1="110" x2="200" y2="127" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      <line x1="200" y1="127" x2="40" y2="127" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      {/* Ammeter */}
      <circle cx="120" cy="33" r="12" fill="rgba(168,85,247,0.1)" stroke="#A855F7" strokeWidth="1.5" opacity="0.8"/>
      <text x="120" y="37" fontFamily="monospace" fontSize="9" fill="#A855F7" opacity="0.9" textAnchor="middle">A</text>
      {/* Current arrow */}
      <line x1="60" y1="33" x2="100" y2="33" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 2" opacity="0.5"/>
      <polygon points="102,30 108,33 102,36" fill="#A855F7" opacity="0.6"/>
      {/* Formulas */}
      <rect x="260" y="25" width="120" height="110" rx="8" fill="rgba(0,0,0,0.4)" stroke="rgba(240,165,0,0.25)" strokeWidth="1"/>
      <text x="320" y="47" fontFamily="monospace" fontSize="11" fill="#F0A500" opacity="0.9" textAnchor="middle" fontWeight="700">V = I × R</text>
      <line x1="270" y1="55" x2="370" y2="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="320" y="73" fontFamily="monospace" fontSize="10" fill="#00D4FF" opacity="0.8" textAnchor="middle">I = V / R</text>
      <line x1="270" y1="81" x2="370" y2="81" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="320" y="99" fontFamily="monospace" fontSize="10" fill="#34D399" opacity="0.8" textAnchor="middle">R = V / I</text>
      <line x1="270" y1="107" x2="370" y2="107" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="320" y="123" fontFamily="monospace" fontSize="9" fill="#A855F7" opacity="0.7" textAnchor="middle">P = V × I</text>
    </svg>
  );
}

/* ── Lesson diagrams — one per core topic, ElectraCore style ── */
const LD = { c: "#F0A500", v: "#00D4FF", g: "#34D399", h: "#FF4444", p: "#A855F7", t: "#F0F0F0", d: "#888899" };
const ldWrap = { display: "block", width: "100%", background: "#0A0C10" } as const;

function RCDBalanceDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="RCD core-balance principle">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.g} opacity="0.6">RCD · CORE BALANCE</text>
      <ellipse cx="110" cy="84" rx="34" ry="42" fill="none" stroke={LD.v} strokeWidth="1.8" opacity="0.6" />
      <ellipse cx="110" cy="84" rx="20" ry="28" fill="none" stroke={LD.v} strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="70" x2="210" y2="70" stroke={LD.h} strokeWidth="2" /><polygon points="204,67 212,70 204,73" fill={LD.h} /><text x="26" y="64" fontFamily="monospace" fontSize="8" fill={LD.h}>L → I</text>
      <line x1="210" y1="98" x2="24" y2="98" stroke={LD.d} strokeWidth="2" /><polygon points="30,95 22,98 30,101" fill={LD.d} /><text x="150" y="112" textAnchor="end" fontFamily="monospace" fontSize="8" fill={LD.d}>N ← I</text>
      <line x1="110" y1="42" x2="110" y2="26" stroke={LD.p} strokeWidth="1.4" /><rect x="86" y="8" width="48" height="18" rx="4" fill="rgba(168,85,247,0.12)" stroke={LD.p} strokeWidth="1" /><text x="110" y="21" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.p}>TRIP</text>
      <text x="240" y="66" fontFamily="monospace" fontSize="9" fill={LD.g}>healthy: I(L)=I(N)</text>
      <text x="240" y="86" fontFamily="monospace" fontSize="9" fill={LD.h}>fault: ΔI ≥ IΔn</text>
      <text x="240" y="106" fontFamily="monospace" fontSize="8" fill={LD.d}>30mA trips &lt;300 ms</text>
    </svg>
  );
}

function KirchhoffDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Kirchhoff's current and voltage laws">
      {/* KCL node */}
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={LD.v} opacity="0.6">KCL — CURRENT AT A NODE</text>
      <circle cx="90" cy="80" r="4" fill={LD.c} />
      <line x1="30" y1="80" x2="86" y2="80" stroke={LD.h} strokeWidth="2" /><polygon points="80,77 88,80 80,83" fill={LD.h} />
      <text x="34" y="74" fontFamily="monospace" fontSize="9" fill={LD.h}>I₁</text>
      <line x1="94" y1="80" x2="140" y2="48" stroke={LD.g} strokeWidth="2" /><polygon points="134,48 142,46 137,54" fill={LD.g} />
      <text x="128" y="44" fontFamily="monospace" fontSize="9" fill={LD.g}>I₂</text>
      <line x1="94" y1="80" x2="140" y2="112" stroke={LD.g} strokeWidth="2" /><polygon points="134,112 142,114 137,106" fill={LD.g} />
      <text x="128" y="126" fontFamily="monospace" fontSize="9" fill={LD.g}>I₃</text>
      <text x="40" y="140" fontFamily="monospace" fontSize="10" fill={LD.t} opacity="0.85">I₁ = I₂ + I₃</text>
      {/* KVL loop */}
      <text x="230" y="20" fontFamily="monospace" fontSize="9" fill={LD.v} opacity="0.6">KVL — VOLTAGE ROUND A LOOP</text>
      <rect x="240" y="34" width="130" height="76" fill="none" stroke={LD.v} strokeWidth="1.4" opacity="0.7" />
      <line x1="240" y1="60" x2="240" y2="84" stroke={LD.c} strokeWidth="4" /><text x="222" y="76" fontFamily="monospace" fontSize="9" fill={LD.c}>V</text>
      <rect x="286" y="28" width="30" height="12" fill="none" stroke={LD.g} strokeWidth="1.4" /><text x="292" y="24" fontFamily="monospace" fontSize="8" fill={LD.g}>V₁</text>
      <rect x="364" y="60" width="12" height="30" fill="none" stroke={LD.g} strokeWidth="1.4" /><text x="380" y="80" fontFamily="monospace" fontSize="8" fill={LD.g}>V₂</text>
      <text x="250" y="132" fontFamily="monospace" fontSize="10" fill={LD.t} opacity="0.85">V = V₁ + V₂  (ΣV = 0)</text>
    </svg>
  );
}

function SeriesParallelDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Series and parallel resistor networks">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">SERIES</text>
      {/* series */}
      <line x1="24" y1="50" x2="24" y2="90" stroke={LD.c} strokeWidth="3" /><text x="10" y="74" fontFamily="monospace" fontSize="8" fill={LD.c}>V</text>
      <line x1="24" y1="50" x2="60" y2="50" stroke={LD.v} strokeWidth="1.6" />
      <rect x="60" y="44" width="34" height="12" fill="none" stroke={LD.v} strokeWidth="1.4" /><text x="70" y="40" fontFamily="monospace" fontSize="8" fill={LD.v}>R₁</text>
      <line x1="94" y1="50" x2="120" y2="50" stroke={LD.v} strokeWidth="1.6" />
      <rect x="120" y="44" width="34" height="12" fill="none" stroke={LD.v} strokeWidth="1.4" /><text x="130" y="40" fontFamily="monospace" fontSize="8" fill={LD.v}>R₂</text>
      <line x1="154" y1="50" x2="180" y2="50" stroke={LD.v} strokeWidth="1.6" /><line x1="180" y1="50" x2="180" y2="90" stroke={LD.v} strokeWidth="1.6" /><line x1="180" y1="90" x2="24" y2="90" stroke={LD.c} strokeWidth="1.6" />
      <text x="24" y="118" fontFamily="monospace" fontSize="9" fill={LD.t} opacity="0.85">Rₜ = R₁ + R₂</text>
      <text x="24" y="134" fontFamily="monospace" fontSize="8" fill={LD.d}>same current everywhere</text>
      {/* parallel */}
      <text x="234" y="20" fontFamily="monospace" fontSize="9" fill={LD.g} opacity="0.6">PARALLEL</text>
      <line x1="244" y1="50" x2="244" y2="90" stroke={LD.c} strokeWidth="3" /><text x="230" y="74" fontFamily="monospace" fontSize="8" fill={LD.c}>V</text>
      <line x1="244" y1="45" x2="360" y2="45" stroke={LD.v} strokeWidth="1.6" /><line x1="244" y1="95" x2="360" y2="95" stroke={LD.g} strokeWidth="1.6" />
      <rect x="290" y="52" width="12" height="30" fill="none" stroke={LD.g} strokeWidth="1.4" /><line x1="296" y1="45" x2="296" y2="52" stroke={LD.v} strokeWidth="1.4"/><line x1="296" y1="82" x2="296" y2="95" stroke={LD.g} strokeWidth="1.4"/><text x="270" y="72" fontFamily="monospace" fontSize="8" fill={LD.g}>R₁</text>
      <rect x="344" y="52" width="12" height="30" fill="none" stroke={LD.g} strokeWidth="1.4" /><line x1="350" y1="45" x2="350" y2="52" stroke={LD.v} strokeWidth="1.4"/><line x1="350" y1="82" x2="350" y2="95" stroke={LD.g} strokeWidth="1.4"/><text x="358" y="72" fontFamily="monospace" fontSize="8" fill={LD.g}>R₂</text>
      <text x="234" y="120" fontFamily="monospace" fontSize="9" fill={LD.t} opacity="0.85">1/Rₜ = 1/R₁ + 1/R₂</text>
      <text x="234" y="134" fontFamily="monospace" fontSize="8" fill={LD.d}>same voltage across each</text>
    </svg>
  );
}

function PowerTriangleDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Power triangle: real, reactive and apparent power">
      <text x="14" y="20" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">POWER TRIANGLE</text>
      <line x1="70" y1="120" x2="250" y2="120" stroke={LD.c} strokeWidth="2.4" />
      <line x1="70" y1="120" x2="70" y2="40" stroke={LD.g} strokeWidth="2.4" />
      <line x1="70" y1="40" x2="250" y2="120" stroke={LD.v} strokeWidth="2.4" />
      <path d="M96 120 A 26 26 0 0 0 88 104" fill="none" stroke={LD.d} strokeWidth="1" />
      <text x="100" y="114" fontFamily="monospace" fontSize="9" fill={LD.d}>φ</text>
      <text x="150" y="136" fontFamily="monospace" fontSize="9" fill={LD.c}>P — real (W)</text>
      <text x="18" y="82" fontFamily="monospace" fontSize="9" fill={LD.g}>Q (VAr)</text>
      <text x="168" y="72" fontFamily="monospace" fontSize="9" fill={LD.v}>S (VA)</text>
      <rect x="292" y="46" width="96" height="70" rx="5" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.22)" strokeWidth="0.8" />
      <text x="340" y="66" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.t}>PF = P / S</text>
      <text x="340" y="84" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.t}>= cos φ</text>
      <text x="340" y="104" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.d}>S² = P² + Q²</text>
    </svg>
  );
}

function ThreePhaseWaveDiagram() {
  const phases = [{ c: LD.h, ph: 0 }, { c: LD.c, ph: 120 }, { c: LD.v, ph: 240 }];
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Three-phase sine waves and star/delta connections">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.p} opacity="0.6">THREE-PHASE · 120° APART</text>
      <line x1="20" y1="70" x2="280" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      {phases.map((w, wi) => {
        const pts: string[] = [];
        for (let x = 0; x <= 260; x += 4) { const a = (x / 260) * 4 * Math.PI + w.ph * Math.PI / 180; pts.push(`${x + 20},${70 - Math.sin(a) * 34}`); }
        return <polyline key={wi} points={pts.join(" ")} fill="none" stroke={w.c} strokeWidth="1.6" opacity="0.9" />;
      })}
      <text x="24" y="150" fontFamily="monospace" fontSize="8" fill={LD.d}>L1 · L2 · L3</text>
      {/* star */}
      <g transform="translate(320,52)">
        {[[0, -18], [-16, 9], [16, 9]].map(([x, y], i) => (<line key={i} x1="0" y1="0" x2={x} y2={y} stroke={[LD.h, LD.c, LD.v][i]} strokeWidth="2" />))}
        <circle cx="0" cy="0" r="3" fill={LD.p} /><text x="0" y="26" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>STAR</text>
      </g>
      <text x="300" y="92" fontFamily="monospace" fontSize="8" fill={LD.t}>Vʟ=√3·Vₚ</text>
      {/* delta */}
      <g transform="translate(320,118)">
        <polygon points="0,-16 -15,8 15,8" fill="none" stroke={LD.p} strokeWidth="1.4" />
        <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>DELTA</text>
      </g>
    </svg>
  );
}

function MCBCurveDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="MCB trip curves for types B, C and D">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">MCB MAGNETIC TRIP · ×In</text>
      {/* axes */}
      <line x1="40" y1="28" x2="40" y2="120" stroke={LD.d} strokeWidth="1" /><line x1="40" y1="120" x2="380" y2="120" stroke={LD.d} strokeWidth="1" />
      <text x="8" y="40" fontFamily="monospace" fontSize="7" fill={LD.d}>time</text>
      <text x="360" y="134" fontFamily="monospace" fontSize="7" fill={LD.d}>current →</text>
      {/* thermal curve */}
      <path d="M60 34 C 110 40, 150 70, 170 118" fill="none" stroke={LD.g} strokeWidth="1.6" opacity="0.8" />
      <text x="64" y="46" fontFamily="monospace" fontSize="7" fill={LD.g}>thermal (overload)</text>
      {/* magnetic bands */}
      {[{ x: 150, w: 30, c: LD.v, t: "B 3–5×" }, { x: 210, w: 50, c: LD.c, t: "C 5–10×" }, { x: 290, w: 70, c: LD.h, t: "D 10–20×" }].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="110" width={b.w} height="10" fill={b.c} opacity="0.28" />
          <text x={b.x} y={100 - i * 12} fontFamily="monospace" fontSize="7.5" fill={b.c}>{b.t}</text>
        </g>
      ))}
      <text x="150" y="150" fontFamily="monospace" fontSize="8" fill={LD.t} opacity="0.8">higher inrush → higher curve</text>
    </svg>
  );
}

function VoltageDropRunDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Voltage drop along a cable run">
      <text x="14" y="18" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">VOLTAGE DROP ALONG A RUN</text>
      {/* supply */}
      <rect x="24" y="56" width="40" height="48" rx="4" fill="#12151A" stroke={LD.c} strokeWidth="1.2" /><text x="44" y="84" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.c}>230V</text>
      {/* cable with gradient */}
      <defs><linearGradient id="vdgrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={LD.g} /><stop offset="100%" stopColor={LD.h} /></linearGradient></defs>
      <line x1="64" y1="70" x2="320" y2="70" stroke="url(#vdgrad)" strokeWidth="3" />
      <line x1="64" y1="90" x2="320" y2="90" stroke="url(#vdgrad)" strokeWidth="3" opacity="0.6" />
      <text x="150" y="60" fontFamily="monospace" fontSize="8" fill={LD.d}>length L · resistance mV/A/m</text>
      {/* load */}
      <rect x="320" y="56" width="46" height="48" rx="4" fill="#12151A" stroke={LD.v} strokeWidth="1.2" /><text x="343" y="80" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.v}>load</text><text x="343" y="94" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>230−Vd</text>
      <rect x="60" y="120" width="306" height="26" rx="5" fill="rgba(240,165,0,0.05)" stroke="rgba(240,165,0,0.2)" strokeWidth="0.7" />
      <text x="213" y="137" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.t}>Vd = (mV/A/m × Ib × L) ÷ 1000</text>
    </svg>
  );
}

function ACWaveDiagram() {
  const pts: string[] = [];
  for (let x = 0; x <= 300; x += 3) { const a = (x / 300) * 4 * Math.PI; pts.push(`${x + 40},${80 - Math.sin(a) * 44}`); }
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="AC sine wave with peak and RMS values">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.v} opacity="0.6">AC · PEAK, RMS &amp; PERIOD</text>
      <line x1="40" y1="80" x2="356" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      <polyline points={pts.join(" ")} fill="none" stroke={LD.v} strokeWidth="1.8" />
      {/* peak */}
      <line x1="40" y1="36" x2="356" y2="36" stroke={LD.c} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" /><text x="360" y="39" fontFamily="monospace" fontSize="8" fill={LD.c}>Vₚₖ</text>
      {/* rms 0.707 */}
      <line x1="40" y1="49" x2="356" y2="49" stroke={LD.g} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" /><text x="360" y="52" fontFamily="monospace" fontSize="8" fill={LD.g}>Vᵣₘₛ</text>
      <text x="60" y="140" fontFamily="monospace" fontSize="9" fill={LD.t} opacity="0.85">Vᵣₘₛ = Vₚₖ / √2   ·   T = 1/f</text>
    </svg>
  );
}

function CableDeratingDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Cable current capacity reduced by derating factors">
      <text x="14" y="18" fontFamily="monospace" fontSize="9" fill={LD.v} opacity="0.6">DERATING · TABULATED → EFFECTIVE</text>
      {[{ x: 20, t: "Iz(tab)", s: "table", c: LD.v }, { x: 118, t: "× Ca", s: "ambient", c: LD.c }, { x: 196, t: "× Cg", s: "grouping", c: LD.c }, { x: 274, t: "× Ci", s: "insul.", c: LD.c }].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="52" width="72" height="40" rx="5" fill="#12151A" stroke={b.c} strokeWidth="1.1" />
          <text x={b.x + 36} y="72" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={b.c}>{b.t}</text>
          <text x={b.x + 36} y="86" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>{b.s}</text>
          {i < 3 && <text x={b.x + 80} y="76" fontFamily="monospace" fontSize="11" fill={LD.d}>×</text>}
        </g>
      ))}
      <text x="352" y="76" fontFamily="monospace" fontSize="12" fill={LD.g}>≥ It</text>
      <rect x="60" y="112" width="280" height="30" rx="5" fill="rgba(52,211,153,0.05)" stroke="rgba(52,211,153,0.2)" strokeWidth="0.7" />
      <text x="200" y="131" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.t}>It = In ÷ (Ca × Cg × Ci)   ·   pick next size up</text>
    </svg>
  );
}

function PVSystemDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Solar PV system from panel to grid and battery">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.g} opacity="0.6">PV STRING → INVERTER → GRID</text>
      {/* panel */}
      <rect x="20" y="40" width="56" height="40" rx="3" fill="#001A40" stroke={LD.v} strokeWidth="1.1" />
      {[0, 1, 2].map(r => [0, 1, 2].map(c => <rect key={`${r}${c}`} x={24 + c * 17} y={44 + r * 12} width="14" height="9" fill="rgba(0,212,255,0.18)" stroke={LD.v} strokeWidth="0.3" />))}
      <text x="48" y="94" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>array (DC)</text>
      <line x1="76" y1="60" x2="140" y2="60" stroke={LD.c} strokeWidth="1.6" />
      {/* inverter */}
      <rect x="140" y="42" width="70" height="40" rx="4" fill="#0A1410" stroke={LD.g} strokeWidth="1.2" /><text x="175" y="60" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.g}>INVERTER</text><text x="175" y="72" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.c}>DC→AC</text>
      <line x1="210" y1="62" x2="274" y2="62" stroke={LD.g} strokeWidth="1.6" />
      {/* grid */}
      <rect x="274" y="42" width="64" height="40" rx="4" fill="#0A0A14" stroke={LD.p} strokeWidth="1.2" /><text x="306" y="60" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.p}>GRID</text><text x="306" y="72" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>230V 50Hz</text>
      {/* battery */}
      <rect x="140" y="104" width="70" height="24" rx="4" fill="#0A1010" stroke={LD.g} strokeWidth="0.9" /><text x="175" y="120" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.g}>BATTERY</text>
      <line x1="175" y1="82" x2="175" y2="104" stroke={LD.p} strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
      <text x="60" y="150" fontFamily="monospace" fontSize="8" fill={LD.t} opacity="0.8">string V within inverter MPPT window at coldest temp</text>
    </svg>
  );
}

function DOLStarterDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Direct-on-line motor starter control circuit">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">DOL STARTER · CONTROL CIRCUIT</text>
      <line x1="30" y1="28" x2="30" y2="130" stroke={LD.t} strokeWidth="1.4" opacity="0.4" /><text x="18" y="26" fontFamily="monospace" fontSize="7" fill={LD.d}>L</text>
      <line x1="360" y1="28" x2="360" y2="130" stroke={LD.t} strokeWidth="1.4" opacity="0.4" /><text x="352" y="26" fontFamily="monospace" fontSize="7" fill={LD.d}>N</text>
      {/* stop NC */}
      <line x1="30" y1="52" x2="70" y2="52" stroke={LD.c} strokeWidth="1.6" /><line x1="70" y1="46" x2="70" y2="58" stroke={LD.h} strokeWidth="1.4" /><line x1="82" y1="46" x2="82" y2="58" stroke={LD.h} strokeWidth="1.4" /><line x1="70" y1="52" x2="82" y2="46" stroke={LD.h} strokeWidth="1.2"/><text x="66" y="70" fontFamily="monospace" fontSize="7" fill={LD.d}>STOP</text>
      {/* start NO */}
      <line x1="82" y1="52" x2="120" y2="52" stroke={LD.c} strokeWidth="1.6" /><rect x="120" y="46" width="16" height="12" fill="none" stroke={LD.g} strokeWidth="1.4" /><text x="118" y="70" fontFamily="monospace" fontSize="7" fill={LD.d}>START</text>
      {/* coil */}
      <line x1="136" y1="52" x2="300" y2="52" stroke={LD.c} strokeWidth="1.6" /><circle cx="316" cy="52" r="12" fill="rgba(240,165,0,0.12)" stroke={LD.c} strokeWidth="1.4" /><text x="316" y="56" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={LD.c}>M</text><line x1="328" y1="52" x2="360" y2="52" stroke={LD.c} strokeWidth="1.6" />
      {/* hold-in aux */}
      <line x1="82" y1="52" x2="82" y2="90" stroke={LD.c} strokeWidth="1.4" /><rect x="112" y="84" width="16" height="12" fill="rgba(240,165,0,0.1)" stroke={LD.c} strokeWidth="1.2" /><line x1="82" y1="90" x2="112" y2="90" stroke={LD.c} strokeWidth="1.4" /><line x1="128" y1="90" x2="136" y2="90" stroke={LD.c} strokeWidth="1.4" /><line x1="136" y1="90" x2="136" y2="52" stroke={LD.c} strokeWidth="1.4" /><text x="98" y="108" fontFamily="monospace" fontSize="7" fill={LD.d}>M aux (hold-in)</text>
      {/* motor */}
      <circle cx="316" cy="118" r="12" fill="rgba(168,85,247,0.1)" stroke={LD.p} strokeWidth="1.3" /><text x="316" y="122" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.p}>3~</text>
      <text x="200" y="140" fontFamily="monospace" fontSize="8" fill={LD.t} opacity="0.75">latching start/stop with overload protection</text>
    </svg>
  );
}

function AtomDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Atom with electron shells and drifting free electron">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">CHARGE FLOW · I = Q / t</text>
      <circle cx="90" cy="82" r="10" fill={LD.h} opacity="0.7" /><text x="90" y="86" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.t}>+</text>
      <ellipse cx="90" cy="82" rx="34" ry="34" fill="none" stroke={LD.v} strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="90" cy="82" rx="52" ry="24" fill="none" stroke={LD.v} strokeWidth="0.8" opacity="0.4" transform="rotate(30 90 82)" />
      {[[90, 48], [124, 82], [58, 96]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={LD.v} />)}
      {/* drift */}
      <line x1="150" y1="82" x2="340" y2="82" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      {[170, 210, 250, 290, 330].map((x, i) => <g key={i}><circle cx={x} cy="82" r="4" fill={LD.g} /><polygon points={`${x + 8},79 ${x + 14},82 ${x + 8},85`} fill={LD.g} opacity="0.6" /></g>)}
      <text x="150" y="112" fontFamily="monospace" fontSize="8" fill={LD.g}>electron drift = current</text>
      <text x="150" y="138" fontFamily="monospace" fontSize="9" fill={LD.t} opacity="0.85">1 A = 1 coulomb per second</text>
    </svg>
  );
}

function EarthingMiniDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="TN-C-S and TT earthing arrangements">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.g} opacity="0.6">EARTHING · TN-C-S (PME) vs TT</text>
      {/* TN-C-S */}
      <text x="24" y="40" fontFamily="monospace" fontSize="8" fill={LD.t}>TN-C-S</text>
      <circle cx="34" cy="70" r="9" fill="none" stroke={LD.c} strokeWidth="1.2" /><text x="20" y="94" fontFamily="monospace" fontSize="7" fill={LD.d}>source</text>
      <line x1="43" y1="66" x2="120" y2="66" stroke={LD.h} strokeWidth="1.6" /><text x="124" y="69" fontFamily="monospace" fontSize="7" fill={LD.h}>L</text>
      <line x1="43" y1="78" x2="100" y2="78" stroke={LD.g} strokeWidth="2.4" strokeDasharray="5 2" /><text x="60" y="92" fontFamily="monospace" fontSize="7" fill={LD.g}>PEN</text>
      <line x1="100" y1="78" x2="100" y2="110" stroke={LD.g} strokeWidth="1.6" /><text x="104" y="108" fontFamily="monospace" fontSize="7" fill={LD.g}>MET (split N/PE)</text>
      {/* TT */}
      <text x="234" y="40" fontFamily="monospace" fontSize="8" fill={LD.t}>TT</text>
      <circle cx="244" cy="70" r="9" fill="none" stroke={LD.c} strokeWidth="1.2" />
      <line x1="253" y1="66" x2="330" y2="66" stroke={LD.h} strokeWidth="1.6" /><text x="334" y="69" fontFamily="monospace" fontSize="7" fill={LD.h}>L</text>
      <line x1="253" y1="78" x2="330" y2="78" stroke={LD.d} strokeWidth="1.6" /><text x="334" y="81" fontFamily="monospace" fontSize="7" fill={LD.d}>N</text>
      {/* electrode */}
      <line x1="360" y1="66" x2="360" y2="112" stroke={LD.g} strokeWidth="1.6" /><line x1="352" y1="112" x2="368" y2="112" stroke={LD.g} strokeWidth="2" /><line x1="355" y1="116" x2="365" y2="116" stroke={LD.g} strokeWidth="1.5" /><line x1="357" y1="120" x2="363" y2="120" stroke={LD.g} strokeWidth="1.2" />
      <text x="300" y="134" fontFamily="monospace" fontSize="7.5" fill={LD.d}>own electrode → RCD required</text>
    </svg>
  );
}

function TestSequenceDiagram() {
  const dead = ["Continuity", "Insulation R", "Polarity"];
  const live = ["Ze / Zs", "RCD trip"];
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="Inspection and testing sequence, dead tests then live tests">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.v} opacity="0.6">TEST SEQUENCE · DEAD → LIVE</text>
      <rect x="20" y="30" width="180" height="110" rx="6" fill="rgba(52,211,153,0.05)" stroke={LD.g} strokeWidth="0.9" />
      <text x="30" y="48" fontFamily="monospace" fontSize="8" fill={LD.g}>DEAD (isolated)</text>
      {dead.map((t, i) => (<g key={i}><rect x="34" y={58 + i * 24} width="150" height="18" rx="4" fill="#12151A" stroke={LD.g} strokeWidth="0.8" /><text x="44" y={70 + i * 24} fontFamily="monospace" fontSize="8" fill={LD.t}>{i + 1}. {t}</text></g>))}
      <polygon points="204,84 224,84 214,94 224,84 214,74" fill={LD.d} />
      <rect x="228" y="30" width="150" height="110" rx="6" fill="rgba(255,68,68,0.05)" stroke={LD.h} strokeWidth="0.9" />
      <text x="238" y="48" fontFamily="monospace" fontSize="8" fill={LD.h}>LIVE (energised)</text>
      {live.map((t, i) => (<g key={i}><rect x="242" y={58 + i * 24} width="124" height="18" rx="4" fill="#12151A" stroke={LD.h} strokeWidth="0.8" /><text x="252" y={70 + i * 24} fontFamily="monospace" fontSize="8" fill={LD.t}>{i + 4}. {t}</text></g>))}
      <text x="242" y="128" fontFamily="monospace" fontSize="7.5" fill={LD.d}>never live-test before dead tests pass</text>
    </svg>
  );
}

function LEDLuxDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={ldWrap} role="img" aria-label="LED luminaire illuminating a work plane, lumen method">
      <text x="14" y="16" fontFamily="monospace" fontSize="9" fill={LD.c} opacity="0.6">LUMEN METHOD · ILLUMINANCE</text>
      {/* luminaire */}
      <rect x="150" y="30" width="90" height="12" rx="3" fill={LD.c} opacity="0.7" /><text x="195" y="26" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>luminaire · lm</text>
      {/* beam */}
      <polygon points="160,42 230,42 300,120 90,120" fill="rgba(240,165,0,0.1)" stroke="rgba(240,165,0,0.25)" strokeWidth="0.6" />
      {/* work plane */}
      <line x1="80" y1="120" x2="310" y2="120" stroke={LD.g} strokeWidth="2" /><text x="150" y="136" fontFamily="monospace" fontSize="8" fill={LD.g}>work plane · area A</text>
      <rect x="300" y="46" width="90" height="60" rx="5" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.7" />
      <text x="345" y="66" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.t}>E = F·UF·MF</text>
      <text x="345" y="80" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={LD.t}>÷ A</text>
      <text x="345" y="98" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={LD.d}>lux (lm/m²)</text>
    </svg>
  );
}

function LessonContent({ lesson, courseColor, courseSlug, moduleTitle, previousLesson, nextLesson, onNavigate }: {
  lesson: { id: string; title: string; duration: string; type: string };
  courseColor: string;
  courseSlug: string;
  moduleTitle: string;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
  onNavigate: (lessonId: string) => void;
}) {
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const quizData = getQuizForLesson(lesson.title, courseSlug);
  const exerciseData = getExerciseForLesson(lesson.title, courseSlug);
  const lessonBody = getLessonBody(lesson.title, courseSlug, moduleTitle);
  const enhancedLesson = getEnhancedLesson(courseSlug, lesson.id);

  return (
    <div style={{
      margin: "0 1.25rem 1rem",
      borderRadius: 10,
      border: `1px solid ${courseColor}30`,
      background: "rgba(255,255,255,0.018)",
      overflow: "hidden",
    }}>
      {/* Lesson type header */}
      <div style={{
        padding: "0.75rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
        background: `${courseColor}08`,
      }}>
        <span style={{ fontSize: "0.8rem", color: courseColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {lesson.type === "video" ? "▶ Lesson" : lesson.type === "quiz" ? "✦ Quiz" : "⚡ Exercise"} · {lesson.duration}
        </span>
      </div>

      {lesson.type === "quiz" && quizData ? (
        /* QUIZ */
        <div style={{ padding: "1.25rem" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--text)" }}>{quizData.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {quizData.options.map((opt, i) => {
              const isSelected = quizAnswered === i;
              const isCorrect = i === quizData.correct;
              const showResult = quizAnswered !== null;
              return (
                <button key={i}
                  onClick={() => {
                    if (quizAnswered !== null) return;
                    setQuizAnswered(i);
                    try { recordAssessment(localStorage, courseSlug, lesson.id, i === quizData.correct ? 100 : 0); } catch {}
                  }}
                  style={{
                    textAlign: "left", padding: "0.75rem 1rem", borderRadius: 8,
                    border: `1px solid ${showResult ? (isCorrect ? "#34D399" : isSelected ? "#FF6B35" : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.1)"}`,
                    background: showResult ? (isCorrect ? "rgba(52,211,153,0.08)" : isSelected ? "rgba(255,107,53,0.08)" : "transparent") : "rgba(255,255,255,0.03)",
                    color: showResult ? (isCorrect ? "#34D399" : isSelected ? "#FF6B35" : "var(--text-mute)") : "var(--text-dim)",
                    cursor: quizAnswered === null ? "pointer" : "default",
                    fontSize: "0.875rem", lineHeight: 1.5,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontFamily: "monospace", marginRight: 8, opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {showResult && isCorrect && " ✓"}
                  {showResult && isSelected && !isCorrect && " ✗"}
                </button>
              );
            })}
          </div>
          {quizAnswered !== null && (
            <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", borderRadius: 8, background: quizAnswered === quizData.correct ? "rgba(52,211,153,0.08)" : "rgba(240,165,0,0.08)", border: `1px solid ${quizAnswered === quizData.correct ? "rgba(52,211,153,0.25)" : "rgba(240,165,0,0.25)"}`, fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
              <strong style={{ color: quizAnswered === quizData.correct ? "#34D399" : "#F0A500" }}>{quizAnswered === quizData.correct ? "Correct! " : "Not quite. "}</strong>
              {quizData.explanation}
              <button type="button" className="lesson-retry" onClick={() => setQuizAnswered(null)}>Retry question</button>
            </div>
          )}
        </div>
      ) : lesson.type === "exercise" && exerciseData ? (
        /* EXERCISE */
        <div style={{ padding: "1.25rem" }}>
          <div style={{ padding: "1rem", borderRadius: 8, background: `${courseColor}0A`, border: `1px solid ${courseColor}20`, marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.72rem", fontFamily: "monospace", color: courseColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Problem</div>
            <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>{exerciseData.problem}</p>
          </div>
          <button
            onClick={() => setShowSolution(s => {
              const next = !s;
              if (next) try { recordExercise(localStorage, courseSlug, lesson.id); } catch {}
              return next;
            })}
            style={{ background: `${courseColor}15`, border: `1px solid ${courseColor}35`, color: courseColor, padding: "0.625rem 1.25rem", borderRadius: 8, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, marginBottom: showSolution ? "1rem" : 0 }}
          >
            {showSolution ? "Hide Solution ↑" : "Reveal Solution →"}
          </button>
          {showSolution && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {exerciseData.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "0.875rem", padding: "0.75rem", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${courseColor}20`, border: `1px solid ${courseColor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.72rem", fontWeight: 700, color: courseColor }}>{i + 1}</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>{step}</p>
                </div>
              ))}
              <div style={{ padding: "0.875rem 1rem", borderRadius: 8, background: `${courseColor}10`, border: `1px solid ${courseColor}30`, marginTop: "0.25rem" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: courseColor, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.35rem" }}>Answer</span>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: courseColor }}>{exerciseData.answer}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIDEO — rich reading lesson */
        <div style={{ padding: "1.25rem" }}>
          {lessonBody.diagram && (
            <div style={{ marginBottom: "1rem", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              {lessonBody.diagram}
            </div>
          )}
          {enhancedLesson ? (
            <EnhancedLessonView lesson={enhancedLesson} courseSlug={courseSlug} lessonId={lesson.id} />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {lessonBody.points.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem" }}>
                    <span style={{ color: courseColor, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>{pt}</p>
                  </div>
                ))}
              </div>
              {lessonBody.formula && (
                <div style={{ marginTop: "1rem", padding: "0.875rem 1.25rem", borderRadius: 8, background: `${courseColor}0A`, border: `1px solid ${courseColor}25`, fontFamily: "monospace", fontSize: "1.1rem", color: courseColor, letterSpacing: "0.06em", textAlign: "center" }}>
                  {lessonBody.formula}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <nav className="lesson-sequence" aria-label="Lesson sequence">
        {previousLesson ? <button type="button" onClick={() => onNavigate(previousLesson.id)}>← <span>Previous</span><strong>{previousLesson.title}</strong></button> : <span />}
        {nextLesson ? <button type="button" onClick={() => onNavigate(nextLesson.id)}><span>Next</span><strong>{nextLesson.title}</strong> →</button> : <span />}
      </nav>
    </div>
  );
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = COURSES[slug];

  const [expanded, setExpanded] = useState<Set<string>>(new Set(["m1"]));
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = loadCourseLearning(localStorage, slug);
      setCompleted(new Set(saved.completedLessons));
      if (saved.lastLessonId) {
        setActiveLesson(saved.lastLessonId);
        const owner = course?.modules.find((mod) => mod.lessons.some((lesson) => lesson.id === saved.lastLessonId));
        if (owner) setExpanded(prev => new Set(prev).add(owner.id));
      }
    } catch {
      // Malformed or unavailable browser storage falls back to empty local state.
    }
  }, [course, slug]);

  const toggleComplete = (lessonId: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      try {
        const total = course?.modules.reduce((sum, mod) => sum + mod.lessons.length, 0) ?? 0;
        saveLessonCompletion(localStorage, slug, [...next], total);
      } catch {
        // Completion still updates in memory when storage is unavailable.
      }
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

  const courseAccess = evaluateLearningAccess({ resource: "course" });
  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const progressPct = Math.round((completed.size / totalLessons) * 100);
  const totalMinutes = course.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + parseInt(l.duration), 0), 0);
  const courseLessons = course.modules.flatMap((mod) => mod.lessons);
  const navigateLesson = (lessonId: string) => {
    setActiveLesson(lessonId);
    const owner = course.modules.find((mod) => mod.lessons.some((lesson) => lesson.id === lessonId));
    if (owner) setExpanded(prev => new Set(prev).add(owner.id));
    try { saveLastLesson(localStorage, slug, lessonId); } catch {}
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <ElectraCoreLogoMark size={32} />
          <span className="nav-logo-text">ElectraCore</span>
        </Link>
        <div className="nav-links">
          <Link href="/design" className="nav-link">Design</Link>
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
                <p role="status" style={{ color: "var(--text-mute)", fontSize: "0.8rem", marginBottom: "1rem" }}>{OPEN_PREVIEW_NOTICE}</p>
                {/* Meta row */}
                <div className="course-meta-row">
                  {[
                    { icon: "📚", label: `${course.modules.length} modules` },
                    { icon: "🎬", label: `${totalLessons} lessons` },
                    { icon: "⏱", label: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}min` },
                    { icon: "🆓", label: "Open preview" },
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
                            const lessonIndex = courseLessons.findIndex((item) => item.id === lesson.id);
                            const isDone = completed.has(lesson.id);
                            const isActive = activeLesson === lesson.id;
                            return (
                              <div key={lesson.id}>
                                <div className={`lesson-item${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                                  onClick={() => {
                                    const nextLesson = isActive ? null : lesson.id;
                                    setActiveLesson(nextLesson);
                                    if (nextLesson) try { saveLastLesson(localStorage, slug, nextLesson); } catch {}
                                  }}>
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
                                {isActive && (
                                  <LessonContent
                                    lesson={lesson}
                                    courseColor={course.color}
                                    courseSlug={slug}
                                    moduleTitle={mod.title}
                                    previousLesson={courseLessons[lessonIndex - 1]}
                                    nextLesson={courseLessons[lessonIndex + 1]}
                                    onNavigate={navigateLesson}
                                  />
                                )}
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
                  <p style={{ fontSize: "0.72rem", color: "var(--text-mute)", marginTop: "0.45rem" }}>Progress is stored on this device. No account sync is active.</p>
                </div>
                <div className="progress-stats">
                  {[
                    { label: "Modules", val: course.modules.length },
                    { label: "Hours", val: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m` },
                    { label: "Level", val: course.level },
                    { label: "Access", val: courseAccess.allowed ? "Open preview" : "Required" },
                  ].map(s => (
                    <div key={s.label} className="progress-stat-row">
                      <span style={{ color: "var(--text-mute)", fontSize: "0.8rem" }}>{s.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: s.label === "Access" ? "#34D399" : "var(--text)" }}>{s.val}</span>
                    </div>
                  ))}
                </div>
                {completed.size > 0 && (
                  <button
                    onClick={() => {
                      setCompleted(new Set());
                      try { resetCourseLearning(localStorage, slug); } catch {}
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
        .lesson-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; cursor: pointer; transition: background 0.15s; gap: 0.5rem; border-left: 3px solid transparent; }
        .lesson-item:hover { background: rgba(255,255,255,0.025); }
        .lesson-item.done { opacity: 0.6; }
        .lesson-item.active { background: rgba(255,255,255,0.04); border-left: 3px solid currentColor; }
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
