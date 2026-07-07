"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Layers3, ListChecks, Search, Sparkles, Terminal, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { IssueCard } from "@/components/issue-card";
import { computeBestMatch } from "@/lib/kb";

type Panel = "quickfix" | "commands" | null;

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [panel, setPanel] = useState<Panel>(null);

  const match = useMemo(() => (query.trim().length >= 3 ? computeBestMatch(query) : null), [query]);

  function onChange(value: string) {
    setQuery(value);
    setPanel(null);
    router.replace(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search", { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 pl-10 text-base"
          placeholder="printer offline, MFA new phone, guest wifi slow..."
          aria-label="Search the knowledge base"
          autoFocus
        />
      </div>

      {query.trim().length > 0 && query.trim().length < 3 ? (
        <p className="text-sm text-muted-foreground">Keep typing for a match...</p>
      ) : null}

      {match ? (
        <div className="animate-fade-up space-y-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit">
                {match.article.category}
              </Badge>
              <CardTitle className="pt-1 text-xl">{match.article.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Likely affected layers
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {match.likelyLayers.map((layer) => (
                    <Badge key={layer} variant="accent">
                      {layer}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-sm font-medium leading-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ask this first
                </span>
                <p className="mt-1">{match.firstQuestion}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button asChild size="lg">
                  <Link href={`/issues/${match.article.id}`}>
                    <Wrench className="size-4" />
                    Start Flow
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setPanel(panel === "quickfix" ? null : "quickfix")}
                >
                  <ListChecks className="size-4" />
                  Quick Fix
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setPanel(panel === "commands" ? null : "commands")}
                  disabled={!match.article.commands.length}
                >
                  <Terminal className="size-4" />
                  Commands
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/ai?q=${encodeURIComponent(query)}`}>
                    <Sparkles className="size-4" />
                    More Help
                  </Link>
                </Button>
              </div>

              {panel === "quickfix" ? (
                <div className="space-y-2 rounded-xl border border-border/70 p-3">
                  {match.article.quickChecks.map((check) => (
                    <p key={check} className="flex gap-2 text-sm leading-6">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {check}
                    </p>
                  ))}
                </div>
              ) : null}

              {panel === "commands" ? (
                <div className="space-y-2">
                  {match.article.commands.map((command) => (
                    <div key={command} className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 p-3">
                      <code className="text-sm text-white">{command}</code>
                      <CopyButton value={command} />
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {match.others.length ? (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Layers3 className="size-4" />
                Other possible matches
              </h2>
              <div className="space-y-3">
                {match.others.map((article) => (
                  <IssueCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {query.trim().length >= 3 && !match ? (
        <Card>
          <CardContent className="space-y-3 p-4 text-sm text-muted-foreground">
            <p>No KB match yet for &quot;{query}&quot;.</p>
            <Button asChild size="lg" className="w-full">
              <Link href={`/ai?q=${encodeURIComponent(query)}`}>
                <Sparkles className="size-4" />
                Ask AI instead
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
