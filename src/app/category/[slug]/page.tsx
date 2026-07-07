import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { IssueCard } from "@/components/issue-card";
import { categoryFromSlug, getArticlesByCategory } from "@/lib/kb";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category);

  return (
    <div className="space-y-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <ArrowLeft className="size-4" />
        Home
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">{category}</h1>
      <div className="space-y-3">
        {articles.map((article) => (
          <IssueCard key={article.id} article={article} />
        ))}
      </div>
      {!articles.length ? (
        <p className="soft-shadow rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
          No issues logged in this category yet.{" "}
          <Link href="/ai" className="font-medium text-primary underline underline-offset-2">
            Ask AI
          </Link>{" "}
          for a guided fix.
        </p>
      ) : null}
    </div>
  );
}
