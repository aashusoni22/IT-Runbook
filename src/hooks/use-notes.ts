"use client";

import { useCallback, useEffect, useState } from "react";
import { deleteNote, readNotes, saveNote, type Note } from "@/lib/storage";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(readNotes());
  }, []);

  const addNote = useCallback((title: string, content: string) => {
    saveNote(title, content);
    setNotes(readNotes());
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes(deleteNote(id));
  }, []);

  return { notes, addNote, removeNote };
}
