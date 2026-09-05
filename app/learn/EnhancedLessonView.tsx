"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { EnhancedLesson } from "./enhancedLessons";
import { getProfessionalApproval } from "./contentApproval";

const LESSON_CONTEXT_MEDIA: Record<string, { src: string; alt: string; caption: string }> = {
  "electrical-fundamentals": { src: "/lesson-context-measurement-v1.png", alt: "Illustrative de-energized training bench with a digital multimeter, two-pole tester, clamp meter, guarded probes, and enclosed distribution board", caption: "Measurement instruments and an enclosed training board in a de-energized laboratory context." },
  "domestic-wiring": { src: "/lesson-context-measurement-v1.png", alt: "Illustrative de-energized training bench with test instruments and an enclosed small distribution board", caption: "A protected training-board context for studying domestic circuits, devices, and verification." },
  "protection-fault-analysis": { src: "/lesson-context-measurement-v1.png", alt: "Illustrative de-energized protection and testing bench with meters, guarded probes, and enclosed devices", caption: "Protection and measurement equipment shown only as a de-energized training context." },
  "cable-sizing": { src: "/lesson-context-industrial-v1.png", alt: "Illustrative de-energized control panel with protected devices, terminal blocks, wireways, and a disconnected motor", caption: "A controlled panel environment showing why cable selection depends on equipment, routing, and termination context." },
  "three-phase-systems": { src: "/lesson-context-industrial-v1.png", alt: "Illustrative de-energized industrial control panel beside a disconnected three-phase motor", caption: "Three-phase motor and control equipment in an isolated vocational training environment." },
  "industrial-control": { src: "/lesson-context-industrial-v1.png", alt: "Illustrative de-energized industrial panel containing contactors, overloads, terminal blocks, wireways, and a compact PLC", caption: "Industrial-control components arranged in a protected, de-energized training panel." },
  "inspection-testing": { src: "/lesson-context-measurement-v1.png", alt: "Illustrative de-energized inspection bench with several electrical test instruments and guarded leads", caption: "Typical instrument categories presented as context; selection and use still require exact ratings, procedures, and competence." },
  "solar-pv": { src: "/lesson-context-solar-v1.png", alt: "Illustrative isolated solar training rig with two PV modules, enclosed inverter, isolator, distribution enclosure, and protected battery unit", caption: "A small isolated PV training rig showing the major system areas without serving as a wiring diagram." },
  "led-lighting": { src: "/lesson-context-lighting-v1.png", alt: "Illustrative de-energized lighting laboratory bench with LED modules, enclosed driver, emergency luminaire, optics, heat sinks, and a light meter", caption: "Lighting components arranged for visual comparison in a de-energized laboratory context." },
};

function LessonContextImage({ courseSlug }: { courseSlug: string }) {
  const media = LESSON_CONTEXT_MEDIA[courseSlug];
  if (!media) return null;
  return <figure className="lesson-context-media">
    <div className="lesson-context-frame"><Image src={media.src} alt={media.alt} width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 1.5rem), 68ch" quality={75} /></div>
    <figcaption><span>Context image</span>{media.caption} AI-created editorial illustration; not installation or test guidance.</figcaption>
  </figure>;
}

