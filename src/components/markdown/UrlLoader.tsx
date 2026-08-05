import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  onLoad: (text: string, url: string) => void;
}

export function UrlLoader({ onLoad }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIt = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      onLoad(text, url);
      toast.success("Markdown loaded");
    } catch (e) {
      toast.error(`Failed to fetch: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10">
      <div className="text-sm font-medium text-foreground">Fetch raw markdown from a URL</div>
      <div className="flex w-full max-w-xl gap-2">
        <Input
          type="url"
          placeholder="https://raw.githubusercontent.com/.../README.md"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchIt()}
        />
        <Button onClick={fetchIt} disabled={loading}>
          {loading ? "Loading..." : "Fetch"}
        </Button>
      </div>
      <p className="max-w-xl text-center text-xs text-muted-foreground">
        The URL must respond with CORS-permitted plain text. Try raw.githubusercontent.com or
        gist.githubusercontent.com URLs.
      </p>
    </div>
  );
}
