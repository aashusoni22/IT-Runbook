"use client";

import { Star } from "lucide-react";
import { IssueCard } from "@/components/issue-card";
import { useFavorites } from "@/hooks/use-favorites";
import { categoryOrder, getArticleById, getArticlesByCategory } from "@/lib/kb";

export default function KbPage() {
  const { favorites } = useFavorites();
  const favoriteArticles = favorites.map((id) => getArticleById(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>

      {favoriteArticles.length ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <Star className="size-5 fill-amber-400 text-amber-500" />
            Favorites
          </h2>
          <div className="space-y-3">
            {favoriteArticles.map((article) =>
              article ? <IssueCard key={article.id} article={article} isFavorite /> : null
            )}
          </div>
        </section>
      ) : null}

      {categoryOrder.map((category) => {
        const articles = getArticlesByCategory(category);
        if (!articles.length) return null;

        return (
          <section key={category} className="space-y-3">
            <h2 className="font-semibold">{category}</h2>
            <div className="space-y-3">
              {articles.map((article) => (
                <IssueCard key={article.id} article={article} isFavorite={favorites.includes(article.id)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
