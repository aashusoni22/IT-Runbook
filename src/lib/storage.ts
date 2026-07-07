export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const FAVORITES_KEY = "itfa_favorites";
const NOTES_KEY = "itfa_notes";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(FAVORITES_KEY), []);
}

export function writeFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(id: string): string[] {
  const current = readFavorites();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeFavorites(next);
  return next;
}

export function readNotes(): Note[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(NOTES_KEY), []);
}

export function writeNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function saveNote(title: string, content: string): Note {
  const note: Note = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    createdAt: new Date().toISOString()
  };
  writeNotes([note, ...readNotes()]);
  return note;
}

export function deleteNote(id: string): Note[] {
  const next = readNotes().filter((note) => note.id !== id);
  writeNotes(next);
  return next;
}
