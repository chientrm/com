import type { Request, Response } from "express";
import express from "express";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trust proxy headers (needed for correct protocol detection behind Cloudflare Tunnel or reverse proxies)
app.set("trust proxy", true);

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from Chien Tran!" });
});

// Only listen if not imported as middleware (i.e., if run as entrypoint)

// Serve static files
if (import.meta.main) {
  app.use(express.static(path.join(__dirname, "dist")));
  const port = process.env.PORT ? Number(process.env.PORT) : 0;
  const server = app.listen(port, () => {
    const actualPort = (server.address() as any).port;
    console.log(`Server running at http://localhost:${actualPort}`);
  });
}

export default app;
