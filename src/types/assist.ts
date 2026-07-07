export type Urgency = "low" | "medium" | "high" | "critical";

export type AssistResult = {
  urgency: Urgency;
  headline: string;
  likely_cause: string;
  quick_fix: string;
  steps: string[];
  commands: string[];
  escalate_when: string;
  ticket_template: string;
  grounded_in_kb: boolean;
};

export type AssistArticleMatch = {
  id: string;
  title: string;
  category: string;
  quick_fix: string;
};

export type AssistResponse = {
  result: AssistResult;
  matches: AssistArticleMatch[];
  source: "ai" | "local";
  warning?: string;
};
