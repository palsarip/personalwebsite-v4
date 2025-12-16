"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Paperclip,
  Download,
  Mail,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Hi, how can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Suggestions Logic
  const suggestionTemplates = [
    [
      "Tell me about your background",
      "What are your core skills?",
      "View project portfolio",
    ], // Intro
    [
      "Are you open to freelance?",
      "What's your typical rate?",
      "Download Resume",
    ], // Work
    [
      "Show me a complex project",
      "Explain your design process",
      "Tech stack used?",
    ], // Deep Dive
    ["What motivates you?", "Do you have a blog?", "Coding philosophy"], // Personal
    ["Schedule a discovery call", "Email address?", "LinkedIn profile"], // Contact
    ["Favorite frontend framework?", "Vim or VS Code?", "Coffee or Tea?"], // Fun
  ];

  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);

  const handleSendMessage = async (text?: string) => {
    const content = text || inputValue;
    if (!content.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);
    // Cycle to next suggestions template
    setCurrentTemplateIndex((prev) => (prev + 1) % suggestionTemplates.length);

    try {
      // Placeholder API call - meant to be replaced by actual external API
      // const response = await axios.post(process.env.NEXT_PUBLIC_CHAT_API_URL || "https://placeholder-api.com/chat", {
      //   message: newUserMessage.content,
      // });

      // Simulation logic for specific prompts
      let responseContent =
        "That's a great question! I'm designed to help you navigate Naufal's portfolio.";

      // Simple keyword matching for demo purposes
      if (
        content.toLowerCase().includes("work") ||
        content.toLowerCase().includes("available")
      ) {
        responseContent =
          "Yes, I am currently open to new opportunities! Feel free to reach out.";
      } else if (
        content.toLowerCase().includes("schedule") ||
        content.toLowerCase().includes("meeting")
      ) {
        responseContent =
          "I'd love to chat. You can check my calendar availability here: [Calendar Link]";
      } else if (
        content.toLowerCase().includes("chat") ||
        content.toLowerCase().includes("contact")
      ) {
        responseContent =
          "Would you prefer to send an email or chat directly here on the web?\n\n**Please note: This conversation will be recorded from this point forward.**";
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I seem to be having trouble connecting. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Typewriter Logic
  const placeholders = ["hobbies", "experience", "tech stack", "projects"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const current = placeholders[placeholderIndex % placeholders.length];
      const isFull = !isDeleting && placeholderText === current;
      const isEmpty = isDeleting && placeholderText === "";

      if (isFull) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isEmpty) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => prev + 1);
        setTypingSpeed(150); // Reset speed for typing
      }

      const nextText = isDeleting
        ? current.substring(0, placeholderText.length - 1)
        : current.substring(0, placeholderText.length + 1);

      setPlaceholderText(nextText);

      if (isDeleting) setTypingSpeed(50); // Faster deleting
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, typingSpeed, placeholderIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative font-sans">
      {/* ================= CHAT HISTORY / EMPTY STATE ================= */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 pb-44">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <span className="text-sm text-zinc-400 font-medium ml-1">
                Suggested questions:
              </span>

              <div className="grid gap-3">
                {/* Question 1 */}
                <button
                  onClick={() =>
                    handleSendMessage("Are you available for work?")
                  }
                  className="w-full text-left px-6 py-4 bg-white border border-zinc-100 rounded-3xl text-zinc-800 hover:bg-zinc-50 hover:border-zinc-200 transition-all shadow-sm"
                >
                  Are you available for work?
                </button>

                {/* Question 2 */}
                <button
                  onClick={() =>
                    handleSendMessage("I'd like to schedule a meeting.")
                  }
                  className="w-full text-left px-6 py-4 bg-white border border-zinc-100 rounded-3xl text-zinc-800 hover:bg-zinc-50 hover:border-zinc-200 transition-all shadow-sm flex justify-between items-center"
                >
                  <span>Schedule a meeting</span>
                  <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full">
                    Calendar
                  </span>
                </button>

                {/* Question 3: Chat with Naufal */}
                <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-zinc-800">
                      Chat with Naufal
                    </span>
                    <span className="text-xs text-zinc-400">
                      *All chat responses will be recorded for quality
                      assurance.
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href="mailto:contact@naufal.dev"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-sm font-medium transition-colors border border-zinc-100"
                    >
                      <Mail size={16} /> Email
                    </a>
                    <button
                      onClick={() =>
                        handleSendMessage("I want to chat effectively.")
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium transition-colors shadow-md"
                    >
                      <Bot size={16} /> Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full gap-4",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                    <Bot size={16} className="text-zinc-400" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "bg-zinc-900 text-white rounded-tr-none"
                      : "bg-white border border-zinc-100 text-zinc-800 pl-5"
                  )}
                >
                  {msg.role === "assistant" && (
                    <span className="block font-bold text-xs mb-1 text-zinc-900">
                      Pally
                    </span>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex w-full gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                  <Bot size={16} className="text-zinc-400" />
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <div className="h-2 w-2 rounded-full bg-zinc-200 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 rounded-full bg-zinc-200 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 rounded-full bg-zinc-200 animate-bounce"></div>
                </div>
              </div>
            )}

            {/* Inline Suggestions (After Bot Input) */}
            {!isLoading &&
              messages[messages.length - 1]?.role === "assistant" && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <span className="text-sm text-zinc-400 font-medium ml-1">
                    Suggested questions:
                  </span>
                  <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                    {suggestionTemplates[currentTemplateIndex].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left px-5 py-3 text-zinc-800 hover:bg-zinc-50 transition-colors border-b border-zinc-100 border-dashed last:border-0 text-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* ================= INPUT BAR ================= */}
      <div className="absolute bottom-6 left-0 right-0 px-6 max-w-3xl mx-auto z-20">
        <div className="bg-white border border-zinc-200 rounded-[32px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100">
          <div className="px-4 py-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask about my ${placeholderText}`}
              className="flex-1 bg-transparent py-1 focus:outline-none text-zinc-900 placeholder:text-zinc-500 text-base font-medium"
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex items-center justify-end px-2 pb-1 mt-1">
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={cn(
                "p-3 rounded-full transition-all duration-200 shrink-0",
                inputValue.trim()
                  ? "bg-zinc-900 text-white shadow-md hover:bg-zinc-800"
                  : "bg-zinc-100 text-zinc-300"
              )}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
