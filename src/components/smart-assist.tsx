"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  ClipboardList,
  FilePlus2,
  Lightbulb,
  Loader2,
  Sparkles,
  Terminal,
  TriangleAlert,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checklist } from "@/components/checklist";
import { CopyButton } from "@/components/copy-button";
import { UrgencyBadge } from "@/components/urgency-badge";
import type { AssistResponse } from "@/types/assist";

const examples = [
  "Meeting room projector shows no signal",
  "Guest says room TV has no channels",
  "Front desk printer stuck offline during check-in rush",
  "Restaurant POS terminal will not process payment"
];

export function SmartAssist({ autoFocus = false }: { autoFocus?: boolean }) {
  const [issue, setIssue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AssistResponse | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  async function runAssist(value?: string) {
    const query = (value ?? issue).trim();
    if (query.length < 8) {
      setError("Add a few more details so the assistant can help.");
      return;
    }

    setIssue(query);
    setIsLoading(true);
    setError(null);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/assist", {
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

      setData(body as AssistResponse);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveDraft() {
    if (!data) return;
    setSaveStatus(null);

    const response = await fetch("/api/kb/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.result.headline,
        category: "AI Draft",
        symptoms: [issue],
        quick_fix: data.result.quick_fix,
        steps: data.result.steps,
        commands: data.result.commands,
        escalation_notes: data.result.escalate_when,
        ticket_template: data.result.ticket_template,
        tags: ["ai-draft"],
        is_favorite: false
      })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setSaveStatus(body?.error ?? "Draft could not be saved.");
      return;
    }

    setSaveStatus("Saved to the knowledge base as a draft for review.");
  }

  return (
    <div className="space-y-4">
      <Card className="glow-ring border-primary/20">
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
            placeholder="e.g. lobby display PC is on but the event schedule is not showing"
            autoFocus={autoFocus}
            className="min-h-24"
          />
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => runAssist(example)}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
              >
                {example}
              </button>
            ))}
          </div>
          <Button
            onClick={() => runAssist()}
            size="lg"
            className="w-full"
            disabled={isLoading || issue.trim().length < 8}
          >
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Bot className="size-5" />}
            {isLoading ? "Analyzing your issue..." : "Get a guided fix"}
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
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <UrgencyBadge urgency={data.result.urgency} />
                <Badge variant={data.source === "ai" ? "primary" : "outline"} className="gap-1.5">
                  {data.source === "ai" ? <Bot className="size-3.5" /> : <Lightbulb className="size-3.5" />}
                  {data.source === "ai" ? "AI-generated" : "KB-grounded"}
                </Badge>
              </div>
              <CardTitle className="pt-1 text-xl">{data.result.headline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm leading-6 text-muted-foreground">{data.result.likely_cause}</p>
            </CardContent>
          </Card>

          {data.warning ? (
            <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm font-medium text-warning">
              {data.warning}
            </p>
          ) : null}

          <Card className="border-primary/30 bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <Wrench className="size-5" />
                Try this first
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base font-medium leading-7 text-primary-foreground/95">
              {data.result.quick_fix}
            </CardContent>
          </Card>

          <Checklist title="Step-by-step fix" items={data.result.steps} />

          {data.result.commands.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="size-5" />
                  Commands to try
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.result.commands.map((command) => (
                  <div key={command} className="flex items-center justify-between gap-2 rounded-lg bg-slate-950 p-3">
                    <code className="text-sm text-white">{command}</code>
                    <CopyButton value={command} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-critical/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-critical">
                <TriangleAlert className="size-5" />
                Escalate when
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{data.result.escalate_when}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-5" />
                Ticket template
              </CardTitle>
              <CopyButton value={data.result.ticket_template} label="Copy ticket" />
            </CardHeader>
            <CardContent className="whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm leading-6">
              {data.result.ticket_template}
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
                    href={`/articles/${match.id}`}
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

          <Button onClick={saveDraft} variant="secondary" size="lg" className="w-full">
            <FilePlus2 className="size-5" />
            Save as KB draft
          </Button>
          {saveStatus ? (
            <p className="rounded-lg bg-secondary p-3 text-center text-sm font-medium">{saveStatus}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
