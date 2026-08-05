export function buildStandaloneHtml(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css" />
<style>
  :root { color-scheme: light; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; max-width: 760px; margin: 2.5rem auto; padding: 0 1.25rem; line-height: 1.65; color: #1a1a1a; }
  h1,h2,h3,h4 { line-height: 1.25; margin-top: 2rem; }
  h1 { font-size: 2rem; border-bottom: 1px solid #eee; padding-bottom: .3rem; }
  h2 { font-size: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: .3rem; }
  a { color: #2563eb; }
  code { background: #f3f4f6; padding: .15rem .35rem; border-radius: 4px; font-size: .9em; }
  pre { background: #f6f8fa; padding: 1rem; border-radius: 8px; overflow: auto; }
  pre code { background: transparent; padding: 0; }
  blockquote { border-left: 4px solid #d1d5db; color: #4b5563; padding: .25rem 1rem; margin: 1rem 0; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e5e7eb; padding: .5rem .75rem; }
  th { background: #f9fafb; }
  img { max-width: 100%; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
  ul.contains-task-list { list-style: none; padding-left: 1rem; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Opens a hidden iframe containing the standalone HTML and triggers the print
 * dialog. The user picks "Save as PDF" as the destination. Works in all modern
 * browsers without any heavy client-side PDF library.
 */
export function exportPdf(title: string, bodyHtml: string) {
  const html = buildStandaloneHtml(title, bodyHtml);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const cleanup = () => {
    setTimeout(() => iframe.remove(), 1000);
  };

  iframe.onload = () => {
    try {
      const win = iframe.contentWindow;
      if (!win) return cleanup();
      win.focus();
      win.print();
      // Some browsers fire afterprint on the iframe window
      win.addEventListener("afterprint", cleanup, { once: true });
      // Fallback cleanup
      setTimeout(cleanup, 60_000);
    } catch {
      cleanup();
    }
  };

  iframe.srcdoc = html;
}
