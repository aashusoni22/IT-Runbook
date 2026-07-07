import { ArticleCard } from "@/components/article-card";
import { SearchBox } from "@/components/search-box";
import { searchArticles } from "@/lib/supabase";
import { sampleArticles } from "@/lib/sample-data";
import { matchesQuery } from "@/lib/kb-search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const found = await searchArticles(q);
  const fallback = q ? sampleArticles.filter((article) => matchesQuery(article, q)) : sampleArticles;
  const articles = found.length ? found : fallback;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Search KB</h1>
        <SearchBox initialQuery={q} />
      </div>
      <p className="text-sm text-muted-foreground">
        {q ? `${articles.length} result${articles.length === 1 ? "" : "s"} for "${q}"` : "Recent and favorite fixes"}
      </p>
      <div className="space-y-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {!articles.length ? (
        <div className="soft-shadow rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
          No matching article found. Try a symptom, system name, location, or vendor keyword — or ask{" "}
          <a href="/assist" className="font-medium text-primary underline underline-offset-2">
            AI Assist
          </a>{" "}
          for a guided fix.
        </div>
      ) : null}
    </div>
  );
}
