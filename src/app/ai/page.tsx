import { AiClient } from "@/components/ai-client";

type AiPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AiPage({ searchParams }: AiPageProps) {
  const { q = "" } = await searchParams;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ask AI</h1>
        <p className="text-sm text-muted-foreground">
          A fallback for when the KB doesn&apos;t have it yet. Short, practical, mobile-friendly.
        </p>
      </div>
      <AiClient initialQuery={q} />
    </div>
  );
}
