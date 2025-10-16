import { Button } from "@/components/ui/button";
import { MessageCircle, LogOut, Circle } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

interface User {
  id: string;
  username: string;
}

interface ChatHeaderProps {
  user: User;
  isConnected: boolean;
}

export function ChatHeader({ user, isConnected }: ChatHeaderProps) {
  const { signOut } = useClerk();

  return (
    <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ReelsChat
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Circle className={`w-2 h-2 fill-current ${isConnected ? "text-green-400" : "text-red-400"}`} />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
