import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { Item, CloudflareBindings, CustomContext } from "../types";

export const items = new Hono<{
  Bindings: CloudflareBindings;
  Variables: CustomContext["Variables"];
}>();

items.get("/", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<Item>("items");
    const showAll = c.req.query("showall") === "true";
    
    const query = showAll ? {} : { isDelete: false };
    
    const items = await collection.find(query)
      .sort({ time: -1 })
      .toArray();
      
    return c.json(items);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

items.post("/", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<Item>("items");
    const itemData = await c.req.json<Item>();
    
    const item = {
      ...itemData,
      time: new Date(), // Always set current timestamp
      isDelete: itemData.isDelete ?? false
    };

    if (!item.title) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const result = await collection.insertOne(item);
    return c.json({
      success: true,
      id: result.insertedId,
      timestamp: item.time
    });
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});



items.get("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<Item>("items");
    const id = c.req.param("id");

    if (!ObjectId.isValid(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }

    const item = await collection.findOne({ _id: new ObjectId(id) });
    return item ? c.json(item) : c.json({ error: "Item not found" }, 404);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

items.put("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<Item>("items");
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

items.put("/:id/toggle", async (c) => {
  try {
    console.log("ok")
    const db = c.get("db");
    const collection = db.collection<Item>("items");
    const id = c.req.param("id");
    
    if (!ObjectId.isValid(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      [ { $set: { isDelete: { $not: "$isDelete" } } } ],
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return c.json({ error: "Item not found" }, 404);
    }
    
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

items.delete("/:id", async (c) => {
  try {
    const db = c.get("db");
    const collection = db.collection<Item>("items");
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
