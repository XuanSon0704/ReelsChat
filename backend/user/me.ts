import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface UserInfo {
  id: string;
  username: string;
  email: string | null;
  imageUrl: string;
}

export const me = api<void, UserInfo>(
  { auth: true, expose: true, method: "GET", path: "/users/me" },
  async () => {
    const auth = getAuthData()!;
    
    const existingUser = await db.queryRow`
      SELECT id FROM users WHERE id = ${auth.userID}
    `;
    
    if (!existingUser) {
      await db.exec`
        INSERT INTO users (id, username, created_at)
        VALUES (${auth.userID}, ${auth.username}, NOW())
      `;
    }
    
    return {
      id: auth.userID,
      username: auth.username,
      email: auth.email,
      imageUrl: auth.imageUrl,
    };
  }
);
