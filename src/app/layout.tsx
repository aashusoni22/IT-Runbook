import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Compass } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "IT Floor Assistant",
  description: "A calm, step-by-step troubleshooting coach for hotel IT support on the floor."
};

export const viewport: Viewport = {
  themeColor: "#12203a",
  width: "device-width",
  initialScale: 1
};

const noFlashScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Compass className="size-5" />
                </span>
                <span>IT Floor Assistant</span>
              </Link>
              <div className="flex items-center gap-2">
                <DesktopNav />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-8">{children}</main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
