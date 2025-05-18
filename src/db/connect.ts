import { MongoClient } from "mongodb";

export const createDatabaseConnection = async (uri: string) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    return {
      db: client.db("hono-db"),
      close: async () => {
        await client.close();
        console.log("Connection closed");
      },
    };
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
};
