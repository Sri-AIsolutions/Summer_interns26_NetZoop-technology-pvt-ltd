"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, TypingIndicator } from "@/components/chat/ChatMessage";
import type { ChatMessageData, SummaryData } from "@/components/chat/ChatMessage";
import { apiClient } from "@/services/api";
import type { Course } from "@/types";

interface ChatApiResponse {
  answer: string;
  source: string;
  courses: Course[];
  summary: { totalCourses: number; totalCredits: number } | null;
  raw_data: unknown;
}

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: nextId(),
      role: "assistant",
      text: "Hello! I'm your curriculum assistant. Ask me about courses, credits, electives, or semester details.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");

    const userMessage: ChatMessageData = {
      id: nextId(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await apiClient.post<ChatApiResponse>("/api/chat", {
        message: text,
      });

      const summaryData: SummaryData | undefined = response.summary
        ? {
            type: "info",
            message: `${response.summary.totalCourses} courses, ${response.summary.totalCredits} total credits`,
          }
        : undefined;

      const assistantMessage: ChatMessageData = {
        id: nextId(),
        role: "assistant",
        text: response.answer,
        courses: response.courses.length > 0 ? response.courses : undefined,
        summary: summaryData,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessageData = {
        id: nextId(),
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="mx-auto flex max-w-3xl flex-col"
      style={{ height: "calc(100dvh - 4rem - 5rem)" }}
    >
      <div className="shrink-0 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Chat
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ask questions about courses, credits, and curriculum
        </p>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto pb-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-slate-50 pb-safe pt-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about courses..."
            aria-label="Type your message"
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
