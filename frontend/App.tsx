import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { ChatScreen } from "./components/ChatScreen";
import { AuthScreen } from "./components/AuthScreen";

const PUBLISHABLE_KEY = "pk_test_ZmFuY3ktZmx5LTQwLmNsZXJrLmFjY291bnRzLmRldiQ";

function AppInner() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SignedIn>
        <ChatScreen user={{ id: user!.id, username: user!.username || user!.firstName || "User" }} />
      </SignedIn>
      <SignedOut>
        <AuthScreen />
      </SignedOut>
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppInner />
    </ClerkProvider>
  );
}
