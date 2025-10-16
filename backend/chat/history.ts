import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

interface Message {
  id: number;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

interface HistoryRequest {
  limit: Query<number>;
}

interface HistoryResponse {
  messages: Message[];
}

// Retrieves chat message history.
export const history = api<HistoryRequest, HistoryResponse>(
  { auth: true, expose: true, method: "GET", path: "/chat/history" },
  async (req) => {
    const limit = req.limit || 100;
    
    const messages = await db.queryAll<Message>`
      SELECT id, user_id AS "userId", username, text, created_at AS "createdAt"
      FROM messages
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    
    return { messages: messages.reverse() };
  }
);