function DomesticLightingDiagram({ lessonId }: { lessonId: string }) {
  const titleId = `diagram-domestic-wiring-${lessonId}`;
  if (lessonId === "l11") return (
    <svg className="enhanced-diagram" viewBox="0 0 640 230" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Loop-in ceiling point with permanent line, switched line, neutral, and CPC paths</title>
      <text x="22" y="26" className="diagram-kicker">LOOP-IN CEILING POINT</text>
      <rect x="35" y="58" width="105" height="120" rx="8" className="diagram-source"/><text x="87" y="96" className="diagram-value">SUPPLY</text><text x="87" y="120" className="diagram-note">L · N · CPC</text>
      <rect x="245" y="58" width="145" height="120" rx="8" className="diagram-load"/><text x="317" y="92" className="diagram-value">CEILING POINT</text><text x="317" y="116" className="diagram-note">line loop · neutral loop</text><text x="317" y="140" className="diagram-note">lamp · CPC terminal</text>
      <rect x="500" y="84" width="105" height="70" rx="8" className="diagram-source"/><text x="552" y="115" className="diagram-value">SWITCH</text><text x="552" y="137" className="diagram-note">COM · L1</text>
      <path d="M140 78 H245 M140 112 H245 M140 150 H245 M390 78 H480 V98 H500 M500 140 H455 V158 H390" fill="none" className="diagram-wire"/>
      <text x="190" y="70" className="diagram-note">permanent line</text><text x="190" y="105" className="diagram-note">neutral</text><text x="190" y="170" className="diagram-note">CPC</text><text x="450" y="180" className="diagram-note">switched line return</text>
    </svg>
  );
  if (lessonId === "l12") return (
    <svg className="enhanced-diagram" viewBox="0 0 640 220" role="img" aria-labelledby={titleId}>
      <title id={titleId}>One-way lighting circuit with the switch in the line conductor</title><text x="22" y="26" className="diagram-kicker">ONE-WAY LIGHTING CIRCUIT</text>
      <text x="40" y="72" className="diagram-note">permanent line</text><line x1="40" y1="88" x2="220" y2="88" className="diagram-wire"/>
      <circle cx="238" cy="88" r="5" className="diagram-charge"/><circle cx="318" cy="88" r="5" className="diagram-charge"/><line x1="238" y1="88" x2="305" y2="58" className="diagram-thick"/><text x="278" y="48" className="diagram-note">one-pole switch</text>
      <line x1="318" y1="88" x2="490" y2="88" className="diagram-wire"/><circle cx="525" cy="88" r="34" className="diagram-load"/><path d="M505 68 L545 108 M545 68 L505 108" className="diagram-thin"/><text x="525" y="138" className="diagram-note">lamp</text>
      <line x1="525" y1="122" x2="525" y2="176" className="diagram-wire"/><line x1="525" y1="176" x2="40" y2="176" className="diagram-wire"/><text x="220" y="168" className="diagram-note">neutral return</text><text x="395" y="78" className="diagram-note">switched line</text>
    </svg>
  );
  if (lessonId === "l13") return (
    <svg className="enhanced-diagram" viewBox="0 0 640 250" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Two-way lighting circuit with two changeover switches and two strappers</title><text x="22" y="26" className="diagram-kicker">TWO-WAY CHANGEOVER CIRCUIT</text>
      <text x="30" y="126" className="diagram-note">permanent line</text><line x1="30" y1="140" x2="130" y2="140" className="diagram-wire"/>
      <circle cx="140" cy="140" r="6" className="diagram-charge"/><text x="140" y="164" className="diagram-note">COM</text><circle cx="210" cy="82" r="6" className="diagram-charge"/><circle cx="210" cy="198" r="6" className="diagram-charge"/><text x="210" y="67" className="diagram-note">L1</text><text x="210" y="220" className="diagram-note">L2</text><line x1="140" y1="140" x2="205" y2="84" className="diagram-thick"/>
      <line x1="210" y1="82" x2="430" y2="82" className="diagram-wire"/><line x1="210" y1="198" x2="430" y2="198" className="diagram-wire"/><text x="320" y="70" className="diagram-note">strapper 1</text><text x="320" y="220" className="diagram-note">strapper 2</text>
      <circle cx="430" cy="82" r="6" className="diagram-charge"/><circle cx="430" cy="198" r="6" className="diagram-charge"/><text x="430" y="67" className="diagram-note">L1</text><text x="430" y="220" className="diagram-note">L2</text><circle cx="500" cy="140" r="6" className="diagram-charge"/><text x="500" y="164" className="diagram-note">COM</text><line x1="435" y1="84" x2="500" y2="140" className="diagram-thick"/>
      <line x1="506" y1="140" x2="575" y2="140" className="diagram-wire"/><circle cx="595" cy="140" r="19" className="diagram-load"/><path d="M582 127 L608 153 M608 127 L582 153" className="diagram-thin"/><text x="565" y="185" className="diagram-note">switched line to lamp</text>
    </svg>
  );
  if (lessonId === "l14") return (
    <svg className="enhanced-diagram" viewBox="0 0 640 250" role="img" aria-labelledby={titleId}>
      <title id={titleId}>Intermediate lighting circuit with crossed strapper paths between two-way end switches</title><text x="22" y="26" className="diagram-kicker">INTERMEDIATE CROSSOVER CIRCUIT</text>
      <rect x="30" y="72" width="130" height="130" rx="8" className="diagram-source"/><text x="95" y="110" className="diagram-value">2-WAY END</text><text x="95" y="138" className="diagram-note">COM · L1 · L2</text>
      <rect x="255" y="72" width="130" height="130" rx="8" className="diagram-load"/><text x="320" y="110" className="diagram-value">INTERMEDIATE</text><text x="320" y="138" className="diagram-note">straight / crossed</text><path d="M275 160 L365 190 M275 190 L365 160" className="diagram-thick"/>
      <rect x="480" y="72" width="130" height="130" rx="8" className="diagram-source"/><text x="545" y="110" className="diagram-value">2-WAY END</text><text x="545" y="138" className="diagram-note">L1 · L2 · COM</text>
      <line x1="160" y1="100" x2="255" y2="100" className="diagram-wire"/><line x1="160" y1="180" x2="255" y2="180" className="diagram-wire"/><line x1="385" y1="100" x2="480" y2="100" className="diagram-wire"/><line x1="385" y1="180" x2="480" y2="180" className="diagram-wire"/><text x="207" y="91" className="diagram-note">strapper pair</text><text x="432" y="91" className="diagram-note">strapper pair</text>
    </svg>
  );
  if (lessonId === "l15") return (
    <svg className="enhanced-diagram" viewBox="0 0 640 210" role="img" aria-labelledby={titleId}>
      <title id={titleId}>LED dimmer compatibility verification path</title><text x="22" y="26" className="diagram-kicker">LED DIMMER COMPATIBILITY</text>
      {[[35,"DIMMER","declared LED range"],[235,"DRIVER","control method · inrush"],[435,"LED LOAD","quantity · watts · thermal"]].map(([x,label,note]) => <g key={String(label)}><rect x={Number(x)} y="66" width="170" height="82" rx="8" className="diagram-source"/><text x={Number(x)+85} y="99" className="diagram-value">{label}</text><text x={Number(x)+85} y="124" className="diagram-note">{note}</text></g>)}
      <line x1="205" y1="107" x2="235" y2="107" className="diagram-wire"/><line x1="405" y1="107" x2="435" y2="107" className="diagram-wire"/><text x="320" y="178" className="diagram-note">use the exact manufacturers' compatibility data and installation limits</text>
    </svg>
  );
  return null;
}

