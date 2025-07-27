import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isFromUser: boolean;
  timestamp?: Date;
}

export default function ChatBubble({ message, isFromUser, timestamp }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (isFromUser) {
    return (
      <motion.div 
        className="flex justify-end mb-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-none p-3 max-w-xs shadow-md">
          <p className="text-sm">{message}</p>
          {timestamp && (
            <span className="text-xs opacity-70 block mt-1 text-right">
              {formatTime(timestamp)}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-start space-x-3 mb-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-secondary" />
      </div>
      <div className="bg-secondary/10 rounded-xl rounded-tl-none p-3 max-w-xs shadow-md">
        <p className="text-sm text-gray-700">{message}</p>
        {timestamp && (
          <span className="text-xs text-gray-400 block mt-1">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
