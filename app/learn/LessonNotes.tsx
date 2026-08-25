"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileUp, NotebookPen, Printer, Search, Trash2 } from "lucide-react";
import { deleteNote, exportNotes, importNotes, loadNotes, noteKey, NotesImportPreview, previewNotesImport, saveNote } from "./notes";

type SaveState = "idle" | "saving" | "saved" | "error" | "unavailable";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

export function LessonNotes({ courseSlug, lessonId, lessonTitle }: { courseSlug: string; lessonId: string; lessonTitle: string }) {
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loaded, setLoaded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<NotesImportPreview | null>(null);
  const [search, setSearch] = useState("");
  const [allNotes, setAllNotes] = useState(() => [] as ReturnType<typeof loadNotes>["notes"][string][]);
  const importInput = useRef<HTMLInputElement>(null);

  const refresh = () => {
    try {
      const state = loadNotes(localStorage);
      setAllNotes(Object.values(state.notes).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      return state;
    } catch {
      setSaveState("unavailable");
      return null;
    }
  };

  useEffect(() => {
    const state = refresh();
    setContent(state?.notes[noteKey(courseSlug, lessonId)]?.content ?? "");
    setLoaded(true);
  }, [courseSlug, lessonId]);

  useEffect(() => {
    if (!loaded) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        saveNote(localStorage, { courseSlug, lessonId, lessonTitle, content });
        setSaveState("saved");
        refresh();
      } catch {
        setSaveState("error");
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [content, courseSlug, lessonId, lessonTitle, loaded]);

  const matchingNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return allNotes.filter((note) => `${note.lessonTitle} ${note.courseSlug} ${note.content}`.toLowerCase().includes(query)).slice(0, 6);
  }, [allNotes, search]);

  const downloadExport = () => {
    try {
      const blob = new Blob([exportNotes(localStorage)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `electracore-notes-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const readImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportPreview(previewNotesImport(await file.text()));
    event.target.value = "";
  };

  const confirmImport = () => {
    if (!importPreview?.valid) return;
    try {
      importNotes(localStorage, importPreview);
      const state = refresh();
      setContent(state?.notes[noteKey(courseSlug, lessonId)]?.content ?? content);
      setImportPreview(null);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const confirmDelete = () => {
    try {
      deleteNote(localStorage, courseSlug, lessonId);
      setContent("");
      setDeleteOpen(false);
      refresh();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const printNote = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) { setSaveState("error"); return; }
    printWindow.opener = null;
    printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(lessonTitle)} notes</title><style>body{font:16px/1.6 system-ui;max-width:760px;margin:40px auto;padding:0 24px}h1{font-size:24px}small{color:#555}pre{white-space:pre-wrap;font:inherit;border-top:1px solid #bbb;padding-top:20px}</style></head><body><h1>${escapeHtml(lessonTitle)}</h1><small>ElectraCore personal notes · stored on this device</small><pre>${escapeHtml(content || "No note content.")}</pre><script>window.print();<\/script></body></html>`);
    printWindow.document.close();
  };

  return <section className="lesson-note-panel" aria-labelledby={`notes-${lessonId}`}>
    <div className="lesson-note-heading"><div><p>Personal study record</p><h3 id={`notes-${lessonId}`}><NotebookPen size={18} aria-hidden="true" />Lesson notes</h3></div><span role="status" data-state={saveState}>{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved on this device" : saveState === "error" ? "Notes could not be saved" : saveState === "unavailable" ? "Device storage unavailable" : "Ready"}</span></div>
    <p className="lesson-note-disclosure">Notes are stored on this device unless you export them.</p>
    <label htmlFor={`note-${courseSlug}-${lessonId}`}>Notes for {lessonTitle}</label>
    <textarea id={`note-${courseSlug}-${lessonId}`} value={content} onChange={(event) => setContent(event.target.value)} placeholder={"Record a key idea, calculation step, question, or local-code point.\n\nUse plain text; headings and bullet lines are preserved."} maxLength={50000} />
    <div className="lesson-note-actions">
      <button type="button" onClick={downloadExport}><Download size={15} aria-hidden="true" />Export all notes</button>
      <button type="button" onClick={() => importInput.current?.click()}><FileUp size={15} aria-hidden="true" />Import notes</button>
      <input ref={importInput} type="file" accept="application/json,.json" onChange={readImport} hidden />
      <button type="button" onClick={printNote}><Printer size={15} aria-hidden="true" />Print this note</button>
      <button type="button" className="note-delete" onClick={() => setDeleteOpen(true)} disabled={!content}><Trash2 size={15} aria-hidden="true" />Delete</button>
    </div>
    {deleteOpen && <div className="lesson-note-confirm" role="alertdialog" aria-modal="true" aria-labelledby={`delete-note-${lessonId}`}><strong id={`delete-note-${lessonId}`}>Delete this lesson note?</strong><p>This cannot be undone unless it exists in an exported file.</p><div><button type="button" onClick={() => setDeleteOpen(false)}>Cancel</button><button type="button" className="note-delete" onClick={confirmDelete}>Delete note</button></div></div>}
    {importPreview && <div className="lesson-note-confirm" role="dialog" aria-modal="true" aria-labelledby={`import-note-${lessonId}`}><strong id={`import-note-${lessonId}`}>Import preview</strong>{importPreview.valid ? <p>{importPreview.notes.length} validated note{importPreview.notes.length === 1 ? "" : "s"} will be merged. Newer records take precedence.</p> : <ul>{importPreview.errors.map((error) => <li key={error}>{error}</li>)}</ul>}<div><button type="button" onClick={() => setImportPreview(null)}>Cancel</button><button type="button" onClick={confirmImport} disabled={!importPreview.valid}>Import validated notes</button></div></div>}
    <div className="lesson-note-search"><label htmlFor={`note-search-${lessonId}`}><Search size={14} aria-hidden="true" />Search notes on this device</label><input id={`note-search-${lessonId}`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search note text or lesson title" />{search && <div className="lesson-note-results" role="status">{matchingNotes.length ? matchingNotes.map((note) => <a key={noteKey(note.courseSlug, note.lessonId)} href={`/learn/${note.courseSlug}`}><strong>{note.lessonTitle}</strong><span>{note.content.slice(0, 110) || "Empty note"}</span></a>) : <p>No matching notes on this device.</p>}</div>}</div>
  </section>;
}
