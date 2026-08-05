import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
  source: string;
}

export function MarkdownPreview({ source }: Props) {
  if (!source.trim()) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-muted-foreground/40">
        <div className="text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm font-medium">Preview will appear here</p>
          <p className="text-xs mt-1">Start typing markdown on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-body h-full overflow-auto p-6 animate-in fade-in duration-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
