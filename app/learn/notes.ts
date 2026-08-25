export const NOTES_STORAGE_KEY = "electracore.notes.v1";
export const NOTES_EXPORT_VERSION = 1;

export interface LessonNote {
  courseSlug: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  updatedAt: string;
}
export interface NotesState {
  version: 1;
  notes: Record<string, LessonNote>;
}
export interface NotesImportPreview {
  valid: boolean;
  notes: LessonNote[];
  errors: string[];
}
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const emptyState = (): NotesState => ({ version: NOTES_EXPORT_VERSION, notes: {} });
export const noteKey = (courseSlug: string, lessonId: string) => `${courseSlug}:${lessonId}`;

function isLessonNote(value: unknown): value is LessonNote {
  if (!value || typeof value !== "object") return false;
  const note = value as Partial<LessonNote>;
  return typeof note.courseSlug === "string"
    && typeof note.lessonId === "string"
    && typeof note.lessonTitle === "string"
    && typeof note.content === "string"
    && typeof note.updatedAt === "string"
    && !Number.isNaN(Date.parse(note.updatedAt));
}

export function loadNotes(storage: StorageLike): NotesState {
  const raw = storage.getItem(NOTES_STORAGE_KEY);
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as Partial<NotesState>;
    if (parsed.version !== NOTES_EXPORT_VERSION || !parsed.notes || typeof parsed.notes !== "object") return emptyState();
    const notes: Record<string, LessonNote> = {};
    for (const value of Object.values(parsed.notes)) {
      if (isLessonNote(value)) notes[noteKey(value.courseSlug, value.lessonId)] = value;
    }
    return { version: NOTES_EXPORT_VERSION, notes };
  } catch {
    return emptyState();
  }
}

export function saveNote(storage: StorageLike, note: Omit<LessonNote, "updatedAt">): LessonNote {
  const state = loadNotes(storage);
  const saved = { ...note, content: note.content.slice(0, 50000), updatedAt: new Date().toISOString() };
  state.notes[noteKey(note.courseSlug, note.lessonId)] = saved;
  storage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state));
  return saved;
}

export function deleteNote(storage: StorageLike, courseSlug: string, lessonId: string) {
  const state = loadNotes(storage);
  delete state.notes[noteKey(courseSlug, lessonId)];
  storage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state));
}

export function exportNotes(storage: StorageLike): string {
  const state = loadNotes(storage);
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function previewNotesImport(raw: string): NotesImportPreview {
  const errors: string[] = [];
  try {
    const parsed = JSON.parse(raw) as Partial<NotesState>;
    if (parsed.version !== NOTES_EXPORT_VERSION) errors.push("Unsupported notes export version.");
    if (!parsed.notes || typeof parsed.notes !== "object") errors.push("The export does not contain a notes collection.");
    const notes = parsed.notes && typeof parsed.notes === "object" ? Object.values(parsed.notes).filter(isLessonNote) : [];
    if (parsed.notes && Object.keys(parsed.notes).length !== notes.length) errors.push("One or more note records are malformed.");
    return { valid: errors.length === 0, notes, errors };
  } catch {
    return { valid: false, notes: [], errors: ["The selected file is not valid JSON."] };
  }
}

export function importNotes(storage: StorageLike, preview: NotesImportPreview): number {
  if (!preview.valid) throw new Error("Cannot import invalid notes.");
  const state = loadNotes(storage);
  for (const note of preview.notes) {
    const key = noteKey(note.courseSlug, note.lessonId);
    const existing = state.notes[key];
    if (!existing || Date.parse(note.updatedAt) >= Date.parse(existing.updatedAt)) state.notes[key] = note;
  }
  storage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state));
  return preview.notes.length;
}
