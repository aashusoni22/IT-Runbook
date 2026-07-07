import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, ExternalLink, Layers3, ListChecks, MapPinned, Terminal, Wrench } from "lucide-react";
import { Checklist } from "@/components/checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticle } from "@/lib/supabase";
import { sampleArticles } from "@/lib/sample-data";

type ArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = (await getArticle(id)) ?? sampleArticles.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  return (
    <article className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{article.category}</Badge>
          {article.tags.map((tag) => (
            <Badge key={tag} variant="accent">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{article.title}</h1>
        {article.beginner_summary ? (
          <p className="text-sm leading-6 text-muted-foreground">{article.beginner_summary}</p>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          {article.estimated_time ? <Metric label="Time" value={article.estimated_time} /> : null}
          {article.equipment?.length ? <Metric label="Gear" value={`${article.equipment.length} checks`} /> : null}
        </div>
      </div>

      <Card className="border-primary/30 bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="size-5" />
            Quick Fix
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base font-medium leading-7 text-primary-foreground/95">
          {article.quick_fix}
        </CardContent>
      </Card>

      <Section title="Symptoms" items={article.symptoms} />
      {article.equipment?.length ? <Section title="What to have ready" items={article.equipment} /> : null}
      <Checklist title="Step-by-step fix" items={article.steps} />

      {article.layers?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="size-5" />
              Layered troubleshooting
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
      ) : null}

      {article.navigation_steps?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="size-5" />
              Where to click or check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {article.navigation_steps.map((step) => (
              <div key={`${step.device}-${step.path}`} className="rounded-xl border bg-background p-3">
                <p className="text-sm font-semibold text-primary">{step.device}</p>
                <p className="mt-1 rounded-lg bg-secondary p-2 text-sm font-medium">{step.path}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                  {step.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {article.command_blocks?.length || article.commands.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="size-5" />
              Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {article.command_blocks?.length
              ? article.command_blocks.map((block) => (
                  <div key={`${block.device}-${block.purpose}`} className="space-y-2 rounded-xl border bg-background p-3">
                    <p className="text-sm font-semibold text-primary">Run on: {block.device}</p>
                    <p className="text-xs text-muted-foreground">{block.purpose}</p>
                    {block.commands.map((command) => (
                      <code key={command} className="block rounded-xl bg-slate-950 p-3 text-sm text-white">
                        {command}
                      </code>
                    ))}
                  </div>
                ))
              : article.commands.map((command) => (
                  <code key={command} className="block rounded-xl bg-slate-950 p-3 text-sm text-white">
                    {command}
                  </code>
                ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Escalation Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">{article.escalation_notes}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5" />
            Strong ticket template
          </CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap rounded-xl bg-secondary p-3 text-sm leading-6">
          {article.ticket_template}
        </CardContent>
      </Card>

      {article.references?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-5" />
              References and videos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {article.references.map((reference) => (
              <a
                key={reference.url}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-14 items-center justify-between gap-3 rounded-xl border bg-background p-3 text-sm font-medium active:bg-secondary"
              >
                <span>
                  <span className="block">{reference.label}</span>
                  <span className="block text-xs capitalize text-muted-foreground">{reference.type}</span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Button asChild variant="outline" size="lg" className="w-full">
        <Link href="/search">Back to Search</Link>
      </Button>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <List className={ordered ? "list-decimal space-y-2 pl-5" : "list-disc space-y-2 pl-5"}>
          {items.map((item) => (
            <li key={item} className="leading-6">
              {item}
            </li>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
