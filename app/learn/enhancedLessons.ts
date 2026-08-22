export interface LessonTerm { term: string; meaning: string; symbol?: string; unit?: string; }
export interface WorkedStep { label: string; detail: string; }
export interface KnowledgeCheck { question: string; answer: string; feedback: string; }
export interface LessonSource { title: string; publisher: string; edition: string; jurisdiction: string; url?: string; }

export interface EnhancedLesson {
  purpose: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  objectives: string[];
  introduction: string;
  theory: string[];
  terms: LessonTerm[];
  formula?: { expression: string; explanation: string; units: string };
  workedExample: { problem: string; assumptions: string[]; steps: WorkedStep[]; answer: string; reasonableness: string };
  commonMistakes: string[];
  application: string;
  safety: string;
  localCode: string;
  knowledgeCheck: KnowledgeCheck;
  practicalExercise: string;
  summary: string[];
  sources: LessonSource[];
  reviewDate: string;
  reviewStatus: "professional-review-pending" | "professionally-reviewed";
}

const commonSources: LessonSource[] = [
  { title: "The Feynman Lectures on Physics, Volume II", publisher: "Caltech", edition: "Online edition", jurisdiction: "Physics reference" },
  { title: "International Electrotechnical Vocabulary — Electromagnetism", publisher: "IEC", edition: "Current edition must be confirmed", jurisdiction: "International" },
];

import { FUNDAMENTALS_GROUP_ONE } from "./fundamentalsGroupOne.ts";
import { FUNDAMENTALS_GROUP_TWO } from "./fundamentalsGroupTwo.ts";
import { FUNDAMENTALS_AC_LESSONS } from "./fundamentalsAcLessons.ts";
import { FUNDAMENTALS_REACTIVE_LESSONS } from "./fundamentalsReactiveLessons.ts";
import { FUNDAMENTALS_MEASUREMENT_LESSONS } from "./fundamentalsMeasurementLessons.ts";
import { DOMESTIC_CONSUMER_UNIT_LESSONS } from "./domesticConsumerUnitLessons.ts";
import { DOMESTIC_FINAL_CIRCUIT_LESSONS } from "./domesticFinalCircuitLessons.ts";
import { DOMESTIC_LIGHTING_EARTHING_LESSONS } from "./domesticLightingEarthingLessons.ts";
import { DOMESTIC_LOCATIONS_CABLES_LESSONS } from "./domesticLocationsCablesLessons.ts";
import { DOMESTIC_FAULT_REGULATION_LESSONS } from "./domesticFaultRegulationLessons.ts";
import { PROTECTION_DEVICE_LESSONS } from "./protectionDeviceLessons.ts";
import { PROTECTION_LOOP_LESSONS } from "./protectionLoopLessons.ts";
import { PROTECTION_RCD_PFC_LESSONS } from "./protectionRcdPfcLessons.ts";
import { PROTECTION_COORDINATION_TESTING_LESSONS } from "./protectionCoordinationTestingLessons.ts";
import { THREE_PHASE_FUNDAMENTALS_LESSONS } from "./threePhaseFundamentalsLessons.ts";
import { THREE_PHASE_DELTA_POWER_LESSONS } from "./threePhaseDeltaPowerLessons.ts";
import { THREE_PHASE_MACHINES_LESSONS } from "./threePhaseMachinesLessons.ts";
import { CABLE_CCC_DERATING_LESSONS } from "./cableCccDeratingLessons.ts";
import { CABLE_VOLTAGE_SWA_LESSONS } from "./cableVoltageSwaLessons.ts";
import { CABLE_FIRE_DESIGN_LESSONS } from "./cableFireDesignLessons.ts";
import { SOLAR_PHYSICS_DESIGN_LESSONS } from "./solarPhysicsDesignLessons.ts";
import { SOLAR_INVERTER_BATTERY_LESSONS } from "./solarInverterBatteryLessons.ts";
import { SOLAR_GRID_COMMISSIONING_LESSONS } from "./solarGridCommissioningLessons.ts";
import { INDUSTRIAL_STARTER_PROTECTION_LESSONS } from "./industrialStarterProtectionLessons.ts";
import { INDUSTRIAL_DIAGRAM_SAFETY_LESSONS } from "./industrialDiagramSafetyLessons.ts";
import { INDUSTRIAL_PLC_PANEL_LESSONS } from "./industrialPlcPanelLessons.ts";
import { INSPECTION_PREPARATION_CONTINUITY_LESSONS } from "./inspectionPreparationContinuityLessons.ts";
import { INSPECTION_IR_LOOP_LESSONS } from "./inspectionIrLoopLessons.ts";
import { INSPECTION_RCD_PFC_LESSONS } from "./inspectionRcdPfcLessons.ts";
import { INSPECTION_CERTIFICATION_LESSONS } from "./inspectionCertificationLessons.ts";

