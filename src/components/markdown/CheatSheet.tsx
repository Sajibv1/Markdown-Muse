import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS = [
  {
    title: "Text Formatting",
    items: [
      { syntax: "**bold**", result: "bold", shortcut: "Ctrl+B" },
      { syntax: "_italic_", result: "italic", shortcut: "Ctrl+I" },
      { syntax: "~~strikethrough~~", result: "strikethrough", shortcut: "Ctrl+Shift+X" },
      { syntax: "`inline code`", result: "inline code", shortcut: "Ctrl+E" },
    ],
  },
  {
    title: "Headings",
    items: [
      { syntax: "# Heading 1", result: "Heading 1" },
      { syntax: "## Heading 2", result: "Heading 2" },
      { syntax: "### Heading 3", result: "Heading 3" },
    ],
  },
  {
    title: "Lists",
    items: [
      { syntax: "- item", result: "Bullet list" },
      { syntax: "1. item", result: "Numbered list" },
      { syntax: "- [ ] task", result: "Task list" },
    ],
  },
  {
    title: "Links & Media",
    items: [
      { syntax: "[text](url)", result: "Link", shortcut: "Ctrl+K" },
      { syntax: "![alt](url)", result: "Image" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { syntax: "> quote", result: "Blockquote" },
      { syntax: "```code```", result: "Code block", shortcut: "Ctrl+Shift+K" },
      { syntax: "---", result: "Horizontal rule" },
    ],
  },
  {
    title: "Tables",
    items: [
      {
        syntax: "| H1 | H2 |\n| --- | --- |\n| C1 | C2 |",
        result: "Table",
      },
    ],
  },
];

export function CheatSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] sm:w-[420px] bg-card/95 backdrop-blur-xl border-border/50">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Markdown Cheat Sheet
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <code className="flex-1 text-xs font-mono bg-muted/50 rounded px-2 py-1.5 text-foreground/80 whitespace-pre-wrap break-all">
                        {item.syntax}
                      </code>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <span className="text-xs text-muted-foreground">{item.result}</span>
                        {item.shortcut && (
                          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground/70">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
