import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KbArticle } from "@/types/kb";

export function ArticleCard({ article }: { article: KbArticle }) {
  return (
    <Link href={`/articles/${article.id}`} className="block transition-transform active:scale-[0.99]">
      <Card className="overflow-hidden transition-colors hover:border-primary/40">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">{article.title}</CardTitle>
            {article.is_favorite ? <Star className="mt-0.5 size-5 shrink-0 fill-amber-400 text-amber-500" /> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {article.impact ? <p className="text-xs font-semibold uppercase tracking-wide text-primary">{article.impact}</p> : null}
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.quick_fix}</p>
          {article.estimated_time ? (
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" />
              {article.estimated_time}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Badge>{article.category}</Badge>
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
