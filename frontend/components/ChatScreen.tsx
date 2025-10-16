import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBackend } from "../lib/useBackend";
import type { ChatMessage } from "../types";

interface User {
  id: string;
  username: string;
}

interface ChatScreenProps {
  user: User;
}

export function ChatScreen({ user }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const streamRef = useRef<any>(null);
  const { toast } = useToast();
  const backend = useBackend();

  useEffect(() => {
    loadHistory();
    connectToChat();

    return () => {
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, []);

  const loadHistory = async () => {
    try {
      const { messages: history } = await backend.chat.history({ limit: 100 });
      setMessages(history.map(msg => ({
        userId: msg.userId,
        username: msg.username,
        text: msg.text,
        timestamp: new Date(msg.createdAt),
      })));
    } catch (error) {
      console.error("Failed to load history:", error);
      toast({
        title: "Error",
        description: "Failed to load message history",
        variant: "destructive",
      });
    }
  };

  const connectToChat = async () => {
    try {
      const stream = await backend.chat.stream({ userId: user.id, username: user.username });
      streamRef.current = stream;
      setIsConnected(true);

      (async () => {
        try {
          for await (const message of stream) {
            setMessages(prev => {
              if (message) {
                return [...prev, message];
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Stream error:", error);
          setIsConnected(false);
        }
      })();
    } catch (error) {
      console.error("Failed to connect:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat",
        variant: "destructive",
      });
      setIsConnected(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || !streamRef.current || isSending) return;

    setIsSending(true);
    
    try {
      await streamRef.current.send({
        userId: user.id,
        username: user.username,
        text: inputText.trim(),
        timestamp: new Date(),
      });
      setInputText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader user={user} isConnected={isConnected} />
      
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} currentUserId={user.id} />
      </div>

      <div className="border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-800/50 border-slate-700 text-foreground placeholder:text-slate-500"
            disabled={!isConnected || isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={!isConnected || !inputText.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
