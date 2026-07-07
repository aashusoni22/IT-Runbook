"use client";

import { useState } from "react";
import { Plus, StickyNote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotes } from "@/hooks/use-notes";

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function NotesPage() {
  const { notes, addNote, removeNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function onAdd() {
    if (!content.trim()) return;
    addNote(title.trim() || "Field note", content.trim());
    setTitle("");
    setContent("");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Notes</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick capture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title (optional)" />
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What happened, room/location, what you tried..."
            className="min-h-20"
          />
          <Button onClick={onAdd} size="lg" className="w-full" disabled={!content.trim()}>
            <Plus className="size-5" />
            Save note
          </Button>
        </CardContent>
      </Card>

      {notes.length ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{note.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(note.createdAt)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeNote(note.id)} aria-label="Delete note">
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {note.content}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center text-sm text-muted-foreground">
            <StickyNote className="size-6" />
            No notes yet. Save one above, or from an issue/AI answer.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
