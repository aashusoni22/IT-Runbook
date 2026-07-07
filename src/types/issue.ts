export type IssueCategory =
  | "Payment/POS"
  | "Printer"
  | "Outlook/Email"
  | "Teams/Microsoft 365"
  | "MFA/Login"
  | "Wi-Fi/Network"
  | "Laptop/Device"
  | "New User Setup";

export type IssueLayer = {
  name: string;
  checks: string[];
};

export type SystemPath = {
  platform: string;
  path: string;
  notes?: string[];
};

export type IssueArticle = {
  id: string;
  title: string;
  category: IssueCategory;
  symptoms: string[];
  quickChecks: string[];
  layers: IssueLayer[];
  systemPaths: SystemPath[];
  commands: string[];
  escalationTriggers: string[];
  ticketTemplate: string;
  relatedArticles: string[];
  youtubeSearches: string[];
  tags: string[];
};
