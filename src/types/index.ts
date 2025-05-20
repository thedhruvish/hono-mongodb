import { ObjectId, Db } from "mongodb";

export interface CloudflareBindings {
  MONGODB_URI: string;
  JWT_SECRET: string;
  IMAGEKIT_PRIVATE_KEY: string;
}

export interface Item {
  _id?: ObjectId;
  title: string;
  description?: string;
  time: Date;
  isDelete: boolean;
  figprint?: string;
}

export interface Profile {
  bio?: string;
  avatar?: string;
}

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  profile?: Profile;
}

export type CustomContext = {
  Variables: {
    db: Db;
  };
};
