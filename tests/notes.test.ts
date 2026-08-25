import assert from "node:assert/strict";
import test from "node:test";
import { deleteNote, exportNotes, importNotes, loadNotes, NOTES_STORAGE_KEY, previewNotesImport, saveNote } from "../app/learn/notes.ts";
import { resetCourseLearning } from "../app/learn/progress.ts";

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

test("notes recover from malformed storage and autosave-compatible writes are versioned", () => {
  const storage = new MemoryStorage();
  storage.setItem(NOTES_STORAGE_KEY, "{broken");
  assert.deepEqual(loadNotes(storage), { version: 1, notes: {} });
  const saved = saveNote(storage, { courseSlug: "electrical-fundamentals", lessonId: "l1", lessonTitle: "Charge", content: "Current is charge per unit time." });
  assert.match(saved.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(loadNotes(storage).notes["electrical-fundamentals:l1"].content, "Current is charge per unit time.");
});

test("notes export and validated import merge without executing markup", () => {
  const source = new MemoryStorage();
  saveNote(source, { courseSlug: "cable-sizing", lessonId: "l3", lessonTitle: "Design current", content: "<script>never execute</script> Ib = P/V" });
  const raw = exportNotes(source);
  const preview = previewNotesImport(raw);
  assert.equal(preview.valid, true);
  assert.equal(preview.notes.length, 1);
  const target = new MemoryStorage();
  assert.equal(importNotes(target, preview), 1);
  assert.equal(loadNotes(target).notes["cable-sizing:l3"].content, "<script>never execute</script> Ib = P/V");
  assert.equal(previewNotesImport('{"version":99,"notes":{}}').valid, false);
});

test("note deletion is explicit and course progress reset does not remove notes", () => {
  const storage = new MemoryStorage();
  saveNote(storage, { courseSlug: "solar-pv", lessonId: "l2", lessonTitle: "Irradiance", content: "Check STC assumptions." });
  resetCourseLearning(storage, "solar-pv");
  assert.equal(loadNotes(storage).notes["solar-pv:l2"].content, "Check STC assumptions.");
  deleteNote(storage, "solar-pv", "l2");
  assert.equal(loadNotes(storage).notes["solar-pv:l2"], undefined);
});

test("import preview rejects malformed records", () => {
  const preview = previewNotesImport('{"version":1,"notes":{"bad":{"lessonId":7}}}');
  assert.equal(preview.valid, false);
  assert.match(preview.errors.join(" "), /malformed/i);
});