export const ENHANCED_LESSONS: Record<string, EnhancedLesson> = {
  ...FUNDAMENTALS_GROUP_ONE,
  ...FUNDAMENTALS_GROUP_TWO,
  ...FUNDAMENTALS_AC_LESSONS,
  ...FUNDAMENTALS_REACTIVE_LESSONS,
  ...FUNDAMENTALS_MEASUREMENT_LESSONS,
  ...DOMESTIC_CONSUMER_UNIT_LESSONS,
  ...DOMESTIC_FINAL_CIRCUIT_LESSONS,
  ...DOMESTIC_LIGHTING_EARTHING_LESSONS,
  ...DOMESTIC_LOCATIONS_CABLES_LESSONS,
  ...DOMESTIC_FAULT_REGULATION_LESSONS,
  ...PROTECTION_DEVICE_LESSONS,
  ...PROTECTION_LOOP_LESSONS,
  ...PROTECTION_RCD_PFC_LESSONS,
  ...PROTECTION_COORDINATION_TESTING_LESSONS,
  ...THREE_PHASE_FUNDAMENTALS_LESSONS,
  ...THREE_PHASE_DELTA_POWER_LESSONS,
  ...THREE_PHASE_MACHINES_LESSONS,
  ...CABLE_CCC_DERATING_LESSONS,
  ...CABLE_VOLTAGE_SWA_LESSONS,
  ...CABLE_FIRE_DESIGN_LESSONS,
  ...SOLAR_PHYSICS_DESIGN_LESSONS,
  ...SOLAR_INVERTER_BATTERY_LESSONS,
  ...SOLAR_GRID_COMMISSIONING_LESSONS,
  ...INDUSTRIAL_STARTER_PROTECTION_LESSONS,
  ...INDUSTRIAL_DIAGRAM_SAFETY_LESSONS,
  ...INDUSTRIAL_PLC_PANEL_LESSONS,
  ...INSPECTION_PREPARATION_CONTINUITY_LESSONS,
  ...INSPECTION_IR_LOOP_LESSONS,
  ...INSPECTION_RCD_PFC_LESSONS,
  ...INSPECTION_CERTIFICATION_LESSONS,
  "electrical-fundamentals:l6": {
    purpose: "Distinguish voltage from current and use potential difference correctly when describing a circuit.",
    difficulty: "Beginner",
    prerequisites: ["Electric charge", "Conductors and insulators", "Basic subtraction"],
    objectives: ["Define potential difference", "Relate one volt to one joule per coulomb", "Measure voltage in parallel", "Explain source voltage and component voltage drop"],
    introduction: "Voltage describes an energy difference between two points. It is not a substance flowing through a wire: it tells us how much energy each coulomb could transfer moving between those points.",
    theory: [
      "A source separates charge and establishes an electric potential difference. A load converts electrical energy into heat, light, motion, or another form.",
      "Potential is defined at a point relative to a reference; voltage is the difference between two potentials. That is why a voltmeter always uses two probes.",
      "Across a closed-loop circuit, voltage rises supplied by sources balance voltage drops across loads when stored energy is not changing.",
    ],
    terms: [
      { term: "Potential difference", meaning: "Energy transferred per unit charge between two points", symbol: "V", unit: "volt (V)" },
      { term: "Charge", meaning: "Quantity of electricity", symbol: "Q", unit: "coulomb (C)" },
      { term: "Energy", meaning: "Capacity to do work", symbol: "E", unit: "joule (J)" },
    ],
    formula: { expression: "V = E ÷ Q", explanation: "Potential difference equals energy transferred divided by charge moved.", units: "1 V = 1 J/C" },
    workedExample: {
      problem: "A lamp transfers 24 J while 2 C of charge passes through it. Find the lamp voltage.",
      assumptions: ["The stated energy is electrical energy transferred by the lamp", "Values refer to the same interval"],
      steps: [
        { label: "Identify", detail: "E = 24 J and Q = 2 C." },
        { label: "Substitute", detail: "V = E ÷ Q = 24 J ÷ 2 C." },
        { label: "Calculate", detail: "V = 12 J/C = 12 V." },
      ],
      answer: "The potential difference across the lamp is 12 V.",
      reasonableness: "Each coulomb transfers 12 joules, so two coulombs transfer 24 joules.",
    },
    commonMistakes: ["Calling voltage a flow", "Quoting a voltage without identifying the two points", "Connecting a voltmeter in series"],
    application: "Technicians compare measured voltage at the supply and load to locate excessive drop in cables or connections.",
    safety: "Voltage measurement can expose the operator to live conductors. Use a correctly rated instrument, leads, PPE, and safe method; learners should not probe live installations without competent supervision.",
    localCode: "Instrument categories, permitted live work, nominal supply voltage, and safe procedures depend on location and task. Confirm current local rules.",
    knowledgeCheck: { question: "A device transfers 60 J for 5 C. What voltage is across it?", answer: "12 V", feedback: "Use V = E/Q: 60 J ÷ 5 C = 12 J/C." },
    practicalExercise: "On a de-energised battery circuit or simulator, label the two points for each voltage reading before calculating or measuring it.",
    summary: ["Voltage is an energy difference, not a flow", "It is measured between two points", "One volt equals one joule per coulomb"],
    sources: commonSources,
    reviewDate: "2026-08-14",
    reviewStatus: "professional-review-pending",
  },
  "electrical-fundamentals:l7": {
    purpose: "Explain current as charge flow and calculate current, charge, or time with consistent units.",
    difficulty: "Beginner",
    prerequisites: ["Electric charge and the coulomb", "Division and unit conversion"],
    objectives: ["Define the ampere", "Use I = Q/t", "Convert mA to A", "Distinguish conventional current from electron drift"],
    introduction: "Current tells us how quickly charge crosses a chosen section of a circuit. A large current means more charge passes each second.",
    theory: [
      "One ampere means one coulomb passes a cross-section each second. Current is assigned a conventional direction from higher to lower potential in the external circuit.",
      "In metallic conductors electrons drift in the opposite direction to conventional current. Circuit laws remain consistent when one convention is used throughout.",
      "Current is measured by placing an ammeter in series so the same branch current passes through the instrument.",
    ],
    terms: [
      { term: "Current", meaning: "Rate of charge flow", symbol: "I", unit: "ampere (A)" },
      { term: "Charge", meaning: "Electrical quantity carried by particles", symbol: "Q", unit: "coulomb (C)" },
      { term: "Time", meaning: "Duration of the measured transfer", symbol: "t", unit: "second (s)" },
    ],
    formula: { expression: "I = Q ÷ t", explanation: "Divide charge passing the reference point by elapsed time.", units: "A = C/s; 1000 mA = 1 A" },
    workedExample: {
      problem: "A control circuit transfers 0.45 C in 150 ms. Find the average current.",
      assumptions: ["Current is averaged across the 150 ms interval"],
      steps: [
        { label: "Convert time", detail: "150 ms = 0.150 s." },
        { label: "Substitute", detail: "I = 0.45 C ÷ 0.150 s." },
        { label: "Calculate", detail: "I = 3.0 C/s = 3.0 A." },
      ],
      answer: "The average current is 3.0 A.",
      reasonableness: "At 3 C/s, 0.45 C takes 0.15 s to pass.",
    },
    commonMistakes: ["Using milliseconds without converting to seconds", "Connecting an ammeter across a supply", "Confusing electron direction with conventional current"],
    application: "Protective devices, conductor sizes, connectors, and switches are selected partly from the current they must carry.",
    safety: "An ammeter has a low-resistance current path. Connecting it directly across a voltage source can cause high fault current, arc, burns, and equipment damage.",
    localCode: "Permitted measurement methods and test equipment ratings vary. Follow manufacturer instructions and current workplace/local electrical-safety requirements.",
    knowledgeCheck: { question: "How much charge passes at 250 mA for 8 s?", answer: "2 C", feedback: "Convert 250 mA to 0.250 A, then Q = It = 0.250 × 8 = 2 C." },
    practicalExercise: "Calculate the charge moved by a 20 mA indicator during 30 s, then verify the unit path from A·s to C.",
    summary: ["Current is charge per second", "Convert prefixes before calculating", "Ammeters are connected in series"],
    sources: commonSources,
    reviewDate: "2026-08-14",
    reviewStatus: "professional-review-pending",
  },
  "electrical-fundamentals:l8": {
    purpose: "Relate resistance to material, geometry, and temperature without treating resistance as a fixed property of every component.",
    difficulty: "Beginner",
    prerequisites: ["Voltage and current", "Area and length"],
    objectives: ["Define resistance and resistivity", "Use R = ρL/A", "Predict effects of length and area", "Recognise temperature dependence"],
    introduction: "Resistance describes how strongly a component opposes current at a stated condition. Resistivity is a material property; geometry turns that property into a conductor resistance.",
    theory: [
      "For a uniform conductor, resistance increases with length and decreases as cross-sectional area increases.",
      "Resistivity depends on material and temperature. Copper has low resistivity, while insulation materials have extremely high resistivity.",
      "Metallic conductor resistance normally rises with temperature, so design and test values must state or account for temperature.",
    ],
    terms: [
      { term: "Resistance", meaning: "Ratio of voltage to current for the stated condition", symbol: "R", unit: "ohm (Ω)" },
      { term: "Resistivity", meaning: "Material property relating geometry to resistance", symbol: "ρ", unit: "Ω·m" },
      { term: "Cross-sectional area", meaning: "Conductor area perpendicular to current flow", symbol: "A", unit: "m² or mm² with matched ρ units" },
    ],
    formula: { expression: "R = ρL ÷ A", explanation: "Multiply resistivity by conductor length, then divide by cross-sectional area.", units: "Use one consistent length/area system; Ω·m requires m and m²." },
    workedExample: {
      problem: "A uniform wire is replaced with the same material and length but twice the cross-sectional area. What happens to resistance?",
      assumptions: ["Temperature and material are unchanged", "Connections are ignored"],
      steps: [
        { label: "Original", detail: "R₁ = ρL/A." },
        { label: "New area", detail: "R₂ = ρL/(2A)." },
        { label: "Compare", detail: "R₂/R₁ = 1/2." },
      ],
      answer: "Resistance is halved.",
      reasonableness: "Twice the conducting area provides twice as much parallel path for charge movement.",
    },
    commonMistakes: ["Mixing mm² with resistivity stated in Ω·m", "Ignoring both outgoing and return conductor length", "Assuming resistance is unchanged as a conductor heats"],
    application: "Cable voltage drop and fault-loop calculations depend on conductor resistance, length, cross-section, material, and operating temperature.",
    safety: "Unexpected resistance at a loose termination produces local heating because loss is proportional to I²R. Discolouration or heat damage requires isolation and competent investigation.",
    localCode: "Cable tables and temperature corrections are jurisdiction- and product-specific. Use current manufacturer data and applicable installation standards.",
    knowledgeCheck: { question: "If conductor length doubles while material and area stay constant, what happens to resistance?", answer: "It doubles", feedback: "R is directly proportional to L in R = ρL/A." },
    practicalExercise: "Compare the expected relative resistance of equal-length 1.5 mm² and 2.5 mm² conductors without using tabulated resistivity.",
    summary: ["Resistance belongs to a component at stated conditions", "Resistivity belongs to the material", "Longer is higher resistance; larger area is lower"],
    sources: commonSources,
    reviewDate: "2026-08-14",
    reviewStatus: "professional-review-pending",
  },
  "electrical-fundamentals:l9": {
    purpose: "Apply Ohm's law with units, substitution, checks, and awareness of its limits.",
    difficulty: "Beginner",
    prerequisites: ["Voltage", "Current", "Resistance", "Rearranging simple equations"],
    objectives: ["Use all three Ohm's-law forms", "Show substitutions with units", "Check answers by inverse calculation", "Identify non-ohmic behavior"],
    introduction: "Ohm's law connects voltage, current, and resistance for a component when its physical conditions are sufficiently constant.",
    theory: [
      "For an ohmic component at constant temperature, current is proportional to voltage and the ratio V/I is constant.",
      "The three useful forms are V = IR, I = V/R, and R = V/I. Choose the form that leaves the required quantity alone.",
      "Lamps, diodes, thermistors, motors, and many electronic loads are not described by one constant resistance across all operating points.",
    ],
    terms: [
      { term: "Ohmic", meaning: "Having an approximately constant V/I ratio under stated conditions" },
      { term: "Operating point", meaning: "The specific voltage and current at which a device is working" },
      { term: "I–V characteristic", meaning: "Graph showing current response to applied voltage" },
    ],
    formula: { expression: "V = I × R   |   I = V ÷ R   |   R = V ÷ I", explanation: "Use volts, amperes, and ohms together; convert prefixes first.", units: "V = A·Ω; A = V/Ω; Ω = V/A" },
    workedExample: {
      problem: "A 24 V control supply feeds a 120 Ω coil. Calculate current and power.",
      assumptions: ["The coil is represented as 120 Ω at this operating condition", "Supply and conductor drop are neglected"],
      steps: [
        { label: "Current formula", detail: "I = V/R." },
        { label: "Current substitution", detail: "I = 24 V ÷ 120 Ω = 0.200 A." },
        { label: "Power check", detail: "P = VI = 24 V × 0.200 A = 4.8 W." },
        { label: "Inverse check", detail: "IR = 0.200 A × 120 Ω = 24 V." },
      ],
      answer: "Current is 0.200 A (200 mA); power is 4.8 W.",
      reasonableness: "A resistance five times the voltage number gives one-fifth of an ampere; the inverse check returns the supply voltage.",
    },
    commonMistakes: ["Entering milliamperes as amperes", "Multiplying when the required form needs division", "Applying a cold resistance to a hot filament or energized coil without qualification"],
    application: "Ohm's law supports sensor-loop checks, coil-current estimates, resistor selection, and first-pass fault diagnosis.",
    safety: "A mathematically correct result does not prove a component, conductor, or power source is safe. Confirm ratings, temperature, fault energy, isolation, and protective measures.",
    localCode: "Ohm's law is universal; installation permissions, conductor protection, testing, and live-work rules are local and task-specific.",
    knowledgeCheck: { question: "A 48 V circuit carries 0.40 A. What resistance does it present?", answer: "120 Ω", feedback: "R = V/I = 48 V ÷ 0.40 A = 120 Ω." },
    practicalExercise: "Choose a safe low-voltage resistor example, calculate expected current and power, then compare with a simulator or supervised bench measurement.",
    summary: ["Choose the rearranged form for the unknown", "Carry units through every step", "Check with an inverse calculation", "State when resistance may change"],
    sources: commonSources,
    reviewDate: "2026-08-14",
    reviewStatus: "professional-review-pending",
  },
};

export function getEnhancedLesson(courseSlug: string, lessonId: string) {
  return ENHANCED_LESSONS[`${courseSlug}:${lessonId}`];
}
