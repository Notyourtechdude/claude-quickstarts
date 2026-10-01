// Tiny static server so ES modules, fonts and JSON load over http (file:// blocks module imports).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".wav": "audio/wav", ".svg": "image/svg+xml", ".css": "text/css" };

export function serve(port = 0) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(port, "127.0.0.1", () => resolve({ srv, url: `http://127.0.0.1:${srv.address().port}/index.html` }));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await serve(+(process.argv[2] || 8123));
  console.log(`serving ${url}  (append ?play or ?t=12.5)`);
}
