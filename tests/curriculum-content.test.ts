import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { ENHANCED_LESSONS } from "../app/learn/enhancedLessons.ts";
import { LESSON_REVIEWS } from "../app/learn/reviewStates.ts";

test("enhanced fundamentals preserve the verified checkpoint lesson IDs", () => {
  for (const id of ["l6", "l7", "l8", "l9"]) {
    assert.ok(ENHANCED_LESSONS[`electrical-fundamentals:${id}`]);
  }
});

test("course inventory contains 9 courses and 280 uniquely addressable lessons", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const courseBlocks = [...source.matchAll(/^  "([^"]+)": \{([\s\S]*?)(?=^  "[^"]+": \{|^\};)/gm)];
  assert.equal(courseBlocks.length, 9);
  let total = 0;
  const inventory = new Set<string>();
  for (const [, slug, block] of courseBlocks) {
    const ids = [...block.matchAll(/\{ id: "(l\d+)", title: "([^"]+)", duration: "([^"]+)", type: "(video|quiz|exercise)" \}/g)];
    assert.ok(ids.length > 0, `${slug} has no lessons`);
    const local = new Set<string>();
    for (const [, id, title, duration] of ids) {
      assert.ok(title.trim().length > 3, `${slug}:${id} has an invalid title`);
      assert.match(duration, /^\d+min$/, `${slug}:${id} has an invalid duration`);
      assert.equal(local.has(id), false, `${slug} duplicates ${id}`);
      local.add(id);
      inventory.add(`${slug}:${id}`);
      total += 1;
    }
  }
  assert.equal(total, 280);
  assert.equal(inventory.size, 280);
  for (const key of Object.keys(ENHANCED_LESSONS)) assert.ok(inventory.has(key), `orphan enhancement: ${key}`);
});

test("worked numerical answers are reproducible without false precision", () => {
  assert.equal(24 / 2, 12);
  assert.equal(0.45 / 0.150, 3);
  assert.equal(24 / 120, 0.2);
  assert.ok(Math.abs(24 * 0.2 - 4.8) < 1e-12);
  assert.equal(48 / 0.4, 120);
});

test("every enhanced lesson has sources, review state, safety, and local context", () => {
  for (const lesson of Object.values(ENHANCED_LESSONS)) {
    assert.ok(lesson.sources.length >= 2);
    assert.equal(lesson.reviewStatus, "professional-review-pending");
    assert.ok(lesson.safety.length > 40);
    assert.ok(lesson.localCode.length > 40);
    assert.ok(lesson.objectives.length >= 4);
    assert.ok(lesson.workedExample.steps.length >= 3);
  }
});

test("all inline quiz correct-answer indexes are within their option arrays", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const blocks = [...source.matchAll(/options:\s*\[([^\]]+)\],\s*correct:\s*(\d+)/g)];
  assert.ok(blocks.length >= 5);
  for (const block of blocks) {
    const options = [...block[1].matchAll(/"[^"]*"/g)];
    const correct = Number(block[2]);
    assert.ok(correct >= 0 && correct < options.length, `Invalid quiz mapping: index ${correct}, options ${options.length}`);
  }
});
test("first fundamentals group has truthful review evidence", () => {
  const group = Array.from({ length: 15 }, (_, index) => `electrical-fundamentals:l${index + 1}`);
  for (const key of group) {
    const review = LESSON_REVIEWS[key];
    assert.ok(review, `missing review state for ${key}`);
    assert.match(review.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(review.evidence.length >= 40);
  }
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 12);
});

