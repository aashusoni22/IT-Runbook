"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  ClipboardList,
  Loader2,
  ShieldAlert,
  Sparkles,
  StickyNote,
  Terminal,
  TriangleAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checklist } from "@/components/checklist";
import { CopyButton } from "@/components/copy-button";
import { saveNote } from "@/lib/storage";
import type { AiResponse } from "@/types/ai";

const examples = [
  "printer offline in the business center",
  "guest wifi connected but no internet",
  "outlook keeps asking for password",
  "payment terminal says host unreachable"
];

export function AiClient({ initialQuery = "" }: { initialQuery?: string }) {
  const [issue, setIssue] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AiResponse | null>(null);
  const [noteStatus, setNoteStatus] = useState<string | null>(null);
  const autoRan = useRef(false);

  async function runAi(value?: string) {
    const query = (value ?? issue).trim();
    if (query.length < 8) {
      setError("Add a few more details so the assistant can help.");
      return;
    }

    setIssue(query);
    setIsLoading(true);
    setError(null);
    setNoteStatus(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: query })
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Could not analyze this issue.");
        setData(null);
        return;
      }

      setData(body as AiResponse);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery.trim().length >= 8 && !autoRan.current) {
      autoRan.current = true;
      runAi(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function onSaveNote() {
    if (!data) return;
    saveNote(issue.slice(0, 80) || "AI troubleshooting note", data.result.ticketNote);
    setNoteStatus("Saved to Notes.");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            Describe the issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="e.g. teams keeps signing me out on the front desk PC"
            className="min-h-24"
          />
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => runAi(example)}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
              >
                {example}
              </button>
            ))}
          </div>
          <Button onClick={() => runAi()} size="lg" className="w-full" disabled={isLoading || issue.trim().length < 8}>
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Bot className="size-5" />}
            {isLoading ? "Thinking..." : "Get help"}
          </Button>
          {error ? (
            <p className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {data ? (
        <div className="animate-fade-up space-y-4">
          {data.warning ? (
            <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm font-medium text-warning">
              {data.warning}
            </p>
          ) : null}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Likely causes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                {data.result.likelyCauses.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Checklist title="Top checks" items={data.result.topChecks} />

          {data.result.commandsOrSettings.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="size-5" />
                  Commands / settings to check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.result.commandsOrSettings.map((command) => (
                  <div key={command} className="flex items-center justify-between gap-2 rounded-lg bg-slate-950 p-3">
                    <code className="text-sm text-white">{command}</code>
                    <CopyButton value={command} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-warning/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-warning">
                <ShieldAlert className="size-5" />
                Do not touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                {data.result.doNotTouch.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-critical/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-critical">
                <TriangleAlert className="size-5" />
                When to escalate
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{data.result.whenToEscalate}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-5" />
                Ticket note
              </CardTitle>
              <CopyButton value={data.result.ticketNote} label="Copy" />
            </CardHeader>
            <CardContent className="whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm leading-6">
              {data.result.ticketNote}
            </CardContent>
          </Card>

          {data.matches.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Related KB articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.matches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/issues/${match.id}`}
                    className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-border bg-background p-3 text-sm font-medium transition-colors hover:border-primary/40 active:bg-secondary"
                  >
                    <span>
                      <span className="block">{match.title}</span>
                      <span className="block text-xs font-normal text-muted-foreground">{match.category}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Button onClick={onSaveNote} variant="secondary" size="lg" className="w-full">
            <StickyNote className="size-5" />
            Save to Notes
          </Button>
          {noteStatus ? <p className="rounded-lg bg-secondary p-3 text-center text-sm font-medium">{noteStatus}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
