import { Hono } from "hono";
import { sign } from "hono/jwt";
import { User, CloudflareBindings, CustomContext } from "../types";

export const auth = new Hono<{
  Bindings: CloudflareBindings;
  Variables: CustomContext["Variables"];
}>();

// Updated login endpoint 
auth.post("/login", async (c) => {
  try {
    const db = c.get("db");
    const { email, password } = await c.req.json();
    const collection = db.collection<User>("users");

    const user = await collection.findOne({ email });

    if (!user || user.password !== password) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const pay = {
      email: user.email,
      id: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // 15 days
    };

    const token = await sign(pay, c.env.JWT_SECRET!);
    return c.json({ token });
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
