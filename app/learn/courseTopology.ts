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

export function isCourseSlug(value: string): value is CourseSlug {
  return Object.hasOwn(COURSE_LESSON_COUNTS, value);
}

export function isLessonIdForCourse(slug: string, lessonId: string): boolean {
  if (!isCourseSlug(slug) || !/^l[1-9]\d*$/.test(lessonId)) return false;
  return Number(lessonId.slice(1)) <= COURSE_LESSON_COUNTS[slug];
}
