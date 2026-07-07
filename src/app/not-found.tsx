import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[60dvh] place-items-center text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <p className="text-sm text-muted-foreground">That KB article is not available.</p>
        <Button asChild>
          <Link href="/search">Search the KB</Link>
        </Button>
      </div>
    </div>
  );
}
