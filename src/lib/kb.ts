import { issueArticles } from "@/lib/kb-data";
import type { IssueArticle, IssueCategory } from "@/types/issue";

export const categoryOrder: IssueCategory[] = [
  "Payment/POS",
  "Printer",
  "Outlook/Email",
  "Teams/Microsoft 365",
  "MFA/Login",
  "Wi-Fi/Network",
  "Laptop/Device",
  "New User Setup"
];

const categorySlugs: Record<IssueCategory, string> = {
  "Payment/POS": "payment-pos",
  Printer: "printer",
  "Outlook/Email": "outlook-email",
  "Teams/Microsoft 365": "teams-m365",
  "MFA/Login": "mfa-login",
  "Wi-Fi/Network": "wifi-network",
  "Laptop/Device": "laptop-device",
  "New User Setup": "new-user-setup"
};

export function categorySlug(category: IssueCategory): string {
  return categorySlugs[category];
}

export function categoryFromSlug(slug: string): IssueCategory | undefined {
  return categoryOrder.find((category) => categorySlugs[category] === slug);
}

export function getArticleById(id: string): IssueArticle | undefined {
  return issueArticles.find((article) => article.id === id);
}

export function getArticlesByCategory(category: string): IssueArticle[] {
  return issueArticles.filter((article) => article.category === category);
}

export function getRelatedArticles(article: IssueArticle): IssueArticle[] {
  return article.relatedArticles.map((id) => getArticleById(id)).filter((item): item is IssueArticle => Boolean(item));
}

// Deliberately narrow: title/category/tags/symptoms/quickChecks are the curated
// "what is this issue" fields. Layers, system paths, commands, and escalation
// notes reuse a lot of generic troubleshooting phrasing across articles (e.g.
// "check power", "compare with a known-good device"), so including them in
// ranking causes unrelated articles to match on incidental shared words.
function toTopicHaystack(article: IssueArticle) {
  return [article.title, article.category, ...article.tags, ...article.symptoms, ...article.quickChecks]
    .join(" ")
    .toLowerCase();
}

export function rankArticles(query: string, limit = 5): IssueArticle[] {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2);

  if (!terms.length) return [];

  return issueArticles
    .map((article) => {
      const haystack = toTopicHaystack(article);
      const hits = terms.filter((term) => haystack.includes(term)).length;
      return { article, hits, coverage: hits / terms.length };
    })
    // Require most of the query to actually show up in the article's core topic —
    // filters out noise from a word or two shared with an unrelated issue.
    .filter((entry) => entry.hits > 0 && entry.coverage >= 0.5)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((entry) => entry.article);
}

export type BestMatch = {
  article: IssueArticle;
  likelyLayers: string[];
  firstQuestion: string;
  others: IssueArticle[];
};

export function computeBestMatch(query: string): BestMatch | null {
  const ranked = rankArticles(query, 6);

  if (!ranked.length) return null;

  const [best, ...others] = ranked;

  return {
    article: best,
    likelyLayers: best.layers.slice(0, 3).map((layer) => layer.name),
    firstQuestion: best.quickChecks[0] ?? best.symptoms[0] ?? "What is the exact error or symptom?",
    others
  };
}
