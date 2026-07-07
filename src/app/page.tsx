"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  CreditCard,
  KeyRound,
  Laptop,
  Mail,
  MessagesSquare,
  Printer,
  Search,
  Sparkles,
  UserPlus,
  Wifi
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categoryOrder, categorySlug } from "@/lib/kb";
import type { IssueCategory } from "@/types/issue";

const categoryIcons: Record<IssueCategory, typeof Printer> = {
  "Payment/POS": CreditCard,
  Printer: Printer,
  "Outlook/Email": Mail,
  "Teams/Microsoft 365": MessagesSquare,
  "MFA/Login": KeyRound,
  "Wi-Fi/Network": Wifi,
  "Laptop/Device": Laptop,
  "New User Setup": UserPlus
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-14 pl-10 text-base"
            placeholder="What's happening? e.g. printer offline"
            aria-label="Search the knowledge base"
          />
        </div>
        <Button type="submit" size="lg">
          Go
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-3">
        {categoryOrder.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <Link
              key={category}
              href={`/category/${categorySlug(category)}`}
              className="soft-shadow flex min-h-24 flex-col justify-between rounded-xl border border-border/70 bg-card p-4 transition-transform active:scale-[0.97]"
            >
              <Icon className="size-7 text-primary" />
              <span className="text-base font-semibold leading-tight">{category}</span>
            </Link>
          );
        })}
        <Link
          href="/ai"
          className="glow-ring flex min-h-24 flex-col justify-between rounded-xl border border-primary/30 bg-primary p-4 text-primary-foreground transition-transform active:scale-[0.97]"
        >
          <Sparkles className="size-7" />
          <span className="text-base font-semibold leading-tight">Ask AI</span>
        </Link>
      </div>
    </div>
  );
}
