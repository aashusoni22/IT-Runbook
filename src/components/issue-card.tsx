import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IssueArticle } from "@/types/issue";

export function IssueCard({ article, isFavorite }: { article: IssueArticle; isFavorite?: boolean }) {
  return (
    <Link href={`/issues/${article.id}`} className="block transition-transform active:scale-[0.99]">
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 font-semibold leading-snug">
              {isFavorite ? <Star className="size-4 shrink-0 fill-amber-400 text-amber-500" /> : null}
              {article.title}
            </p>
            <Badge variant="outline">{article.category}</Badge>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
