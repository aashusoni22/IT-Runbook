"use client";

import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Checklist({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = items.length;
  const done = useMemo(() => items.filter((item) => checked[item]).length, [checked, items]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-primary" />
            {title}
          </CardTitle>
          <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-semibold">
            {done}/{total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: total ? `${(done / total) * 100}%` : "0%" }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex min-h-14 items-start gap-3 rounded-xl border bg-background p-3 text-sm leading-6 active:bg-secondary"
          >
            <input
              type="checkbox"
              checked={Boolean(checked[item])}
              onChange={(event) => setChecked((current) => ({ ...current, [item]: event.target.checked }))}
              className="mt-1 size-5 shrink-0 accent-primary"
            />
            <span className={checked[item] ? "text-muted-foreground line-through" : ""}>{item}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
