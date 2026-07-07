export type AiResult = {
  likelyCauses: string[];
  topChecks: string[];
  commandsOrSettings: string[];
  doNotTouch: string[];
  whenToEscalate: string;
  ticketNote: string;
};

export type AiMatch = {
  id: string;
  title: string;
  category: string;
};

export type AiResponse = {
  result: AiResult;
  matches: AiMatch[];
  warning?: string;
};
