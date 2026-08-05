import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  onLoad: (text: string, filename: string) => void;
}

export function FileDrop({ onLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    const text = await file.text();
    onLoad(text, file.name);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex h-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${
        dragging ? "border-primary bg-accent" : "border-border bg-background hover:bg-accent/40"
      }`}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <div className="text-sm font-medium text-foreground">
        Drop a .md file here, or click to browse
      </div>
      <div className="text-xs text-muted-foreground">Accepts .md, .markdown, .txt</div>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
