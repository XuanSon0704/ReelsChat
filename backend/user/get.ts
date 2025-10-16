import { api, APIError } from "encore.dev/api";
import db from "../db";

interface GetUserRequest {
  id: string;
}

interface User {
  id: string;
  username: string;
  createdAt: Date;
}

// Retrieves a user by ID.
export const get = api<GetUserRequest, User>(
  { auth: true, expose: true, method: "GET", path: "/users/:id" },
  async (req) => {
    const row = await db.queryRow<User>`
      SELECT id, username, created_at AS "createdAt"
      FROM users
      WHERE id = ${req.id}
    `;
    
    if (!row) {
      throw APIError.notFound("user not found");
    }
    
    return row;
  }
);
