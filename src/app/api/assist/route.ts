import { NextResponse } from "next/server";
import OpenAI from "openai";
import { listArticles } from "@/lib/supabase";
import { sampleArticles } from "@/lib/sample-data";
import { rankArticles } from "@/lib/kb-search";
import { containsSensitiveData, safetyMessage } from "@/lib/safety";
import { buildLocalAssistResult } from "@/lib/assist-fallback";
import type { AssistResponse, AssistResult, Urgency } from "@/types/assist";

const urgencyValues: Urgency[] = ["low", "medium", "high", "critical"];

const responseSchema = {
  name: "hotel_it_assist_result",
  strict: true,
  schema: {
    type: "object",
    properties: {
      urgency: { type: "string", enum: urgencyValues },
      headline: { type: "string", description: "One short line naming the likely issue." },
      likely_cause: { type: "string" },
      quick_fix: { type: "string", description: "The fastest safe first thing to try." },
      steps: { type: "array", items: { type: "string" }, description: "4-8 ordered troubleshooting steps." },
      commands: { type: "array", items: { type: "string" }, description: "Optional terminal/PowerShell commands, empty array if none apply." },
      escalate_when: { type: "string" },
      ticket_template: { type: "string" },
      grounded_in_kb: { type: "boolean", description: "True only if the provided KB context was directly used." }
    },
    required: ["urgency", "headline", "likely_cause", "quick_fix", "steps", "commands", "escalate_when", "ticket_template", "grounded_in_kb"],
    additionalProperties: false
  }
} as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const issue = String(body?.issue ?? "").trim();

  if (issue.length < 8) {
    return NextResponse.json({ error: "Describe the issue in a little more detail." }, { status: 400 });
  }

  if (containsSensitiveData(issue)) {
    return NextResponse.json({ error: safetyMessage }, { status: 400 });
  }

  const allArticles = await listArticles(200);
  const pool = allArticles.length ? allArticles : sampleArticles;
  const contextMatches = rankArticles(pool, issue, 4);
  const matches = contextMatches.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    quick_fix: article.quick_fix
  }));

  if (!process.env.OPENAI_API_KEY) {
    const payload: AssistResponse = {
      result: buildLocalAssistResult(issue, contextMatches[0]),
      matches,
      source: "local",
      warning: "OpenAI API key is not configured, so a KB-grounded local answer was generated instead."
    };
    return NextResponse.json(payload);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const kbContext = contextMatches.length
    ? contextMatches
        .map(
          (article, index) =>
            `KB #${index + 1}: ${article.title} (${article.category})\nQuick fix: ${article.quick_fix}\nSteps: ${article.steps.join(" | ")}\nEscalation: ${article.escalation_notes}`
        )
        .join("\n\n")
    : "No close KB match was found. Use general hotel IT best practice.";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a calm, senior hotel IT support mentor helping a brand-new IT support and digital innovation analyst at a luxury hotel resolve issues quickly and correctly during live operations. Ground your answer in the provided KB context when it is relevant, and set grounded_in_kb to true only in that case. Classify urgency using: critical = guest safety, security, or property-wide/payment-wide outage; high = front desk/PMS/POS/door lock/multiple rooms affected; medium = single device or small-area impact; low = cosmetic or single workstation issue. Keep steps short, beginner-friendly, and action-oriented. Never request or repeat guest data, payment data, passwords, internal IPs, server names, or confidential company data. If escalation is needed, describe what non-sensitive facts to capture."
        },
        {
          role: "user",
          content: `Hotel IT issue reported by the tech: "${issue}"\n\nRelevant knowledge base context:\n${kbContext}`
        }
      ],
      response_format: { type: "json_schema", json_schema: responseSchema }
    });

    const raw = response.choices[0]?.message.content;

    if (!raw) {
      throw new Error("AI did not return an answer.");
    }

    const result = JSON.parse(raw) as AssistResult;
    const payload: AssistResponse = { result, matches, source: "ai" };
    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    const status =
      typeof error === "object" && error !== null && "status" in error && typeof error.status === "number"
        ? error.status
        : 500;
    const code =
      typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
        ? error.code
        : "";

    let warning = "Could not reach OpenAI. A KB-grounded local answer was generated instead.";
    if (status === 401) {
      warning = "OpenAI rejected the API key. A KB-grounded local answer was generated instead. Check OPENAI_API_KEY.";
    } else if (status === 403) {
      warning = "OpenAI access is forbidden for this key/project. A KB-grounded local answer was generated instead.";
    } else if (status === 429 || code === "insufficient_quota") {
      warning = "OpenAI quota or billing is unavailable. A KB-grounded local answer was generated instead.";
    }

    const payload: AssistResponse = {
      result: buildLocalAssistResult(issue, contextMatches[0]),
      matches,
      source: "local",
      warning
    };
    return NextResponse.json(payload);
  }
}
