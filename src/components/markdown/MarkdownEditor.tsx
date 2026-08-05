import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import { useEditorActions } from "@/hooks/use-editor-actions";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { FormatToolbar } from "./FormatToolbar";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const actions = useEditorActions(textareaRef, onChange);

  const shortcuts = useMemo(
    () => ({
      "ctrl+b": actions.bold.execute,
      "ctrl+i": actions.italic.execute,
      "ctrl+k": actions.link.execute,
      "ctrl+e": actions.inlineCode.execute,
      "ctrl+shift+x": actions.strikethrough.execute,
      "ctrl+shift+k": actions.codeBlock.execute,
    }),
    [actions],
  );

  useKeyboardShortcuts(textareaRef, shortcuts);

  const lineCount = useMemo(() => {
    return value.split("\n").length;
  }, [value]);

  const updateCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.slice(0, pos);
    const line = textBefore.split("\n").length;
    const col = pos - textBefore.lastIndexOf("\n");
    setCursorLine(line);
    setCursorCol(col);
  }, []);

  // Sync line numbers scroll with textarea scroll
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Handle tab key for indentation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;

        if (e.shiftKey) {
          // Outdent: remove leading two spaces from current line
          const text = ta.value;
          const lineStart = text.lastIndexOf("\n", start - 1) + 1;
          const lineText = text.slice(lineStart);
          if (lineText.startsWith("  ")) {
            const newText = text.slice(0, lineStart) + lineText.slice(2);
            onChange(newText);
            requestAnimationFrame(() => {
              ta.selectionStart = Math.max(lineStart, start - 2);
              ta.selectionEnd = Math.max(lineStart, end - 2);
            });
          }
        } else {
          // Indent: insert two spaces
          const newText = ta.value.slice(0, start) + "  " + ta.value.slice(end);
          onChange(newText);
          requestAnimationFrame(() => {
            ta.selectionStart = start + 2;
            ta.selectionEnd = start + 2;
          });
        }
      }
    },
    [onChange],
  );

  // Auto-close brackets and quotes
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange],
  );

  return (
    <div className="editor-container flex h-full flex-col">
      {/* Format toolbar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <FormatToolbar actions={actions} />
      </div>

      {/* Editor area with line numbers */}
      <div className="relative flex min-h-0 flex-1">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="line-numbers hidden select-none overflow-hidden border-r border-border/30 bg-muted/30 px-3 py-4 text-right font-mono text-xs leading-relaxed text-muted-foreground/50 sm:block"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i + 1}
              className={`transition-colors duration-150 ${
                cursorLine === i + 1 ? "text-primary font-medium" : ""
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursorPos}
          onClick={updateCursorPos}
          spellCheck={false}
          placeholder="# Start writing your markdown here..."
          className="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Status bar */}
      <div className="editor-status flex items-center justify-between border-t border-border/30 bg-muted/20 px-3 py-1 text-[11px] text-muted-foreground/60">
        <span>
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span>Markdown</span>
      </div>
    </div>
  );
}
