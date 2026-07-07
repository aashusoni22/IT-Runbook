import { NextResponse } from "next/server";
import OpenAI from "openai";
import { rankArticles } from "@/lib/kb";
import { containsSensitiveData, safetyMessage } from "@/lib/safety";
import { buildLocalAiResult } from "@/lib/ai-fallback";
import type { AiResponse, AiResult } from "@/types/ai";

const responseSchema = {
  name: "it_floor_assistant_result",
  strict: true,
  schema: {
    type: "object",
    properties: {
      likelyCauses: { type: "array", items: { type: "string" }, description: "2-4 likely causes." },
      topChecks: { type: "array", items: { type: "string" }, description: "Max 5 short, practical checks." },
      commandsOrSettings: { type: "array", items: { type: "string" }, description: "Commands or settings to check, empty array if none apply." },
      doNotTouch: { type: "array", items: { type: "string" }, description: "Things not to touch or ask for." },
      whenToEscalate: { type: "string" },
      ticketNote: { type: "string" }
    },
    required: ["likelyCauses", "topChecks", "commandsOrSettings", "doNotTouch", "whenToEscalate", "ticketNote"],
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

  const contextMatches = rankArticles(issue, 3);
  const matches = contextMatches.map((article) => ({ id: article.id, title: article.title, category: article.category }));

  if (!process.env.OPENAI_API_KEY) {
    const payload: AiResponse = {
      result: buildLocalAiResult(issue, contextMatches[0]),
      matches,
      warning: "OpenAI API key is not configured, so a KB-grounded local answer was generated instead."
    };
    return NextResponse.json(payload);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const kbContext = contextMatches.length
    ? contextMatches
        .map(
          (article, index) =>
            `KB #${index + 1}: ${article.title} (${article.category})\nQuick checks: ${article.quickChecks.join(" | ")}\nEscalate when: ${article.escalationTriggers.join(" | ")}`
        )
        .join("\n\n")
    : "No close KB match was found. Use general hotel/corporate IT best practice.";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a calm IT floor assistant coach helping a solo hotel IT support technician resolve issues quickly while walking the property. Ground your answer in the provided KB context when relevant. Keep every item short, practical, and mobile-friendly — no long paragraphs. topChecks must have at most 5 items. Never ask for or suggest writing down guest data, payment card data, passwords, room numbers, internal IPs, server names, or confidential company data — list this restriction in doNotTouch."
        },
        {
          role: "user",
          content: `IT issue reported by the technician: "${issue}"\n\nRelevant knowledge base context:\n${kbContext}`
        }
      ],
      response_format: { type: "json_schema", json_schema: responseSchema }
    });

    const raw = response.choices[0]?.message.content;

    if (!raw) {
      throw new Error("AI did not return an answer.");
    }

    const result = JSON.parse(raw) as AiResult;
    const payload: AiResponse = { result, matches };
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

    const payload: AiResponse = {
      result: buildLocalAiResult(issue, contextMatches[0]),
      matches,
      warning
    };
    return NextResponse.json(payload);
  }
}
