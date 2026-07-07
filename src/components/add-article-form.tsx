"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AddArticleForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setStatus(null);

    const payload = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      symptoms: splitLines(String(formData.get("symptoms") ?? "")),
      quick_fix: String(formData.get("quick_fix") ?? ""),
      steps: splitLines(String(formData.get("steps") ?? "")),
      commands: splitLines(String(formData.get("commands") ?? "")),
      escalation_notes: String(formData.get("escalation_notes") ?? ""),
      ticket_template: String(formData.get("ticket_template") ?? ""),
      tags: splitTags(String(formData.get("tags") ?? "")),
      is_favorite: formData.get("is_favorite") === "on"
    };

    const response = await fetch("/api/kb/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setIsSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setStatus(body?.error ?? "Article could not be saved.");
      return;
    }

    const article = await response.json();
    router.push(`/articles/${article.id}`);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <Field label="Title" name="title" placeholder="POS terminal cannot print receipt" required />
      <Field label="Category" name="category" placeholder="POS, Network, PMS, Door Locks" required />
      <Area label="Symptoms" name="symptoms" placeholder="One symptom per line" required />
      <Area label="Quick Fix" name="quick_fix" placeholder="The fastest safe fix for the tech on the floor" required />
      <Area label="Steps" name="steps" placeholder="One troubleshooting step per line" required />
      <Area label="Commands" name="commands" placeholder="Optional commands, one per line" />
      <Area label="Escalation Notes" name="escalation_notes" placeholder="When to escalate and what team needs to know" />
      <Area label="Ticket Template" name="ticket_template" placeholder="Fields the support tech should capture" />
      <Field label="Tags" name="tags" placeholder="wifi, guest, printer" />
      <label className="flex min-h-12 items-center gap-3 rounded-xl border bg-card px-3 text-sm font-medium">
        <input name="is_favorite" type="checkbox" className="size-5 accent-primary" />
        Mark as favorite
      </label>
      {status ? <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{status}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Article"}
      </Button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;

  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Input {...inputProps} />
    </label>
  );
}

function Area(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  const { label, ...textareaProps } = props;

  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Textarea {...textareaProps} />
    </label>
  );
}
