import assert from "node:assert/strict";
import test from "node:test";
import {
  LEARNING_STATE_KEY, loadCourseLearning, loadLearningState, recordAssessment,
  recordExercise, resetCourseLearning, saveLastLesson, saveLessonCompletion,
} from "../app/learn/progress.ts";

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

test("merges legacy completion into versioned progress without deleting it", () => {
  const storage = new MemoryStorage();
  storage.setItem("ec-completed-electrical-fundamentals", JSON.stringify(["l1", "l2"]));
  storage.setItem(LEARNING_STATE_KEY, JSON.stringify({ version: 2, courses: {
    "electrical-fundamentals": { completedLessons: ["l2", "l3"], assessments: {}, completedExercises: [] },
  }}));
  assert.deepEqual(loadCourseLearning(storage, "electrical-fundamentals").completedLessons, ["l1", "l2", "l3"]);
});

test("dual-writes completion and legacy percentage", () => {
  const storage = new MemoryStorage();
  saveLessonCompletion(storage, "course", ["l1", "l2"], 4);
  assert.equal(JSON.parse(storage.getItem("ec-progress") ?? "{}").course, 50);
  assert.deepEqual(JSON.parse(storage.getItem("ec-completed-course") ?? "[]"), ["l1", "l2"]);
  assert.deepEqual(loadLearningState(storage).courses.course.completedLessons, ["l1", "l2"]);
});

test("stores position, best assessment score, attempts, and exercises", () => {
  const storage = new MemoryStorage();
  saveLastLesson(storage, "course", "l4");
  recordAssessment(storage, "course", "l5", 0);
  recordAssessment(storage, "course", "l5", 100);
  recordExercise(storage, "course", "l6");
  const course = loadLearningState(storage).courses.course;
  assert.equal(course.lastLessonId, "l4");
  assert.equal(course.assessments.l5.attempts, 2);
  assert.equal(course.assessments.l5.bestScore, 100);
  assert.deepEqual(course.completedExercises, ["l6"]);
});

test("recovers from malformed state and only resets the requested course", () => {
  const storage = new MemoryStorage();
  storage.setItem(LEARNING_STATE_KEY, "{bad json");
  assert.deepEqual(loadLearningState(storage), { version: 2, courses: {} });
  saveLessonCompletion(storage, "one", ["l1"], 1);
  saveLessonCompletion(storage, "two", ["l1"], 1);
  resetCourseLearning(storage, "one");
  assert.equal(loadLearningState(storage).courses.one, undefined);
  assert.ok(loadLearningState(storage).courses.two);
});
