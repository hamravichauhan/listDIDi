import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { handleApiRequest } from "./server/api-handler.js";

const PORT = parseInt(process.env.PORT || "3001", 10);
const DIST_DIR = path.resolve(process.cwd(), "dist");
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

const server = http.createServer(async (req, res) => {
  // Handle API requests
  if (req.url?.startsWith("/api/")) {
    const handled = await handleApiRequest(req, res);
    if (handled) return;
  }

  // Handle Static files
  const cleanUrl = req.url.split("?")[0];
  let filePath = path.join(DIST_DIR, cleanUrl);

  // Check in dist first, then fallback to public
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const publicCandidate = path.join(PUBLIC_DIR, cleanUrl);
    if (fs.existsSync(publicCandidate) && !fs.statSync(publicCandidate).isDirectory()) {
      filePath = publicCandidate;
    } else {
      // SPA fallback
      filePath = path.join(DIST_DIR, "index.html");
      if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), "index.html");
      }
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    stream.pipe(res);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌿 Listening Korner server running at http://localhost:${PORT}`);
});
