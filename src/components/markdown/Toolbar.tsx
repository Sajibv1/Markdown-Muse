import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Download,
  Moon,
  Sun,
  FileText,
  Upload,
  Link2,
  FileDown,
  Eye,
  Columns2,
  PenLine,
  BookOpen,
} from "lucide-react";
import type { SourceMode, ViewLayout } from "@/routes/index";

interface Props {
  mode: SourceMode;
  setMode: (m: SourceMode) => void;
  layout: ViewLayout;
  setLayout: (l: ViewLayout) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onPdf: () => void;
  onCheatSheet: () => void;
  stats: { words: number; chars: number; readingTime: number };
}

const sourceTabs: { id: SourceMode; label: string; icon: typeof FileText }[] = [
  { id: "editor", label: "Editor", icon: PenLine },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "url", label: "URL", icon: Link2 },
];

const layoutOptions: { id: ViewLayout; label: string; icon: typeof Columns2 }[] = [
  { id: "split", label: "Split View", icon: Columns2 },
  { id: "editor", label: "Editor Only", icon: PenLine },
  { id: "preview", label: "Preview Only", icon: Eye },
];

export function Toolbar({
  mode,
  setMode,
  layout,
  setLayout,
  theme,
  toggleTheme,
  onCopy,
  onDownload,
  onPdf,
  onCheatSheet,
  stats,
}: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <header className="header-toolbar flex flex-col gap-2 border-b border-border/50 bg-card/80 backdrop-blur-xl px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-2.5">
        {/* Left: Logo + Source tabs */}
        <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="logo-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="truncate text-sm font-bold tracking-tight text-foreground">
                Markdown Muse
              </span>
              <span className="hidden text-[10px] text-muted-foreground/60 sm:block">
                {stats.words} words · {stats.readingTime} min read
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="shrink-0 sm:hidden"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Center: Source mode tabs */}
        <nav className="flex items-center gap-1 self-stretch rounded-lg bg-muted/50 p-1 sm:self-auto">
          {sourceTabs.map((t) => {
            const Icon = t.icon;
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:flex-none ${
                  active
                    ? "bg-background text-foreground shadow-sm shadow-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Layout + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Layout toggle (desktop only) */}
          <div className="hidden items-center gap-0.5 rounded-lg bg-muted/50 p-0.5 md:flex">
            {layoutOptions.map((opt) => {
              const Icon = opt.icon;
              const active = layout === opt.id;
              return (
                <Tooltip key={opt.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setLayout(opt.id)}
                      className={`rounded-md p-1.5 transition-all duration-200 ${
                        active
                          ? "bg-background text-foreground shadow-sm shadow-black/5"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label={opt.label}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{opt.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onCopy} className="flex-1 sm:flex-none">
                <Copy className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Copy markdown to clipboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">HTML</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export as HTML file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onPdf} className="flex-1 sm:flex-none">
                <FileDown className="h-4 w-4" />
                <span className="hidden xs:inline sm:inline">PDF</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Save as PDF (via print)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCheatSheet}
                aria-label="Markdown cheat sheet"
                className="hidden sm:inline-flex"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Markdown cheat sheet</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="hidden sm:inline-flex"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
