import type { IssueArticle } from "@/types/issue";
import type { AiResult } from "@/types/ai";

const doNotTouchDefaults = [
  "Do not request or write down guest data, payment card data, passwords, room numbers, internal IPs, server names, or confidential company data."
];

export function buildLocalAiResult(issue: string, bestMatch: IssueArticle | undefined): AiResult {
  if (bestMatch) {
    return {
      likelyCauses: bestMatch.symptoms.slice(0, 3),
      topChecks: bestMatch.quickChecks.slice(0, 5),
      commandsOrSettings: bestMatch.commands.slice(0, 5),
      doNotTouch: doNotTouchDefaults,
      whenToEscalate: bestMatch.escalationTriggers[0] ?? "Escalate if the issue affects multiple people or systems.",
      ticketNote: bestMatch.ticketTemplate
    };
  }

  return {
    likelyCauses: [
      "Not enough of a KB match yet — treat this as a general layer-by-layer check.",
      `Reported: ${issue}`
    ],
    topChecks: [
      "Confirm exact location and business impact.",
      "Check power, cables, and physical connections.",
      "Compare with a known-good device.",
      "Check basic network connectivity.",
      "Restart only the affected device or app if safe."
    ],
    commandsOrSettings: ["ipconfig /all", "ping 8.8.8.8"],
    doNotTouch: doNotTouchDefaults,
    whenToEscalate: "Escalate if multiple devices/areas are affected, or guest safety/payments are involved.",
    ticketNote:
      "Issue:\nLocation:\nAffected device/system:\nScope: one device / one area / whole property\nSteps already tried:\nVisible error:\nTime started:\nBusiness impact:"
  };
}
