import type { KbArticle } from "@/types/kb";

function toHaystack(article: KbArticle) {
  return [
    article.title,
    article.category,
    article.impact ?? "",
    article.beginner_summary ?? "",
    article.quick_fix,
    article.escalation_notes,
    article.ticket_template,
    ...(article.equipment ?? []),
    ...article.symptoms,
    ...article.steps,
    ...article.commands,
    ...(article.layers ?? []).flatMap((layer) => [layer.name, ...layer.checks]),
    ...(article.navigation_steps ?? []).flatMap((step) => [step.device, step.path, ...step.checks]),
    ...(article.command_blocks ?? []).flatMap((block) => [block.device, block.purpose, ...block.commands]),
    ...(article.references ?? []).flatMap((reference) => [reference.label, reference.type, reference.url]),
    ...article.tags
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(article: KbArticle, query: string) {
  return toHaystack(article).includes(query.trim().toLowerCase());
}

export function rankArticles(articles: KbArticle[], query: string, limit = 4): KbArticle[] {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2);

  if (!terms.length) {
    return [];
  }

  return articles
    .map((article) => {
      const haystack = toHaystack(article);
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { article, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.article);
}
