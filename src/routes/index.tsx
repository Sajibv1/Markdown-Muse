import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTheme } from "@/hooks/use-theme";
import { Toolbar } from "@/components/markdown/Toolbar";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import { FileDrop } from "@/components/markdown/FileDrop";
import { UrlLoader } from "@/components/markdown/UrlLoader";
import { CheatSheet } from "@/components/markdown/CheatSheet";
import { buildStandaloneHtml, downloadHtml, exportPdf } from "@/lib/export-html";

export type SourceMode = "editor" | "upload" | "url";
export type ViewLayout = "split" | "editor" | "preview";

const SAMPLE = `# Welcome to Markdown Muse ✨

A beautiful, visual markdown editor that makes writing a joy. Start editing — the preview updates in real time.

## Features

- **Rich formatting toolbar** — Click buttons or use keyboard shortcuts
- **GitHub-flavored markdown** — Tables, task lists, strikethrough
- **Syntax-highlighted code** — Automatic language detection
- **Light & dark themes** — Easy on your eyes, day or night
- **Export anywhere** — HTML files, PDF, or copy to clipboard
- **Autosaved locally** — Your work is never lost

## Keyboard Shortcuts

| Action | Shortcut |
| --- | --- |
| Bold | \`Ctrl+B\` |
| Italic | \`Ctrl+I\` |
| Link | \`Ctrl+K\` |
| Inline Code | \`Ctrl+E\` |
| Strikethrough | \`Ctrl+Shift+X\` |
| Code Block | \`Ctrl+Shift+K\` |

## Code Example

\`\`\`typescript
interface User {
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You are an \${user.role}.\`;
}
\`\`\`

## Task List

- [x] Build the editor
- [x] Add formatting toolbar
- [x] Implement keyboard shortcuts
- [ ] Take over the world

> "The best way to predict the future is to create it." — Abraham Lincoln
`;

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "Markdown Muse — Visual Markdown Editor" },
      {
        name: "description",
        content:
          "A beautiful visual markdown editor with live preview, formatting toolbar, keyboard shortcuts, dark mode, and export to HTML/PDF.",
      },
      { property: "og:title", content: "Markdown Muse — Visual Markdown Editor" },
      {
        property: "og:description",
        content:
          "Write, format, and preview Markdown with a rich visual editor. GFM support, syntax highlighting, dark mode, and one-click export.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [source, setSource] = useLocalStorage<string>("md-viewer-doc", SAMPLE);
  const [mode, setMode] = useState<SourceMode>("editor");
  const [layout, setLayout] = useLocalStorage<ViewLayout>("md-viewer-layout", "split");
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const chars = source.length;
    const words = source.trim() ? source.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { chars, words, readingTime };
  }, [source]);

  const renderHtml = () => {
    return renderToStaticMarkup(
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      >
        {source}
      </ReactMarkdown>,
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      toast.success("Markdown copied to clipboard");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const handleDownload = () => {
    const title = (source.match(/^#\s+(.+)$/m)?.[1] ?? "Document").trim();
    downloadHtml(`${slug(title)}.html`, buildStandaloneHtml(title, renderHtml()));
    toast.success("Downloaded HTML");
  };

  const handlePdf = () => {
    const title = (source.match(/^#\s+(.+)$/m)?.[1] ?? "Document").trim();
    exportPdf(title, renderHtml());
    toast.message("Opening print dialog", {
      description: "Choose 'Save as PDF' as the destination.",
    });
  };

  const handleLoaded = (text: string, _name: string) => {
    setSource(text);
    setMode("editor");
    setMobilePane("edit");
    toast.success("Loaded into editor");
  };

  // Drag handle logic for resizable panes
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startWidth = dragWidth ?? containerRect.width / 2;

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(250, Math.min(containerRect.width - 250, startWidth + delta));
      setDragWidth(newWidth);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const showEditor = layout === "split" || layout === "editor";
  const showPreview = layout === "split" || layout === "preview";

  return (
    <div className="flex h-screen flex-col bg-background">
      <Toolbar
        mode={mode}
        setMode={setMode}
        layout={layout}
        setLayout={setLayout}
        theme={theme}
        toggleTheme={toggleTheme}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onPdf={handlePdf}
        onCheatSheet={() => setCheatSheetOpen(true)}
        stats={stats}
      />

      <main className="min-h-0 flex-1">
        {mode === "upload" ? (
          <FileDrop onLoad={handleLoaded} />
        ) : mode === "url" ? (
          <UrlLoader onLoad={handleLoaded} />
        ) : (
          <>
            {/* Mobile pane switcher */}
            <div className="flex items-center justify-center gap-1 border-b border-border/50 bg-muted/30 p-1 md:hidden">
              {(["edit", "preview"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setMobilePane(p)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
                    mobilePane === p
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Desktop: resizable panes */}
            <div ref={containerRef} className="relative flex h-full min-h-0">
              {/* Editor pane */}
              {showEditor && (
                <div
                  className={`min-h-0 ${
                    mobilePane === "edit" ? "block" : "hidden"
                  } md:block ${layout === "editor" ? "w-full" : ""}`}
                  style={
                    layout === "split" && dragWidth
                      ? { width: `${dragWidth}px`, flexShrink: 0 }
                      : layout === "split"
                        ? { flex: 1 }
                        : undefined
                  }
                >
                  <MarkdownEditor value={source} onChange={setSource} />
                </div>
              )}

              {/* Drag handle */}
              {layout === "split" && (
                <div
                  className="drag-handle group relative z-10 hidden w-0 cursor-col-resize items-center justify-center md:flex"
                  onMouseDown={handleDragStart}
                >
                  <div className="absolute inset-y-0 -left-[3px] -right-[3px]" />
                  <div className="h-full w-px bg-border/50 transition-colors group-hover:bg-primary/50" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-0.5">
                      <div className="h-4 w-0.5 rounded-full bg-muted-foreground/50" />
                      <div className="h-4 w-0.5 rounded-full bg-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              )}

              {/* Preview pane */}
              {showPreview && (
                <div
                  ref={previewRef}
                  className={`min-h-0 flex-1 ${
                    mobilePane === "preview" ? "block" : "hidden"
                  } md:block ${layout === "preview" ? "w-full" : ""}`}
                >
                  <MarkdownPreview source={source} />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer stats bar */}
      <footer className="footer-bar flex items-center justify-between border-t border-border/50 bg-card/50 backdrop-blur-sm px-4 py-1.5 text-[11px] text-muted-foreground/70">
        <div className="flex items-center gap-3">
          <span>{stats.words} words</span>
          <span className="text-border">·</span>
          <span>{stats.chars} characters</span>
          <span className="text-border">·</span>
          <span>{stats.readingTime} min read</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Autosaved
          </span>
        </div>
      </footer>

      {/* Cheat Sheet Panel */}
      <CheatSheet open={cheatSheetOpen} onOpenChange={setCheatSheetOpen} />

      <Toaster />
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "document";
}
