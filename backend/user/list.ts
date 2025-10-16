import { api } from "encore.dev/api";
import db from "../db";

interface User {
  id: string;
  username: string;
  createdAt: Date;
}

interface ListUsersResponse {
  users: User[];
}

// Retrieves all users.
export const list = api<void, ListUsersResponse>(
  { auth: true, expose: true, method: "GET", path: "/users" },
  async () => {
    const users = await db.queryAll<User>`
      SELECT id, username, created_at AS "createdAt"
      FROM users
      ORDER BY created_at DESC
    `;
    
    return { users };
  }
);