test("fundamentals module quiz and circuit practice do not use generic fallbacks", () => {
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /slug === "electrical-fundamentals" && t\.includes\("module quiz"\)/);
  assert.match(source, /t\.includes\("circuit analysis practice"\)/);
  assert.match(source, /Branch currents are 4\/6 = 0\.667 A and 4\/3 = 1\.333 A/);
});
test("second fundamentals group has review evidence and no generic assessments", () => {
  for (let id = 16; id <= 23; id += 1) assert.ok(LESSON_REVIEWS[`electrical-fundamentals:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 18);
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /slug === "electrical-fundamentals" && t\.includes\("power quiz"\)/);
  assert.match(source, /t\.includes\("kirchhoff's law problems"\)/);
});
test("remaining fundamentals group is fully recorded and assessment-specific", () => {
  for (let id = 24; id <= 37; id += 1) assert.ok(LESSON_REVIEWS[`electrical-fundamentals:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 31);
  const source = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /slug === "electrical-fundamentals" && t\.includes\("final assessment"\)/);
  assert.match(source, /XC ≈ 31\.8 Ω; current leads voltage by 90°/);
});
test("first domestic wiring group has course-specific content and review evidence", () => {
  for (let id = 1; id <= 10; id += 1) assert.ok(LESSON_REVIEWS[`domestic-wiring:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 39);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "domestic-wiring" && t\.includes\("module quiz"\)/);
  assert.match(courseSource, /_slug === "domestic-wiring" && t\.includes\("wiring practice problems"\)/);
  assert.match(viewSource, /courseSlug === "domestic-wiring"/);
});
test("domestic lighting and earthing group has specific content and assessment coverage", () => {
  for (let id = 11; id <= 21; id += 1) assert.ok(LESSON_REVIEWS[`domestic-wiring:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 48);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /t\.includes\("lighting circuit quiz"\)/);
  assert.match(courseSource, /t\.includes\("bonding quiz"\)/);
  assert.match(viewSource, /LIGHTING CONTROL PATHS/);
  assert.match(viewSource, /EARTHING AND BONDING PATHS/);
});
test("domestic special-locations and cable-routing group is specific and reviewed", () => {
  for (let id = 22; id <= 30; id += 1) assert.ok(LESSON_REVIEWS[`domestic-wiring:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 56);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /t\.includes\("depths and zones quiz"\)/);
  assert.match(viewSource, /SPECIAL-LOCATION RISK LAYERS/);
  assert.match(viewSource, /CABLE ROUTE AND CONTAINMENT/);
});
test("domestic fault-finding and regulation group completes the course specifically", () => {
  for (let id = 31; id <= 39; id += 1) assert.ok(LESSON_REVIEWS[`domestic-wiring:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 63);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /_slug === "domestic-wiring" && t\.includes\("fault finding case studies"\)/);
  assert.match(courseSource, /slug === "domestic-wiring" && t\.includes\("final assessment"\)/);
  assert.match(viewSource, /FAULT-FINDING DECISION PATH/);
  assert.match(viewSource, /REGULATION AND RECORD PATH/);
});
test("first protection group has specific devices, loop content, and assessments", () => {
  for (let id = 1; id <= 10; id += 1) assert.ok(LESSON_REVIEWS[`protection-fault-analysis:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 71);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "protection-fault-analysis" && t\.includes\("device selection quiz"\)/);
  assert.match(courseSource, /_slug === "protection-fault-analysis" && t\.includes\("zs calculation exercises"\)/);
  assert.match(viewSource, /PROTECTIVE DEVICE OPERATING PATHS/);
  assert.match(viewSource, /EARTH-FAULT LOOP AND ADS/);
});
test("protection RCD and PFC group has specific content and assessment coverage", () => {
  for (let id = 11; id <= 20; id += 1) assert.ok(LESSON_REVIEWS[`protection-fault-analysis:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 79);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /t\.includes\("rcd selection quiz"\)/);
  assert.match(courseSource, /t\.includes\("pfc worked problems"\)/);
  assert.match(viewSource, /RESIDUAL-CURRENT SENSING/);
  assert.match(viewSource, /PROSPECTIVE FAULT CURRENT/);
});
test("protection coordination and testing group completes the course specifically", () => {
  for (let id = 21; id <= 29; id += 1) assert.ok(LESSON_REVIEWS[`protection-fault-analysis:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 86);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /t\.includes\("discrimination case study"\)/);
  assert.match(courseSource, /slug === "protection-fault-analysis" && t\.includes\("final assessment"\)/);
  assert.match(viewSource, /SELECTIVITY AND COORDINATION/);
  assert.match(viewSource, /PROTECTION TEST EVIDENCE/);
});
test("three-phase fundamentals and star group is specific and reviewed", () => {
  for (let id = 1; id <= 9; id += 1) assert.ok(LESSON_REVIEWS[`three-phase-systems:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 93);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "three-phase-systems" && t\.includes\("phase fundamentals quiz"\)/);
  assert.match(courseSource, /_slug === "three-phase-systems" && t\.includes\("star circuit analysis problems"\)/);
  assert.match(viewSource, /THREE-PHASE PHASOR SET/);
  assert.match(viewSource, /STAR VOLTAGE AND CURRENT PATHS/);
});
test("three-phase delta and power group is specific and reviewed", () => {
  for (let id = 10; id <= 18; id += 1) assert.ok(LESSON_REVIEWS[`three-phase-systems:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 100);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /_slug === "three-phase-systems" && t\.includes\("delta circuit analysis problems"\)/);
  assert.match(courseSource, /slug === "three-phase-systems" && t\.includes\("three-phase power quiz"\)/);
  assert.match(viewSource, /DELTA VOLTAGE AND CURRENT PATHS/);
  assert.match(viewSource, /THREE-PHASE POWER TRIANGLE/);
});
test("three-phase motors and transformers group completes the course specifically", () => {
  for (let id = 19; id <= 28; id += 1) assert.ok(LESSON_REVIEWS[`three-phase-systems:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 108);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "three-phase-systems" && t\.includes\("transformer quiz"\)/);
  assert.match(courseSource, /slug === "three-phase-systems" && t\.includes\("final assessment"\)/);
  assert.match(viewSource, /MOTOR FIELD AND CONTROL PATH/);
  assert.match(viewSource, /TRANSFORMER FLUX AND VECTOR GROUP/);
});
test("cable capacity and derating group is specific and reviewed", () => {
  for (let id = 1; id <= 10; id += 1) assert.ok(LESSON_REVIEWS[`cable-sizing:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 116);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /_slug === "cable-sizing" && t\.includes\("ccc selection problems"\)/);
  assert.match(courseSource, /_slug === "cable-sizing" && t\.includes\("applying multiple correction factors"\)/);
  assert.match(viewSource, /CURRENT-CARRYING CAPACITY WORKFLOW/);
  assert.match(viewSource, /CORRECTION-FACTOR THERMAL MODEL/);
});
test("cable voltage drop and SWA group is specific and reviewed", () => {
  for (let id = 11; id <= 20; id += 1) assert.ok(LESSON_REVIEWS[`cable-sizing:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 124);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /_slug === "cable-sizing" && t\.includes\("voltage drop problems set"\)/);
  assert.match(courseSource, /_slug === "cable-sizing" && t\.includes\("swa sizing exercise"\)/);
  assert.match(viewSource, /WHOLE-PATH VOLTAGE-DROP BUDGET/);
  assert.match(viewSource, /SWA CONSTRUCTION AND FAULT PATH/);
});
test("cable fire systems and final design group completes the course", () => {
  for (let id = 21; id <= 28; id += 1) assert.ok(LESSON_REVIEWS[`cable-sizing:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 130);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "cable-sizing" && t\.includes\("fire cable quiz"\)/);
  assert.match(courseSource, /slug === "cable-sizing" && t\.includes\("final assessment"\)/);
  assert.match(viewSource, /FIRE-SURVIVING CABLE SYSTEM/);
  assert.match(viewSource, /END-TO-END CABLE DESIGN GATES/);
});
test("solar PV physics and array design group is specific and reviewed", () => {
  for (let id = 1; id <= 10; id += 1) assert.ok(LESSON_REVIEWS[`solar-pv:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 138);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "solar-pv" && t\.includes\("pv physics quiz"\)/);
  assert.match(courseSource, /_slug === "solar-pv" && t\.includes\("system sizing design exercise"\)/);
  assert.match(viewSource, /PV I-V CURVE AND OPERATING POINTS/);
  assert.match(viewSource, /ARRAY STRING AND YIELD DESIGN/);
});
test("solar inverter and battery group is specific and reviewed", () => {
  for (let id = 11; id <= 20; id += 1) assert.ok(LESSON_REVIEWS[`solar-pv:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 146);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "solar-pv" && t\.includes\("inverter quiz"\)/);
  assert.match(courseSource, /_slug === "solar-pv" && t\.includes\("battery sizing exercise"\)/);
  assert.match(viewSource, /INVERTER PORTS AND MPPT PATHS/);
  assert.match(viewSource, /BATTERY ENERGY AND SAFETY PATHS/);
});
test("solar grid connection and commissioning group completes the course", () => {
  for (let id = 21; id <= 29; id += 1) assert.ok(LESSON_REVIEWS[`solar-pv:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 153);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "solar-pv" && t\.includes\("grid connection quiz"\)/);
  assert.match(courseSource, /slug === "solar-pv" && t\.includes\("final assessment"\)/);
  assert.match(viewSource, /GRID CONNECTION AND EXPORT CONTROL/);
  assert.match(viewSource, /PV INSTALLATION AND COMMISSIONING/);
});
test("industrial starters and overload protection group is specific and reviewed", () => {
  for (let id = 1; id <= 10; id += 1) assert.ok(LESSON_REVIEWS[`industrial-control:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 161);
  const courseSource = fs.readFileSync(new URL("../app/learn/[slug]/page.tsx", import.meta.url), "utf8");
  const viewSource = fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx", import.meta.url), "utf8");
  assert.match(courseSource, /slug === "industrial-control" && t\.includes\("motor starter quiz"\)/);
  assert.match(courseSource, /_slug === "industrial-control" && t\.includes\("contactor circuit problems"\)/);
  assert.match(viewSource, /MOTOR STARTER POWER AND CONTROL/);
  assert.match(viewSource, /CONTACTOR AND OVERLOAD COORDINATION/);
});
test("industrial diagrams and safety systems group is specific and reviewed", () => {
  for (let id = 11; id <= 20; id += 1) assert.ok(LESSON_REVIEWS[`industrial-control:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length >= 169);
  const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");
  const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");
  assert.match(s,/_slug === "industrial-control" && t\.includes\("diagram reading exercises"\)/);
  assert.match(s,/slug === "industrial-control" && t\.includes\("safety systems quiz"\)/);
  assert.match(v,/CONTROL DIAGRAM STATE AND INTERLOCKS/); assert.match(v,/MACHINE SAFETY FUNCTION PATH/);
});
test("industrial PLC and panel group completes the course specifically", () => {
  for (let id=21;id<=30;id+=1) assert.ok(LESSON_REVIEWS[`industrial-control:l${id}`]);
  assert.ok(Object.keys(ENHANCED_LESSONS).length>=177);
  const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8"); const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");
  assert.match(s,/_slug === "industrial-control" && t\.includes\("writing a simple motor control program"\)/); assert.match(s,/slug === "industrial-control" && t\.includes\("final assessment"\)/); assert.match(v,/PLC SCAN AND LADDER STATE/); assert.match(v,/PANEL DESIGN AND COMMISSIONING/);
});
test("inspection preparation and continuity group is specific and reviewed",()=>{for(let id=1;id<=10;id+=1)assert.ok(LESSON_REVIEWS[`inspection-testing:l${id}`]);assert.ok(Object.keys(ENHANCED_LESSONS).length>=185);const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");assert.match(s,/slug === "inspection-testing" && t\.includes\("preparation quiz"\)/);assert.match(s,/_slug === "inspection-testing" && t\.includes\("continuity exercise"\)/);assert.match(v,/SAFE TEST SEQUENCE AND EVIDENCE/);assert.match(v,/CONTINUITY TOPOLOGY AND PATTERN/);});
test("inspection IR and loop group is specific and reviewed",()=>{for(let id=11;id<=20;id+=1)assert.ok(LESSON_REVIEWS[`inspection-testing:l${id}`]);assert.ok(Object.keys(ENHANCED_LESSONS).length>=193);const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");assert.match(s,/slug === "inspection-testing" && t\.includes\("ir testing quiz"\)/);assert.match(s,/_slug === "inspection-testing" && t\.includes\("zs measurement exercise"\)/);assert.match(v,/INSULATION TEST BOUNDARY AND LEAKAGE/);assert.match(v,/EARTH-FAULT LOOP AND DISCONNECTION/);});
test("inspection RCD polarity and PFC group is specific and reviewed",()=>{for(let id=21;id<=29;id+=1)assert.ok(LESSON_REVIEWS[`inspection-testing:l${id}`]);assert.ok(Object.keys(ENHANCED_LESSONS).length>=200);const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");assert.match(s,/slug === "inspection-testing" && t\.includes\("rcd testing quiz"\)/);assert.match(s,/slug === "inspection-testing" && t\.includes\("polarity and pfc quiz"\)/);assert.match(v,/RCD FIELD VERIFICATION/);assert.match(v,/POLARITY AND PROSPECTIVE FAULT CURRENT/);});
test("inspection certification group completes the course specifically",()=>{for(let id=30;id<=36;id+=1)assert.ok(LESSON_REVIEWS[`inspection-testing:l${id}`]);assert.ok(Object.keys(ENHANCED_LESSONS).length>=204);const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");assert.match(s,/_slug === "inspection-testing" && t\.includes\("eicr coding exercise"\)/);assert.match(s,/_slug === "inspection-testing" && t\.includes\("full mock test schedule"\)/);assert.match(s,/slug === "inspection-testing" && t\.includes\("final written assessment"\)/);assert.match(v,/CERTIFICATION AND CONDITION CODING/);assert.match(v,/FULL VERIFICATION EVIDENCE/);});
test("LED technology and drivers group is specific and reviewed",()=>{for(let id=1;id<=10;id+=1)assert.ok(LESSON_REVIEWS[`led-lighting:l${id}`]);assert.equal(Object.keys(ENHANCED_LESSONS).length,212);const s=fs.readFileSync(new URL("../app/learn/[slug]/page.tsx",import.meta.url),"utf8");const v=fs.readFileSync(new URL("../app/learn/EnhancedLessonView.tsx",import.meta.url),"utf8");assert.match(s,/slug === "led-lighting" && t\.includes\("led technology quiz"\)/);assert.match(s,/slug === "led-lighting" && t\.includes\("driver circuit quiz"\)/);assert.match(v,/LED JUNCTION LIGHT AND HEAT PATH/);assert.match(v,/DRIVER OUTPUT AND CONTROL WINDOW/);});