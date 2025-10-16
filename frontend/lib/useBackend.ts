import { useAuth } from "@clerk/clerk-react";
import backend from "~backend/client";

export function useBackend() {
  const { getToken, isSignedIn } = useAuth();
  
  if (!isSignedIn) {
    return backend;
  }
  
  return backend.with({
    auth: async () => {
      const token = await getToken();
      if (!token) return undefined;
      return { authorization: `Bearer ${token}` };
    }
  });
}
