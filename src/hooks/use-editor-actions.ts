import { useCallback, type RefObject } from "react";

type Action = {
  label: string;
  shortcutLabel?: string;
  execute: () => void;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  onChange: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end) || "text";
  const newText = text.slice(0, start) + before + selected + after + text.slice(end);
  onChange(newText);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  });
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  insert: string,
  onChange: (v: string) => void,
  cursorOffset?: number,
) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const newText = text.slice(0, start) + insert + text.slice(start);
  onChange(newText);
  const pos = cursorOffset !== undefined ? start + cursorOffset : start + insert.length;
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = pos;
    textarea.selectionEnd = pos;
  });
}

function prefixLine(
  textarea: HTMLTextAreaElement,
  prefix: string,
  onChange: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  onChange(newText);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length;
  });
}

export function useEditorActions(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  onChange: (v: string) => void,
): Record<string, Action> {
  const getTA = useCallback(() => textareaRef.current, [textareaRef]);

  return {
    bold: {
      label: "Bold",
      shortcutLabel: "Ctrl+B",
      execute: () => {
        const ta = getTA();
        if (ta) wrapSelection(ta, "**", "**", onChange);
      },
    },
    italic: {
      label: "Italic",
      shortcutLabel: "Ctrl+I",
      execute: () => {
        const ta = getTA();
        if (ta) wrapSelection(ta, "_", "_", onChange);
      },
    },
    strikethrough: {
      label: "Strikethrough",
      shortcutLabel: "Ctrl+Shift+X",
      execute: () => {
        const ta = getTA();
        if (ta) wrapSelection(ta, "~~", "~~", onChange);
      },
    },
    inlineCode: {
      label: "Inline Code",
      shortcutLabel: "Ctrl+E",
      execute: () => {
        const ta = getTA();
        if (ta) wrapSelection(ta, "`", "`", onChange);
      },
    },
    codeBlock: {
      label: "Code Block",
      shortcutLabel: "Ctrl+Shift+K",
      execute: () => {
        const ta = getTA();
        if (ta) wrapSelection(ta, "```\n", "\n```", onChange);
      },
    },
    h1: {
      label: "Heading 1",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "# ", onChange);
      },
    },
    h2: {
      label: "Heading 2",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "## ", onChange);
      },
    },
    h3: {
      label: "Heading 3",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "### ", onChange);
      },
    },
    bulletList: {
      label: "Bullet List",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "- ", onChange);
      },
    },
    numberedList: {
      label: "Numbered List",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "1. ", onChange);
      },
    },
    taskList: {
      label: "Task List",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "- [ ] ", onChange);
      },
    },
    blockquote: {
      label: "Blockquote",
      execute: () => {
        const ta = getTA();
        if (ta) prefixLine(ta, "> ", onChange);
      },
    },
    link: {
      label: "Link",
      shortcutLabel: "Ctrl+K",
      execute: () => {
        const ta = getTA();
        if (ta) {
          const selected = ta.value.slice(ta.selectionStart, ta.selectionEnd) || "link text";
          wrapSelection(ta, "[", "](url)", onChange);
        }
      },
    },
    image: {
      label: "Image",
      execute: () => {
        const ta = getTA();
        if (ta) insertAtCursor(ta, "![alt text](url)", onChange, 2);
      },
    },
    horizontalRule: {
      label: "Horizontal Rule",
      execute: () => {
        const ta = getTA();
        if (ta) insertAtCursor(ta, "\n---\n", onChange);
      },
    },
    table: {
      label: "Table",
      execute: () => {
        const ta = getTA();
        if (ta)
          insertAtCursor(
            ta,
            "\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n",
            onChange,
          );
      },
    },
  };
}
