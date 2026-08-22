import fs from "node:fs";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const source = read("../app/learn/[slug]/page.tsx");
const enhancementSource = read("../app/learn/enhancedLessons.ts") + read("../app/learn/fundamentalsGroupOne.ts") + read("../app/learn/fundamentalsGroupTwo.ts")
  + read("../app/learn/fundamentalsAcLessons.ts")
  + read("../app/learn/fundamentalsReactiveLessons.ts")
  + read("../app/learn/fundamentalsMeasurementLessons.ts")
  + read("../app/learn/domesticConsumerUnitLessons.ts")
  + read("../app/learn/domesticFinalCircuitLessons.ts")
  + read("../app/learn/domesticLightingEarthingLessons.ts")
  + read("../app/learn/domesticLocationsCablesLessons.ts")
  + read("../app/learn/domesticFaultRegulationLessons.ts")
  + read("../app/learn/protectionDeviceLessons.ts")
  + read("../app/learn/protectionLoopLessons.ts")
  + read("../app/learn/protectionRcdPfcLessons.ts")
  + read("../app/learn/protectionCoordinationTestingLessons.ts")
  + read("../app/learn/threePhaseFundamentalsLessons.ts")
  + read("../app/learn/threePhaseDeltaPowerLessons.ts")
  + read("../app/learn/threePhaseMachinesLessons.ts")
  + read("../app/learn/cableCccDeratingLessons.ts")
  + read("../app/learn/cableVoltageSwaLessons.ts")
  + read("../app/learn/cableFireDesignLessons.ts")
  + read("../app/learn/solarPhysicsDesignLessons.ts");
const reviewSource = read("../app/learn/reviewStates.ts");
const enhanced = new Set([...enhancementSource.matchAll(/"([a-z0-9-]+:l\d+)":/g)].map(match => match[1]));
const reviews = new Map([...reviewSource.matchAll(/"([a-z0-9-]+:l\d+)": \{ state: "([^"]+)", reviewedOn: "([^"]+)", evidence: "([^"]+)" \}/g)].map(match => [match[1], { state: match[2], date: match[3], evidence: match[4] }]));
const rows=[]; let course=""; let moduleTitle="";
for (const line of source.split(/\r?\n/)) {
  const c=line.match(/^  "([^"]+)": \{$/); if(c) course=c[1];
  const m=line.match(/(?:^\s*\{|^\s*)id: "m\d+", title: "([^"]+)"/); if(m) moduleTitle=m[1];
  const l=line.match(/\{ id: "(l\d+)", title: "([^"]+)", duration: "([^"]+)", type: "(video|quiz|exercise)" \}/); if(!l||!course) continue;
  const key=`${course}:${l[1]}`; const review=reviews.get(key);
  rows.push({course,moduleTitle,id:l[1],title:l[2],duration:l[3],type:l[4],key,enhanced:enhanced.has(key),review});
}
const dateParts=Object.fromEntries(new Intl.DateTimeFormat("en",{timeZone:"Africa/Nairobi",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()).map(part=>[part.type,part.value]));
const generatedOn=`${dateParts.year}-${dateParts.month}-${dateParts.day}`;
const counts={ enhanced:rows.filter(r=>r.enhanced).length, reviewed:rows.filter(r=>r.review).length, pending:rows.filter(r=>!r.review).length };
const header=["# Curriculum matrix","",`Generated from the preserved course database on ${generatedOn}. Courses: ${new Set(rows.map(r=>r.course)).size}; lessons: ${rows.length}; structured enhancements: ${counts.enhanced}; individually reviewed: ${counts.reviewed}; awaiting review: ${counts.pending}.`,"","Lesson IDs are compatibility-sensitive internal identifiers. Review states come only from `app/learn/reviewStates.ts`; absent entries are explicitly incomplete.","","| Course | Module | Lesson | Existing URL / ID | Duration | Type | Content record | Review state | Evidence |","| --- | --- | --- | --- | --- | --- | --- | --- | --- |"]; const esc=v=>String(v).replaceAll("|","\\|").replaceAll("\n"," ");
const body=rows.map(r=>`| ${[r.course,r.moduleTitle,r.title,`/learn/${r.course} (lesson id: ${r.id})`,r.duration,r.type,r.enhanced?"Structured enhanced lesson":"Existing route content",r.review?.state??"Not yet reviewed",r.review?.evidence??"Pending individual inspection"].map(esc).join(" | ")} |`);
fs.writeFileSync(new URL("../docs/CURRICULUM-MATRIX.md",import.meta.url),[...header,...body,""].join("\n"));
console.log(`Wrote ${rows.length} rows: ${counts.enhanced} enhanced, ${counts.reviewed} reviewed, ${counts.pending} pending.`);