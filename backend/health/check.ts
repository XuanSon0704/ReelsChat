import { api } from "encore.dev/api";

interface HealthResponse {
  status: string;
  timestamp: Date;
}

// Returns the health status of the API.
export const check = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }
);
