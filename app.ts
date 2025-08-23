import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "drizzle-graphql";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./src/db/index";
import * as schema from "./src/db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Express app setup ---
const app = express();
app.use(express.json());
app.set("trust proxy", true);

// --- Apollo Server setup ---
const apolloServer = new ApolloServer(buildSchema(db));
await apolloServer.start();
app.use("/graphql", expressMiddleware(apolloServer));

// --- Server startup ---
if (import.meta.main) {
  try {
    const { pushSQLiteSchema } = await import("drizzle-kit/api");
    const { apply } = await pushSQLiteSchema(schema, db);
    await apply();
    console.log("Migrations applied successfully.");
  } catch (e) {
    console.error("Failed to run drizzle migrations:", e);
    process.exit(1);
  }
  app.use("/", express.static(path.join(__dirname, "dist")));
  const port = process.env.PORT ? Number(process.env.PORT) : 0;
  const server = app.listen(port, () => {
    const actualPort = (server.address() as any).port;
    console.log(`Server running at http://localhost:${actualPort}/`);
  });
}

export default app;
