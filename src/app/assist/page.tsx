import { SmartAssist } from "@/components/smart-assist";

export default function AssistPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Assist</h1>
        <p className="text-sm text-muted-foreground">
          Describe what you&apos;re seeing. The assistant grounds its answer in the KB when it can, and flags urgency
          so you know how fast to move.
        </p>
      </div>
      <SmartAssist autoFocus />
    </div>
  );
}