function QuantityDiagram({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) {
  if (courseSlug === "domestic-wiring") {
    const lessonNumber = Number(lessonId.slice(1));
    if (lessonNumber >= 11 && lessonNumber <= 15) return <DomesticLightingDiagram lessonId={lessonId} />;
    const label = lessonNumber <= 4
      ? "CONSUMER UNIT PROTECTION PATHS"
      : lessonNumber <= 10
        ? "RING, SPUR, AND RADIAL TOPOLOGY"
        : lessonNumber <= 16
          ? "LIGHTING CONTROL PATHS"
          : lessonNumber <= 21
            ? "EARTHING AND BONDING PATHS"
            : lessonNumber <= 25
              ? "SPECIAL-LOCATION RISK LAYERS"
              : lessonNumber <= 30
                ? "CABLE ROUTE AND CONTAINMENT"
                : lessonNumber <= 35
                  ? "FAULT-FINDING DECISION PATH"
                  : "REGULATION AND RECORD PATH";
    const originLabel = lessonNumber <= 4 ? "CU" : lessonNumber <= 10 ? "ORIGIN" : lessonNumber <= 16 ? "SWITCH" : lessonNumber <= 21 ? "MET" : lessonNumber <= 25 ? "ZONE" : lessonNumber <= 30 ? "ROUTE" : lessonNumber <= 35 ? "TEST" : "RECORD";
    return (
      <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}>
        <title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title>
        <text x="22" y="26" className="diagram-kicker">{label}</text>
        <rect x="60" y="58" width="150" height="90" rx="8" className="diagram-source" />
        <text x="135" y="90" className="diagram-value">{originLabel}</text>
        <text x="135" y="116" className="diagram-note">isolate · protect · identify</text>
        <line x1="210" y1="78" x2="570" y2="78" className="diagram-wire" /><line x1="210" y1="130" x2="570" y2="130" className="diagram-wire" />
        <rect x="315" y="66" width="70" height="24" className="diagram-load" /><rect x="470" y="118" width="70" height="24" className="diagram-load" />
        <text x="350" y="58" className="diagram-note">device / point</text><text x="505" y="164" className="diagram-note">trace every conductor path</text>
      </svg>
    );
}
  if (courseSlug === "protection-fault-analysis") {
    const lessonNumber = Number(lessonId.slice(1));
    const label = lessonNumber <= 5 ? "PROTECTIVE DEVICE OPERATING PATHS" : lessonNumber <= 10 ? "EARTH-FAULT LOOP AND ADS" : lessonNumber <= 15 ? "RESIDUAL-CURRENT SENSING" : lessonNumber <= 20 ? "PROSPECTIVE FAULT CURRENT" : lessonNumber <= 25 ? "SELECTIVITY AND COORDINATION" : "PROTECTION TEST EVIDENCE";
    const relationship = lessonNumber <= 5 ? "current / time / energy" : lessonNumber <= 10 ? "Zs to fault current to operating time" : lessonNumber <= 15 ? "current balance to residual trip" : lessonNumber <= 20 ? "source Z to PFC to device capability" : lessonNumber <= 25 ? "curves / time / I-squared-t / paired data" : "method to reading to evidence to decision";
    return (
      <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}>
        <title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title>
        <text x="22" y="26" className="diagram-kicker">{label}</text>
        <rect x="55" y="62" width="130" height="78" rx="8" className="diagram-source" />
        <text x="120" y="106" className="diagram-value">SOURCE</text>
        <line x1="185" y1="101" x2="290" y2="101" className="diagram-wire" />
        <rect x="290" y="78" width="90" height="46" className="diagram-load" />
        <text x="335" y="106" className="diagram-value">TRIP</text>
        <line x1="380" y1="101" x2="565" y2="101" className="diagram-wire" />
        <text x="475" y="78" className="diagram-note">fault / load</text>
        <text x="320" y="164" className="diagram-note">{relationship}</text>
      </svg>
    );
  }
  if (courseSlug === "led-lighting") {
    const n=Number(lessonId.slice(1)); const label=n<=5?"LED JUNCTION LIGHT AND HEAT PATH":n<=10?"DRIVER OUTPUT AND CONTROL WINDOW":n<=15?"EMERGENCY LIGHTING FAILURE PATH":n<=19?"MAINTAINED ILLUMINANCE DESIGN":n<=23?"COLOUR GLARE AND SMART CONTROL":"COMPLETE LIGHTING DESIGN EVIDENCE";
    return <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}><title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text><rect x="50" y="62" width="125" height="74" rx="8" className="diagram-source"/><text x="112" y="104" className="diagram-value">DRIVER</text><line x1="175" y1="99" x2="305" y2="99" className="diagram-wire"/><rect x="305" y="62" width="125" height="74" className="diagram-load"/><text x="367" y="104" className="diagram-value">LED</text><line x1="430" y1="99" x2="570" y2="99" className="diagram-wire"/><text x="500" y="80" className="diagram-note">light · heat</text><text x="175" y="165" className="diagram-note">input · regulation · junction · optics · control · environment</text></svg>;
  }  if (courseSlug === "inspection-testing") {
    const n=Number(lessonId.slice(1)); const label=n<=5?"SAFE TEST SEQUENCE AND EVIDENCE":n<=10?"CONTINUITY TOPOLOGY AND PATTERN":n<=15?"INSULATION TEST BOUNDARY AND LEAKAGE":n<=20?"EARTH-FAULT LOOP AND DISCONNECTION":n<=25?"RCD FIELD VERIFICATION":n<=29?"POLARITY AND PROSPECTIVE FAULT CURRENT":n<=34?"CERTIFICATION AND CONDITION CODING":"FULL VERIFICATION EVIDENCE";
    return <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}><title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text><rect x="45" y="60" width="125" height="76" rx="8" className="diagram-source"/><text x="107" y="103" className="diagram-value">ORIGIN</text><line x1="170" y1="98" x2="300" y2="98" className="diagram-wire"/><rect x="300" y="60" width="125" height="76" className="diagram-load"/><text x="362" y="103" className="diagram-value">CIRCUIT</text><line x1="425" y1="98" x2="570" y2="98" className="diagram-wire"/><text x="490" y="80" className="diagram-note">test point</text><text x="180" y="165" className="diagram-note">inspect · isolate · prove · measure · interpret · restore · record</text></svg>;
  }  if (courseSlug === "industrial-control") {
    const n = Number(lessonId.slice(1));
    const label = n <= 5 ? "MOTOR STARTER POWER AND CONTROL" : n <= 10 ? "CONTACTOR AND OVERLOAD COORDINATION" : n <= 15 ? "CONTROL DIAGRAM STATE AND INTERLOCKS" : n <= 20 ? "MACHINE SAFETY FUNCTION PATH" : n <= 25 ? "PLC SCAN AND LADDER STATE" : "PANEL DESIGN AND COMMISSIONING";
    return <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}><title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text><rect x="45" y="62" width="120" height="74" rx="8" className="diagram-source"/><text x="105" y="104" className="diagram-value">SUPPLY</text><line x1="165" y1="99" x2="285" y2="99" className="diagram-wire"/><rect x="285" y="62" width="125" height="74" className="diagram-load"/><text x="347" y="104" className="diagram-value">STARTER</text><line x1="410" y1="99" x2="555" y2="99" className="diagram-wire"/><text x="500" y="82" className="diagram-note">motor · load</text><text x="190" y="165" className="diagram-note">short circuit · overload · command · interlock · isolation</text></svg>;
  }  if (courseSlug === "solar-pv") {
    const n = Number(lessonId.slice(1));
    const label = n <= 5 ? "PV I-V CURVE AND OPERATING POINTS" : n <= 10 ? "ARRAY STRING AND YIELD DESIGN" : n <= 15 ? "INVERTER PORTS AND MPPT PATHS" : n <= 20 ? "BATTERY ENERGY AND SAFETY PATHS" : n <= 25 ? "GRID CONNECTION AND EXPORT CONTROL" : "PV INSTALLATION AND COMMISSIONING";
    return <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}><title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text><rect x="55" y="58" width="130" height="84" rx="8" className="diagram-source"/><text x="120" y="104" className="diagram-value">MODULE</text><line x1="185" y1="100" x2="305" y2="100" className="diagram-wire"/><rect x="305" y="70" width="115" height="60" className="diagram-load"/><text x="362" y="104" className="diagram-value">MPPT</text><line x1="420" y1="100" x2="570" y2="100" className="diagram-wire"/><text x="495" y="78" className="diagram-note">cold Voc · hot Vmp</text><text x="320" y="164" className="diagram-note">irradiance · temperature · shading · exact product limits</text></svg>;
  }
  if (courseSlug === "cable-sizing") {
    const lessonNumber = Number(lessonId.slice(1));
    const label = lessonNumber <= 5 ? "CURRENT-CARRYING CAPACITY WORKFLOW" : lessonNumber <= 10 ? "CORRECTION-FACTOR THERMAL MODEL" : lessonNumber <= 15 ? "WHOLE-PATH VOLTAGE-DROP BUDGET" : lessonNumber <= 20 ? "SWA CONSTRUCTION AND FAULT PATH" : lessonNumber <= 24 ? "FIRE-SURVIVING CABLE SYSTEM" : "END-TO-END CABLE DESIGN GATES";
    return (
      <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}>
        <title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text>
        <rect x="48" y="67" width="105" height="66" rx="8" className="diagram-source" /><text x="100" y="94" className="diagram-value">Ib</text><text x="100" y="116" className="diagram-note">load</text>
        <line x1="153" y1="100" x2="238" y2="100" className="diagram-wire" /><rect x="238" y="67" width="105" height="66" rx="8" className="diagram-load" /><text x="290" y="94" className="diagram-value">In</text><text x="290" y="116" className="diagram-note">device</text>
        <line x1="343" y1="100" x2="428" y2="100" className="diagram-wire" /><rect x="428" y="67" width="150" height="66" rx="8" className="diagram-source" /><text x="503" y="94" className="diagram-value">Iz</text><text x="503" y="116" className="diagram-note">It × applicable factors</text>
        <text x="320" y="162" className="diagram-note">physical method · exact table · declared conditions · all design gates</text>
      </svg>
    );
  }
  if (courseSlug === "three-phase-systems") {
    const lessonNumber = Number(lessonId.slice(1));
    const label = lessonNumber <= 5 ? "THREE-PHASE PHASOR SET" : lessonNumber <= 9 ? "STAR VOLTAGE AND CURRENT PATHS" : lessonNumber <= 13 ? "DELTA VOLTAGE AND CURRENT PATHS" : lessonNumber <= 18 ? "THREE-PHASE POWER TRIANGLE" : lessonNumber <= 23 ? "MOTOR FIELD AND CONTROL PATH" : "TRANSFORMER FLUX AND VECTOR GROUP";
    return (
      <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${courseSlug}-${lessonId}`}>
        <title id={`diagram-${courseSlug}-${lessonId}`}>{label}</title><text x="22" y="26" className="diagram-kicker">{label}</text>
        {lessonNumber <= 9 ? <>
          <circle cx="250" cy="105" r="10" className="diagram-charge" /><line x1="250" y1="105" x2="250" y2="48" className="diagram-thick" /><line x1="250" y1="105" x2="201" y2="134" className="diagram-thick" /><line x1="250" y1="105" x2="299" y2="134" className="diagram-thick" />
          <text x="250" y="42" className="diagram-note">L1 · 0°</text><text x="175" y="151" className="diagram-note">L2 · −120°</text><text x="325" y="151" className="diagram-note">L3 · +120°</text><text x="465" y="86" className="diagram-value">{lessonNumber <= 5 ? "ΣV = 0" : "VL = √3 Vph"}</text><text x="465" y="116" className="diagram-note">{lessonNumber <= 5 ? "equal magnitude · 120° apart" : "IL = Iph · IN = phasor sum"}</text>
        </> : lessonNumber <= 13 ? <>
          <path d="M250 48 L180 145 L320 145 Z" fill="none" className="diagram-thick" /><text x="250" y="42" className="diagram-note">L1</text><text x="158" y="160" className="diagram-note">L2</text><text x="335" y="160" className="diagram-note">L3</text><text x="465" y="86" className="diagram-value">Vph = VL</text><text x="465" y="116" className="diagram-note">IL = √3 Iph · 30° shift</text>
        </> : lessonNumber <= 18 ? <>
          <path d="M185 145 L185 50 L345 145 Z" fill="none" className="diagram-thick" /><text x="170" y="45" className="diagram-note">Q</text><text x="270" y="164" className="diagram-note">P</text><text x="285" y="92" className="diagram-note">S</text><text x="465" y="86" className="diagram-value">S² = P² + Q²</text><text x="465" y="116" className="diagram-note">P = √3 VL IL PF</text>
        </> : lessonNumber <= 23 ? <>
          <circle cx="240" cy="104" r="54" className="diagram-source" /><circle cx="240" cy="104" r="28" className="diagram-load" /><path d="M240 42 A62 62 0 0 1 300 104" fill="none" className="diagram-thick" /><text x="240" y="109" className="diagram-value">ROTOR</text><text x="465" y="86" className="diagram-value">ns = 120f/P</text><text x="465" y="116" className="diagram-note">isolate · interlock · protect</text>
        </> : <>
          <rect x="145" y="58" width="72" height="94" rx="5" className="diagram-source" /><rect x="295" y="58" width="72" height="94" rx="5" className="diagram-load" /><path d="M217 75 C250 50 262 50 295 75 M217 105 C250 80 262 80 295 105 M217 135 C250 110 262 110 295 135" fill="none" className="diagram-thick" /><text x="181" y="108" className="diagram-note">HV</text><text x="331" y="108" className="diagram-note">LV</text><text x="475" y="86" className="diagram-value">V1/V2 = N1/N2</text><text x="475" y="116" className="diagram-note">ratio · impedance · vector group</text>
        </>}
      </svg>
    );
  }
  const labels: Record<string, string> = {
    l1: "ATOMIC CHARGE MODEL", l2: "CHARGE: COULOMBS AND CARRIERS", l3: "MATERIAL RESPONSE", l4: "CURRENT DIRECTION CONVENTIONS",
    l6: "VOLTAGE: ENERGY PER CHARGE", l7: "CURRENT: CHARGE PER SECOND", l8: "RESISTANCE: MATERIAL + GEOMETRY", l9: "OHM'S LAW: ONE RELATIONSHIP, THREE FORMS",
    l11: "SERIES: ONE CURRENT PATH", l12: "PARALLEL: COMMON VOLTAGE", l13: "SERIES-PARALLEL REDUCTION", l14: "DIVIDER RELATIONSHIPS",
    l16: "KCL: CURRENT BALANCE", l17: "KVL: LOOP BALANCE", l18: "MESH AND NODAL VARIABLES", l20: "POWER: ENERGY RATE", l21: "ENERGY OVER TIME", l22: "CABLE LOSS AND EFFICIENCY",
    l24: "AC AND DC SYSTEMS", l25: "SINE-WAVE MEASURES", l26: "FREQUENCY AND PERIOD", l27: "PHASE RELATIONSHIPS", l28: "AC IMPEDANCE",
    l29: "CAPACITOR ENERGY", l30: "CAPACITIVE REACTANCE", l31: "INDUCTOR ENERGY", l32: "INDUCTIVE REACTANCE", l33: "FIRST-ORDER TRANSIENTS",
    l34: "MULTIMETER CONNECTIONS", l35: "CLAMP-METER FIELDS", l36: "OSCILLOSCOPE SCALES",
  };
  const label = labels[lessonId] ?? "ELECTRICAL RELATIONSHIP";
  return (
    <svg className="enhanced-diagram" viewBox="0 0 640 190" role="img" aria-labelledby={`diagram-${lessonId}`}>
      <title id={`diagram-${lessonId}`}>{label}</title>
      <text x="22" y="26" className="diagram-kicker">{label}</text>
      {["l1","l2","l3","l4"].includes(lessonId) && <>
        <circle cx="180" cy="100" r="54" className="diagram-source" /><circle cx="180" cy="100" r="12" className="diagram-charge" />
        <circle cx="180" cy="100" r="36" fill="none" className="diagram-wire" /><circle cx="216" cy="100" r="7" className="diagram-charge" />
        <text x="180" y="105" className="diagram-value">+</text><text x="400" y="82" className="diagram-value">{lessonId === "l3" ? "carrier availability" : lessonId === "l4" ? "I →   ← e⁻" : "Q = n·e"}</text>
        <text x="400" y="112" className="diagram-note">{lessonId === "l3" ? "material and conditions matter" : "sign and direction are explicit"}</text>
      </>}
      {["l11","l12","l13","l14"].includes(lessonId) && <>
        <line x1="60" y1="70" x2="580" y2="70" className="diagram-wire" /><line x1="60" y1="140" x2="580" y2="140" className="diagram-wire" />
        <rect x="205" y="58" width="70" height="24" className="diagram-load" /><rect x="365" y="58" width="70" height="24" className="diagram-load" />
        <text x="240" y="52" className="diagram-note">R₁</text><text x="400" y="52" className="diagram-note">R₂</text>
        <text x="320" y="120" className="diagram-value">{lessonId === "l11" ? "Req = ΣR" : lessonId === "l12" ? "1/Req = Σ1/R" : lessonId === "l13" ? "reduce → check → expand" : "Vout = Vin·R₂/(R₁+R₂)"}</text>
      </>}
      {["l16","l17","l18"].includes(lessonId) && <>
        <circle cx="320" cy="103" r="9" className="diagram-charge" />
        <line x1="75" y1="103" x2="311" y2="103" className="diagram-wire" /><line x1="329" y1="103" x2="565" y2="55" className="diagram-wire" /><line x1="329" y1="103" x2="565" y2="151" className="diagram-wire" />
        <text x="190" y="88" className="diagram-note">incoming</text><text x="470" y="48" className="diagram-note">branch 1</text><text x="470" y="168" className="diagram-note">branch 2</text>
        <text x="320" y="58" className="diagram-value">{lessonId === "l16" ? "ΣI = 0" : lessonId === "l17" ? "ΣV = 0" : "choose node V or mesh I"}</text>
      </>}
      {["l20","l21","l22"].includes(lessonId) && <>
        <rect x="90" y="65" width="150" height="76" rx="6" className="diagram-source" /><rect x="400" y="65" width="150" height="76" rx="6" className="diagram-load" />
        <line x1="240" y1="103" x2="400" y2="103" className="diagram-wire" />
        <text x="165" y="108" className="diagram-value">input</text><text x="475" y="108" className="diagram-value">output</text>
        <text x="320" y="82" className="diagram-note">{lessonId === "l20" ? "P = VI" : lessonId === "l21" ? "E = Pt" : "Ploss = I²R"}</text>
        <text x="320" y="133" className="diagram-note">{lessonId === "l22" ? "η = Pout / Pin" : "units carry meaning"}</text>
      </>}      {["l24","l25","l26","l27","l28"].includes(lessonId) && <>
        <line x1="50" y1="104" x2="590" y2="104" className="diagram-wire" />
        <path d="M50 104 C95 32 140 32 185 104 S275 176 320 104 S410 32 455 104 S545 176 590 104" fill="none" className="diagram-thick" />
        <text x="320" y="58" className="diagram-value">{lessonId === "l25" ? "Vrms = Vpk/√2" : lessonId === "l26" ? "T = 1/f" : lessonId === "l27" ? "φ = 360°·Δt/T" : lessonId === "l28" ? "Z = R + jX" : "AC ↔ DC conversion"}</text>
      </>}
      {["l29","l30","l31","l32","l33"].includes(lessonId) && <>
        <line x1="70" y1="103" x2="250" y2="103" className="diagram-wire" /><line x1="390" y1="103" x2="570" y2="103" className="diagram-wire" />
        <line x1="280" y1="62" x2="280" y2="144" className="diagram-thick" /><line x1="360" y1="62" x2="360" y2="144" className="diagram-thick" />
        <text x="320" y="48" className="diagram-value">{lessonId === "l29" ? "E = ½CV²" : lessonId === "l30" ? "XC = 1/(2πfC)" : lessonId === "l31" ? "E = ½LI²" : lessonId === "l32" ? "XL = 2πfL" : "τ = RC or L/R"}</text>
        <text x="320" y="172" className="diagram-note">stored energy and time-dependent response</text>
      </>}
      {["l34","l35","l36"].includes(lessonId) && <>
        <rect x="90" y="55" width="180" height="100" rx="8" className="diagram-source" /><circle cx="180" cy="105" r="30" className="diagram-load" />
        <line x1="270" y1="85" x2="550" y2="85" className="diagram-wire" /><line x1="270" y1="125" x2="550" y2="125" className="diagram-wire" />
        <text x="180" y="110" className="diagram-value">{lessonId === "l34" ? "DMM" : lessonId === "l35" ? "CLAMP" : "SCOPE"}</text>
        <text x="410" y="62" className="diagram-note">{lessonId === "l36" ? "V/div · s/div · probe ×" : "rating · connection · range"}</text>
      </>}      {lessonId === "l6" && <>
        <circle cx="95" cy="96" r="43" className="diagram-source" />
        <text x="95" y="91" className="diagram-value">12 V</text><text x="95" y="111" className="diagram-note">source rise</text>
        <line x1="138" y1="96" x2="486" y2="96" className="diagram-wire" />
        <rect x="486" y="62" width="104" height="68" rx="5" className="diagram-load" />
        <text x="538" y="91" className="diagram-value">lamp</text><text x="538" y="111" className="diagram-note">12 V drop</text>
        <text x="310" y="78" className="diagram-note">energy carried to load</text>
      </>}
      {lessonId === "l7" && <>
        <line x1="60" y1="96" x2="580" y2="96" className="diagram-wire" />
        {[120, 200, 280, 360, 440].map((x) => <g key={x}><circle cx={x} cy="96" r="7" className="diagram-charge" /><path d={`M${x + 12} 88 l16 8 -16 8z`} className="diagram-arrow" /></g>)}
        <text x="320" y="55" className="diagram-value">I = Q ÷ t</text><text x="320" y="145" className="diagram-note">3 C each second = 3 A</text>
      </>}
      {lessonId === "l8" && <>
        <line x1="60" y1="70" x2="300" y2="70" className="diagram-thin" /><text x="180" y="52" className="diagram-note">longer → more R</text>
        <line x1="360" y1="70" x2="580" y2="70" className="diagram-thick" /><text x="470" y="52" className="diagram-note">larger area → less R</text>
        <text x="320" y="140" className="diagram-value">R = ρL ÷ A</text>
      </>}
      {lessonId === "l9" && <>
        <circle cx="320" cy="98" r="68" className="diagram-source" />
        <text x="320" y="74" className="diagram-value">V</text>
        <line x1="270" y1="94" x2="370" y2="94" className="diagram-wire" />
        <text x="286" y="126" className="diagram-value">I</text><text x="354" y="126" className="diagram-value">R</text>
        <text x="90" y="101" className="diagram-note">V = I × R</text><text x="475" y="101" className="diagram-note">I = V ÷ R</text>
      </>}
    </svg>
  );
}

export function EnhancedLessonView({ lesson, courseSlug, lessonId }: { lesson: EnhancedLesson; courseSlug: string; lessonId: string }) {
  const professionalApproval = getProfessionalApproval(`${courseSlug}:${lessonId}`);
  const sections = useMemo(() => [
    { id: `purpose-${lessonId}`, label: "Purpose" },
    { id: `theory-${lessonId}`, label: "Core theory" },
    { id: `example-${lessonId}`, label: "Worked example" },
    { id: `check-${lessonId}`, label: "Knowledge check" },
    { id: `sources-${lessonId}`, label: "Sources" },
  ], [lessonId]);
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const root = document.getElementById(`lesson-reader-${lessonId}`);
    if (!root) return;
    const updateProgress = () => {
      const rect = root.getBoundingClientRect();
      const available = Math.max(1, root.offsetHeight - window.innerHeight);
      setReadingProgress(Math.min(100, Math.max(0, ((-rect.top + 96) / available) * 100)));
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-18% 0px -68% 0px" });
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [lessonId, sections]);

  const contents = (className: string) => (
    <nav className={className} aria-label="Lesson contents">
      <p>In this lesson</p>
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}>{section.label}</a>
      ))}
    </nav>
  );

  return (
    <div className="enhanced-lesson" id={`lesson-reader-${lessonId}`}>
      <div className="lesson-reading-progress" aria-hidden="true"><span style={{ width: `${readingProgress}%` }} /></div>
      <div className="lesson-mobile-tools">
        <details className="lesson-mobile-contents"><summary>Lesson contents <span>{Math.round(readingProgress)}%</span></summary>{contents("lesson-toc-mobile")}</details>
        <button type="button" onClick={() => window.print()}>Print lesson</button>
      </div>
      <div className="lesson-reader-layout">
        <aside className="lesson-reader-rail">{contents("lesson-toc")}<button type="button" onClick={() => window.print()}>Print lesson</button><span>{Math.round(readingProgress)}% read</span></aside>
        <article className="lesson-reading-column">

      <section id={`purpose-${lessonId}`}>
        <div className="lesson-meta-line"><span>{lesson.difficulty}</span><span>Review: {professionalApproval ? "professionally reviewed" : "professional review pending"}</span></div>
        <h3>Purpose</h3><p>{lesson.purpose}</p>
        <div className="lesson-callout remember"><strong>Before you begin</strong><span>{lesson.prerequisites.join(" · ")}</span></div>
        <h3>Learning objectives</h3><ul>{lesson.objectives.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="lesson-introduction">{lesson.introduction}</p>
      </section>

      <LessonContextImage courseSlug={courseSlug} />
      <QuantityDiagram courseSlug={courseSlug} lessonId={lessonId} />

      <section id={`theory-${lessonId}`}>
        <h3>Core theory</h3>{lesson.theory.map(item => <p key={item}>{item}</p>)}
        <div className="terms-table-wrap"><table className="terms-table"><caption>Terms, symbols, and units</caption><thead><tr><th>Term</th><th>Meaning</th><th>Symbol</th><th>Unit</th></tr></thead>
          <tbody>{lesson.terms.map(item => <tr key={item.term}><th scope="row">{item.term}</th><td>{item.meaning}</td><td>{item.symbol ?? "Not applicable"}</td><td>{item.unit ?? "Not applicable"}</td></tr>)}</tbody>
        </table></div>
        {lesson.formula && <div className="lesson-formula"><code>{lesson.formula.expression}</code><p>{lesson.formula.explanation}</p><small>{lesson.formula.units}</small></div>}
      </section>

      <section id={`example-${lessonId}`}>
        <div className="lesson-callout example"><strong>Worked example</strong><span>{lesson.workedExample.problem}</span></div>
        <p><strong>Assumptions:</strong> {lesson.workedExample.assumptions.join("; ")}.</p>
        <ol className="worked-steps">{lesson.workedExample.steps.map(step => <li key={step.label}><strong>{step.label}:</strong> {step.detail}</li>)}</ol>
        <p className="worked-answer">{lesson.workedExample.answer}</p>
        <p><strong>Reasonableness check:</strong> {lesson.workedExample.reasonableness}</p>
      </section>

      <div className="lesson-callout mistake"><strong>Common mistakes</strong><ul>{lesson.commonMistakes.map(item => <li key={item}>{item}</li>)}</ul></div>
      <h3>Where this appears in practice</h3><p>{lesson.application}</p>
      <div className="lesson-callout safety"><strong>Safety</strong><span>{lesson.safety}</span></div>
      <div className="lesson-callout local"><strong>Local code check</strong><span>{lesson.localCode}</span></div>

      <section id={`check-${lessonId}`}>
        <h3>Knowledge check</h3>
        <details className="lesson-check-detail"><summary>{lesson.knowledgeCheck.question}</summary><p><strong>{lesson.knowledgeCheck.answer}.</strong> {lesson.knowledgeCheck.feedback}</p></details>
        <h3>Practical exercise</h3><p>{lesson.practicalExercise}</p>
        <h3>Summary</h3><ul>{lesson.summary.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section id={`sources-${lessonId}`} className="lesson-sources">
        <h3>Sources and review</h3>
        <ul>{lesson.sources.map(source => <li key={source.title}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> : source.title}: {source.publisher}; {source.edition}; {source.jurisdiction}{source.accessedOn ? `; accessed ${source.accessedOn}` : ""}</li>)}</ul>
        {professionalApproval
          ? <p>Professionally reviewed by {professionalApproval.reviewerName}, {professionalApproval.reviewerCredential}, on {professionalApproval.approvedOn}.</p>
          : <p>Editorial review date: {lesson.reviewDate}. Professional electrical review is pending.</p>}
      </section>
        </article>
      </div>
    </div>
  );
}
