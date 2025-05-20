import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { CloudflareBindings, CustomContext } from "./types";
import { createDatabaseConnection } from "./db/connect";
import { items } from "./routes/items";
import { users } from "./routes/users";
import { auth } from "./routes/auth";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: CustomContext["Variables"];
}>();

// Add CORS middleware
app.use(
  "*",
  cors({
    origin: ["*"], // Update this array with specific domains in production
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "*"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Database middleware
app.use("*", async (c, next) => {
  let connection;
  try {
    connection = await createDatabaseConnection(c.env.MONGODB_URI);
    c.set("db", connection.db);
    await next();
  } catch (error) {
    return c.json({ error: "Database connection failed" }, 500);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});
// Auth routes
app.route("/auth", auth);

// JWT middleware for protected routes
app.use("/", (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

// status route and db connection test
app.get("/", (c) => {
  const db = c.get("db");
  if (!db) {
    return c.json({ error: "Database connection failed" }, 500);
  }

  return c.json({
    status: "ok",
  });
});

// Register routes
app.route("/users", users);
app.route("/items", items);


// other routes
// 404 route
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// error handling global
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
