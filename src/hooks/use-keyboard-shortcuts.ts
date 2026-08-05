import { useEffect, type RefObject } from "react";

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  shortcuts: ShortcutMap,
) {
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    const handler = (e: KeyboardEvent) => {
      const key = buildKey(e);
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    ta.addEventListener("keydown", handler);
    return () => ta.removeEventListener("keydown", handler);
  }, [textareaRef, shortcuts]);
}

function buildKey(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push("ctrl");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}
