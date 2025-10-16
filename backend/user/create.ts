import { api } from "encore.dev/api";
import db from "../db";

interface CreateUserRequest {
  id: string;
  username: string;
}

interface User {
  id: string;
  username: string;
  createdAt: Date;
}

// Creates a new user.
export const create = api<CreateUserRequest, User>(
  { auth: true, expose: true, method: "POST", path: "/users" },
  async (req) => {
    const row = await db.queryRow<User>`
      INSERT INTO users (id, username, created_at)
      VALUES (${req.id}, ${req.username}, NOW())
      RETURNING id, username, created_at AS "createdAt"
    `;
    
    if (!row) {
      throw new Error("Failed to create user");
    }
    
    return row;
  }
);
