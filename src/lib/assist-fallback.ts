import type { KbArticle } from "@/types/kb";
import type { AssistResult, Urgency } from "@/types/assist";

export function heuristicUrgency(text: string): Urgency {
  const value = text.toLowerCase();

  if (/(guest safety|emergency|911|fire alarm|security breach|entire property|whole hotel|all rooms|property[- ]wide)/.test(value)) {
    return "critical";
  }

  if (/(front desk|pms|check-in|check-out|multiple rooms|security camera|door lock|payment|pos terminal|whole floor)/.test(value)) {
    return "high";
  }

  if (/(one room|single guest|one device|one workstation|minor|cosmetic|slow)/.test(value)) {
    return "low";
  }

  return "medium";
}

const genericTicketTemplate = `Issue:
Location:
Affected device/system:
Scope: one device / one area / whole property
Steps already tried:
Command results if any:
Visible error:
Time started:
Business impact:
Escalation requested:`;

export function buildLocalAssistResult(issue: string, bestMatch: KbArticle | undefined): AssistResult {
  if (bestMatch) {
    return {
      urgency: heuristicUrgency(`${issue} ${bestMatch.category} ${bestMatch.impact ?? ""}`),
      headline: bestMatch.title,
      likely_cause: bestMatch.beginner_summary ?? bestMatch.impact ?? "Based on the closest matching KB article.",
      quick_fix: bestMatch.quick_fix,
      steps: bestMatch.steps,
      commands: bestMatch.commands,
      escalate_when: bestMatch.escalation_notes,
      ticket_template: bestMatch.ticket_template || genericTicketTemplate,
      grounded_in_kb: true
    };
  }

  return {
    urgency: heuristicUrgency(issue),
    headline: issue.length > 90 ? `${issue.slice(0, 87)}...` : issue,
    likely_cause: "No exact KB match yet. Start with the physical layer, then network, then application.",
    quick_fix:
      "Confirm power, cable, and input/source first. Compare with a known-good device before touching settings.",
    steps: [
      "Confirm the exact location and business impact.",
      "Check the physical layer: power, cables, link lights, paper, battery, or input/source.",
      "Compare with a nearby known-good device or workstation.",
      "Restart only the affected device or app if it is safe for operations.",
      "Check network basics: connected, IP address present, DNS works, vendor service reachable.",
      "Check the application layer: correct app, signed-in state, queue/status page.",
      "Test again and record what changed.",
      "Escalate if multiple devices/areas are affected or guest safety/payments are involved."
    ],
    commands: ["ipconfig /all", "ping 8.8.8.8", "nslookup example.com"],
    escalate_when:
      "Escalate if the issue affects multiple rooms/areas, guest safety, payment systems, or keeps returning after a basic fix.",
    ticket_template: genericTicketTemplate,
    grounded_in_kb: false
  };
}
