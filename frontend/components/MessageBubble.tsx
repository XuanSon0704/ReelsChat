import { formatDistanceToNow } from "date-fns";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const getColorClass = (userId: string) => {
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "from-purple-600 to-purple-700",
      "from-pink-600 to-pink-700",
      "from-blue-600 to-blue-700",
      "from-green-600 to-green-700",
      "from-orange-600 to-orange-700",
      "from-teal-600 to-teal-700",
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isCurrentUser && (
          <span className="text-xs text-slate-400 px-3">{message.username}</span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isCurrentUser
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm"
              : `bg-gradient-to-r ${getColorClass(message.userId)} text-white rounded-bl-sm`
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
        </div>
        <span className="text-xs text-slate-500 px-3">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
