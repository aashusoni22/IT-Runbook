import { NextResponse } from "next/server";
import { createArticle, isSupabaseConfigured } from "@/lib/supabase";
import type { KbArticleInsert } from "@/types/kb";

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add your Supabase environment variables first." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.category || !body?.quick_fix) {
    return NextResponse.json({ error: "Title, category, and quick fix are required." }, { status: 400 });
  }

  const article: KbArticleInsert = {
    title: String(body.title).trim(),
    category: String(body.category).trim(),
    symptoms: toStringArray(body.symptoms),
    quick_fix: String(body.quick_fix).trim(),
    steps: toStringArray(body.steps),
    commands: toStringArray(body.commands),
    escalation_notes: String(body.escalation_notes ?? "").trim(),
    ticket_template: String(body.ticket_template ?? "").trim(),
    tags: toStringArray(body.tags),
    is_favorite: Boolean(body.is_favorite)
  };

  try {
    const saved = await createArticle(article);
    return NextResponse.json(saved);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save the KB draft." }, { status: 500 });
  }
}
