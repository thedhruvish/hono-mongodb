import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { User, CloudflareBindings, CustomContext } from "../types";

export const users = new Hono<{
  Bindings: CloudflareBindings;
  Variables: CustomContext["Variables"];
}>();

users.get("/", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<User>("users");
    const users = await collection.find().toArray();
    return c.json(users);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

users.post("/", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<User>("users");
    const user = await c.req.json<User>();

    if (!user.name || !user.email || !user.password) {
      return c.json({ error: "Missing required fields" }, 422);
    }

    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }
    const result = await collection.insertOne(user);
    return c.json({
      success: true,
      id: result.insertedId,
    });
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

users.get("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<User>("users");
    const id = c.req.param("id");

    if (!ObjectId.isValid(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }

    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user ? c.json(user) : c.json({ error: "User not found" }, 404);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

users.put("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<User>("users");
    const id = c.req.param("id");
    
    if (!ObjectId.isValid(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    
    const update = await c.req.json();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

users.delete("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<User>("users");
    const id = c.req.param("id");
    
    if (!ObjectId.isValid(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});