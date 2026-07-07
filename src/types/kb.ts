export type KbArticle = {
  id: string;
  title: string;
  category: string;
  impact?: string;
  beginner_summary?: string;
  estimated_time?: string;
  equipment?: string[];
  symptoms: string[];
  quick_fix: string;
  steps: string[];
  layers?: {
    name: string;
    checks: string[];
  }[];
  navigation_steps?: {
    device: string;
    path: string;
    checks: string[];
  }[];
  commands: string[];
  command_blocks?: {
    device: string;
    commands: string[];
    purpose: string;
  }[];
  escalation_notes: string;
  ticket_template: string;
  references?: {
    label: string;
    url: string;
    type: "manufacturer" | "article" | "video" | "vendor";
  }[];
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at?: string;
};

export type KbArticleInsert = Omit<KbArticle, "id" | "created_at" | "updated_at">;
