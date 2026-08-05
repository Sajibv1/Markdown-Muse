import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link2,
  Image,
  Minus,
  Table,
  Braces,
} from "lucide-react";

interface Props {
  actions: Record<string, { label: string; shortcutLabel?: string; execute: () => void }>;
}

const GROUPS = [
  [
    { id: "bold", icon: Bold },
    { id: "italic", icon: Italic },
    { id: "strikethrough", icon: Strikethrough },
  ],
  [
    { id: "h1", icon: Heading1 },
    { id: "h2", icon: Heading2 },
    { id: "h3", icon: Heading3 },
  ],
  [
    { id: "bulletList", icon: List },
    { id: "numberedList", icon: ListOrdered },
    { id: "taskList", icon: ListChecks },
  ],
  [
    { id: "inlineCode", icon: Code },
    { id: "codeBlock", icon: Braces },
    { id: "blockquote", icon: Quote },
  ],
  [
    { id: "link", icon: Link2 },
    { id: "image", icon: Image },
    { id: "horizontalRule", icon: Minus },
    { id: "table", icon: Table },
  ],
];

export function FormatToolbar({ actions }: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="format-toolbar flex items-center gap-0.5 overflow-x-auto px-2 py-1.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && (
              <Separator
                orientation="vertical"
                className="mx-1.5 h-5 bg-border/50"
              />
            )}
            <div className="flex items-center gap-0.5">
              {group.map((item) => {
                const action = actions[item.id];
                if (!action) return null;
                const Icon = item.icon;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="format-btn h-7 w-7 rounded-md text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          action.execute();
                        }}
                        aria-label={action.label}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="flex items-center gap-2 bg-popover/95 backdrop-blur-lg border-border/50"
                    >
                      <span>{action.label}</span>
                      {action.shortcutLabel && (
                        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {action.shortcutLabel}
                        </kbd>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
