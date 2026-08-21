export const LEARNING_STATE_KEY = "electracore.learning.v2";
export const LEARNING_STATE_VERSION = 2;

export interface AssessmentRecord {
  attempts: number;
  bestScore: number;
  lastAttemptAt: string;
}
export interface CourseLearningState {
  completedLessons: string[];
  lastLessonId?: string;
  assessments: Record<string, AssessmentRecord>;
  completedExercises: string[];
}
export interface LearningState {
  version: 2;
  courses: Record<string, CourseLearningState>;
}
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const emptyCourse = (): CourseLearningState => ({
  completedLessons: [], assessments: {}, completedExercises: [],
});
const emptyState = (): LearningState => ({ version: LEARNING_STATE_VERSION, courses: {} });

function uniqueStrings(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string"))] : [];
}
function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
export function loadLearningState(storage: StorageLike): LearningState {
  const parsed = parseJson(storage.getItem(LEARNING_STATE_KEY));
  if (!parsed || typeof parsed !== "object" || (parsed as { version?: unknown }).version !== 2) return emptyState();
  const candidate = parsed as Partial<LearningState>;
  const courses: Record<string, CourseLearningState> = {};
  for (const [slug, raw] of Object.entries(candidate.courses ?? {})) {
    if (!raw || typeof raw !== "object") continue;
    const course = raw as Partial<CourseLearningState>;
    courses[slug] = {
      completedLessons: uniqueStrings(course.completedLessons),
      lastLessonId: typeof course.lastLessonId === "string" ? course.lastLessonId : undefined,
      assessments: course.assessments && typeof course.assessments === "object" ? course.assessments : {},
      completedExercises: uniqueStrings(course.completedExercises),
    };
  }
  return { version: 2, courses };
}
export function loadCourseLearning(storage: StorageLike, slug: string): CourseLearningState {
  const state = loadLearningState(storage);
  const v2 = state.courses[slug] ?? emptyCourse();
  const legacy = uniqueStrings(parseJson(storage.getItem(`ec-completed-${slug}`)));
  return { ...v2, completedLessons: [...new Set([...legacy, ...v2.completedLessons])] };
}
function updateCourse(storage: StorageLike, slug: string, update: (course: CourseLearningState) => CourseLearningState) {
  const state = loadLearningState(storage);
  state.courses[slug] = update(state.courses[slug] ?? emptyCourse());
  storage.setItem(LEARNING_STATE_KEY, JSON.stringify(state));
  return state.courses[slug];
}
export function saveLessonCompletion(storage: StorageLike, slug: string, completedLessons: string[], totalLessons: number) {
  const unique = uniqueStrings(completedLessons);
  updateCourse(storage, slug, course => ({ ...course, completedLessons: unique }));
  storage.setItem(`ec-completed-${slug}`, JSON.stringify(unique));
  const legacyProgress = parseJson(storage.getItem("ec-progress"));
  const progress = legacyProgress && typeof legacyProgress === "object" ? legacyProgress as Record<string, number> : {};
  progress[slug] = totalLessons > 0 ? Math.round((unique.length / totalLessons) * 100) : 0;
  storage.setItem("ec-progress", JSON.stringify(progress));
}
export function saveLastLesson(storage: StorageLike, slug: string, lessonId: string) {
  updateCourse(storage, slug, course => ({ ...course, lastLessonId: lessonId }));
}
export function recordAssessment(storage: StorageLike, slug: string, lessonId: string, score: number) {
  updateCourse(storage, slug, course => {
    const previous = course.assessments[lessonId];
    return {
      ...course,
      assessments: {
        ...course.assessments,
        [lessonId]: {
          attempts: (previous?.attempts ?? 0) + 1,
          bestScore: Math.max(previous?.bestScore ?? 0, score),
          lastAttemptAt: new Date().toISOString(),
        },
      },
    };
  });
}
export function recordExercise(storage: StorageLike, slug: string, lessonId: string) {
  updateCourse(storage, slug, course => ({
    ...course,
    completedExercises: [...new Set([...course.completedExercises, lessonId])],
  }));
}
export function resetCourseLearning(storage: StorageLike, slug: string) {
  const state = loadLearningState(storage);
  delete state.courses[slug];
  storage.setItem(LEARNING_STATE_KEY, JSON.stringify(state));
  storage.removeItem(`ec-completed-${slug}`);
  const legacy = parseJson(storage.getItem("ec-progress"));
  if (legacy && typeof legacy === "object") {
    delete (legacy as Record<string, number>)[slug];
    storage.setItem("ec-progress", JSON.stringify(legacy));
  }
}
