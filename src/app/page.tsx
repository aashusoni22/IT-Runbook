import Link from "next/link";
import {
  BedDouble,
  Camera,
  DoorOpen,
  Monitor,
  Phone,
  Plus,
  Printer,
  Router,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Tv
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SmartAssist } from "@/components/smart-assist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listArticles } from "@/lib/supabase";
import { sampleArticles } from "@/lib/sample-data";

const categories = [
  { href: "/search?q=wifi", label: "Wi-Fi", detail: "Portal, rooms, meetings", icon: Router },
  { href: "/search?q=front%20desk", label: "Front Desk", detail: "PMS, printers, check-in", icon: Monitor },
  { href: "/search?q=printer", label: "Printers", detail: "Queue, spooler, offline", icon: Printer },
  { href: "/search?q=door%20lock", label: "Door Locks", detail: "Keycards, encoders", icon: DoorOpen },
  { href: "/search?q=tv", label: "TV / Signage", detail: "IPTV, HDMI, lobby", icon: Tv },
  { href: "/search?q=camera", label: "Security", detail: "Cameras, phones, safety", icon: Camera }
];

const incidentButtons = [
  { href: "/search?q=guest%20impact", label: "Guest Impact", icon: ShieldAlert },
  { href: "/search?q=front%20desk", label: "Front Desk Down", icon: BedDouble },
  { href: "/search?q=payment", label: "Payment Issue", icon: ShieldAlert },
  { href: "/search?q=phone", label: "Safety / Phone", icon: Phone }
];

const goldenRules = [
  "Physical layer first: power, cable, input. Most fixes live here.",
  "Compare with a known-good device before changing settings.",
  "Never include guest data, payment data, or passwords in tickets.",
  "Unsure or guest safety involved? Escalate immediately, no shame in it."
];

export default async function HomePage() {
  const articles = await listArticles(20);
  const visibleArticles = articles.length ? articles : sampleArticles;
  const favorites = visibleArticles.filter((article) => article.is_favorite).slice(0, 4);
  const quickWins = visibleArticles.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge variant="accent" className="gap-1.5">
          <Sparkles className="size-3.5" />
          IT Support + Digital Innovation
        </Badge>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">What&apos;s the issue right now?</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Describe it in plain language. You&apos;ll get a triaged, step-by-step fix grounded in the property&apos;s
            knowledge base, so you can resolve it fast and move on with confidence.
          </p>
        </div>
        <SmartAssist />
      </section>

      <section className="grid grid-cols-2 gap-3">
        {incidentButtons.map((item) => (
          <Button key={item.label} asChild variant="emergency" size="lg" className="h-16 justify-start text-left">
            <Link href={item.href}>
              <item.icon className="size-5" />
              {item.label}
            </Link>
          </Button>
        ))}
      </section>

      <Card className="border-accent/30 bg-accent/10">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="size-5 text-accent" />
            New here? Keep these in mind
          </div>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {goldenRules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {rule}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Browse by area</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/articles/new">
              <Plus className="size-4" />
              Add
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="soft-shadow flex min-h-24 flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-transform active:scale-[0.98]"
            >
              <category.icon className="size-6 text-primary" />
              <span>
                <span className="block font-semibold">{category.label}</span>
                <span className="block text-xs font-medium text-muted-foreground">{category.detail}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <Star className="size-5 fill-amber-400 text-amber-500" />
          Favorites
        </h2>
        {favorites.length ? (
          <div className="space-y-3">
            {favorites.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Mark high-use fixes as favorites so they are ready during busy check-in windows.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Quick wins library</h2>
        <div className="space-y-3">
          {quickWins.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
