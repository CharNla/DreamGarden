import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { Leaf } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@shared/schema";
import ChatBubble from "@/components/chat-bubble";

export default function Chat() {
  // DreamGarden-themed suggestions for Reef AI
  const suggestions = [
    "ขอเทคนิคช่วยให้นอนหลับง่ายขึ้น",
    "แนะนำเพลงหรือเสียงธรรมชาติสำหรับผ่อนคลาย"
  ];
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessage = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("POST", "/api/chat/messages", {
        message: messageText,
        isFromUser: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
  });

  const handleSendMessage = () => {
    if (message.trim() && !sendMessage.isPending) {
      sendMessage.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage.mutate("สวัสดีค่ะ Reef");
    }
  }, []);

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Header */}
      <motion.div 
        className="dream-header-gradient text-white px-6 py-4 flex items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/garden")}
          className="mr-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Leaf className="w-7 h-7 text-green-300" />
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold">Reef AI</h1>
            <p className="text-xs opacity-90">ผู้ช่วยการนอนหลับ</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">🌙</div>
              <p>ยินดีต้อนรับสู่ Reef AI</p>
              <p className="text-sm">ผู้ช่วยการนอนหลับของคุณ</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {messages.map((msg, index) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                isFromUser={msg.isFromUser}
                timestamp={msg.createdAt ?? undefined}
              />
            ))}
          </motion.div>
        )}
        
        {sendMessage.isPending && (
          <motion.div 
            className="flex items-start space-x-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-secondary/10 rounded-xl rounded-tl-none p-3">
              <div className="flex space-x-1">
                <motion.div 
                  className="w-2 h-2 bg-secondary rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-secondary rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-secondary rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>



      {/* Bot greeting as first chat bubble, right under topbar */}
      <div className="bg-white px-4 pt-4 pb-1">
        <div className="max-w-full">
          <div className="flex items-start space-x-3 mb-2">
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M12 2v4"/><rect width="16" height="10" x="4" y="6" rx="2"/><path d="M8 6V4a4 4 0 0 1 8 0v2"/><path d="M15 10v.01"/><path d="M9 10v.01"/><path d="M8 14a4 4 0 0 0 8 0"/></svg>
            </div>
            <div className="bg-gradient-to-br from-[var(--dream-primary-50)] to-[var(--dream-secondary-50)] rounded-xl px-4 py-3 shadow text-gray-800 text-base font-semibold">
              สวัสดี! 👋 Reef AI พร้อมให้คำปรึกษาเกี่ยวกับการนอนหลับและการผ่อนคลาย หากมีคำถามหรืออยากได้คำแนะนำ กดเลือกข้อความตัวอย่างหรือพิมพ์สอบถามได้เลย
            </div>
          </div>
        </div>
      </div>
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 px-4 py-2 mb-1">
        {suggestions.map((text, idx) => (
          <button
            key={idx}
            className="bg-gradient-to-br from-[var(--dream-primary-50)] to-[var(--dream-secondary-50)] text-gray-800 text-sm px-4 py-2 rounded-full shadow-sm border border-primary/10 hover:bg-primary/10 transition-colors"
            onClick={() => setMessage(text)}
            type="button"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <motion.div 
        className="bg-white border-t border-gray-200 p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20"
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
