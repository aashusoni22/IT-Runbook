import { createClient } from "@supabase/supabase-js";
import type { KbArticle, KbArticleInsert } from "@/types/kb";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceKey ?? supabaseAnonKey, {
    auth: { persistSession: false }
  });
}

export async function listArticles(limit = 20) {
  if (!isSupabaseConfigured) {
    return [] as KbArticle[];
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("kb_articles")
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as KbArticle[];
}

export async function searchArticles(query: string) {
  if (!isSupabaseConfigured) {
    return [] as KbArticle[];
  }

  const safeQuery = query.trim();

  if (!safeQuery) {
    return listArticles(30);
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("kb_articles")
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error(error);
    return [];
  }

  const normalizedQuery = safeQuery.toLowerCase();
  return ((data ?? []) as KbArticle[]).filter((article) => {
    const searchableText = [
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

    return searchableText.includes(normalizedQuery);
  });
}

export async function getArticle(id: string) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("kb_articles").select("*").eq("id", id).single();

  if (error) {
    console.error(error);
    return null;
  }

  return data as KbArticle;
}

export async function createArticle(article: KbArticleInsert) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("kb_articles").insert(article).select("*").single();

  if (error) {
    throw error;
  }

  return data as KbArticle;
}
