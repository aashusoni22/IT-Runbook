"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  ExternalLink,
  Layers3,
  MapPinned,
  Sparkles,
  Star,
  Terminal,
  TriangleAlert,
  Youtube
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checklist } from "@/components/checklist";
import { CopyButton } from "@/components/copy-button";
import { IssueCard } from "@/components/issue-card";
import { useFavorites } from "@/hooks/use-favorites";
import { getArticleById, getRelatedArticles } from "@/lib/kb";
import { saveNote } from "@/lib/storage";

export default function IssuePage() {
  const params = useParams<{ id: string }>();
  const article = getArticleById(params.id);
  const { isFavorite, toggle } = useFavorites();
  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  if (!article) {
    return (
      <div className="grid min-h-[60dvh] place-items-center text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Issue not found</h1>
          <p className="text-sm text-muted-foreground">That KB issue is not available.</p>
          <Button asChild>
            <Link href="/search">Search the KB</Link>
          </Button>
        </div>
      </div>
    );
  }

  const related = getRelatedArticles(article);

  function onSaveNote() {
    if (!article) return;
    saveNote(article.title, article.ticketTemplate);
    setNoteStatus("Saved to Notes.");
  }

  return (
    <article className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <Button variant="ghost" size="icon" onClick={() => toggle(article.id)} aria-label="Toggle favorite">
          <Star className={isFavorite(article.id) ? "size-5 fill-amber-400 text-amber-500" : "size-5"} />
        </Button>
      </div>

      <div className="space-y-2">
        <Badge variant="outline">{article.category}</Badge>
        <h1 className="text-2xl font-bold tracking-tight">{article.title}</h1>
      </div>

      <Checklist title="Do this first" items={article.quickChecks} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers3 className="size-5" />
            Layer-by-layer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {article.layers.map((layer) => (
            <div key={layer.name} className="rounded-xl border bg-background p-3">
              <h3 className="font-semibold">{layer.name}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {layer.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {article.systemPaths.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="size-5" />
              Where to check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {article.systemPaths.map((path) => (
              <div key={`${path.platform}-${path.path}`} className="rounded-xl border bg-background p-3">
                <p className="text-sm font-semibold text-primary">{path.platform}</p>
                <p className="mt-1 rounded-lg bg-secondary p-2 text-sm font-medium">{path.path}</p>
                {path.notes?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                    {path.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {article.commands.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="size-5" />
              Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {article.commands.map((command) => (
              <div key={command} className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 p-3">
                <code className="text-sm text-white">{command}</code>
                <CopyButton value={command} />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-critical/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-critical">
            <TriangleAlert className="size-5" />
            When to escalate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
            {article.escalationTriggers.map((trigger) => (
              <li key={trigger}>{trigger}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5" />
            Ticket note
          </CardTitle>
          <CopyButton value={article.ticketTemplate} label="Copy" />
        </CardHeader>
        <CardContent className="whitespace-pre-wrap rounded-xl bg-secondary p-3 text-sm leading-6">
          {article.ticketTemplate}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="lg" onClick={onSaveNote}>
          Save to Notes
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={`/ai?q=${encodeURIComponent(article.title)}`}>
            <Sparkles className="size-4" />
            Ask AI
          </Link>
        </Button>
      </div>
      {noteStatus ? <p className="rounded-xl bg-secondary p-3 text-center text-sm font-medium">{noteStatus}</p> : null}

      {related.length ? (
        <section className="space-y-3">
          <h2 className="font-semibold">Related KB articles</h2>
          <div className="space-y-3">
            {related.map((item) => (
              <IssueCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}

      {article.youtubeSearches.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="size-5" />
              Video help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {article.youtubeSearches.map((term) => (
              <a
                key={term}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-between gap-3 rounded-xl border bg-background p-3 text-sm font-medium active:bg-secondary"
              >
                {term}
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </article>
  );
}
