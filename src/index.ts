import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDatabaseConnection } from "./db/connect";
import { items } from "./routes/items";
import { CloudflareBindings, CustomContext } from "./types";
import { users } from "./routes/users";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: CustomContext["Variables"];
}>();

// Add CORS middleware
app.use('*', cors({
  origin: ['*'], // Update this array with specific domains in production
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', '*'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Database middleware
app.use('*', async (c, next) => {
  let connection;
  try {
    connection = await createDatabaseConnection(c.env.MONGODB_URI);
    c.set('db', connection.db);
    await next();
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// status route and db connection test
app.get("/", (c) => {
  const db = c.get("db");
  if (!db) {
    return c.json({ error: "Database connection failed" }, 500);
  }
  
  return c.json({ status: "ok" });
});

// Register routes
app.route("/items", items);
app.route("/users", users);

export default app;
