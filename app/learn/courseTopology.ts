export const COURSE_LESSON_COUNTS = {
  "electrical-fundamentals": 37,
  "domestic-wiring": 39,
  "protection-fault-analysis": 29,
  "three-phase-systems": 28,
  "cable-sizing": 28,
  "solar-pv": 29,
  "industrial-control": 30,
  "inspection-testing": 36,
  "led-lighting": 24,
} as const;

export type CourseSlug = keyof typeof COURSE_LESSON_COUNTS;

export const COURSE_TITLES: Record<CourseSlug, string> = {
  "electrical-fundamentals": "Electrical Fundamentals",
  "domestic-wiring": "Domestic Wiring",
  "protection-fault-analysis": "Protection & Fault Analysis",
  "three-phase-systems": "Three-Phase Systems",
  "cable-sizing": "Cable Sizing & Installation",
  "solar-pv": "Solar PV & Renewables",
  "industrial-control": "Industrial Control & PLCs",
  "inspection-testing": "Inspection & Testing",
  "led-lighting": "LED & Lighting Design",
};

export function isCourseSlug(value: string): value is CourseSlug {
  return Object.hasOwn(COURSE_LESSON_COUNTS, value);
}

export function isLessonIdForCourse(slug: string, lessonId: string): boolean {
  if (!isCourseSlug(slug) || !/^l[1-9]\d*$/.test(lessonId)) return false;
  return Number(lessonId.slice(1)) <= COURSE_LESSON_COUNTS[slug];
}
