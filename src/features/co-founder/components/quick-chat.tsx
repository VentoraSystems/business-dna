"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// UI shell only. Wire the submit handler to POST /api/ai/chat, which should
// stream a completion built with buildCoFounderSystemPrompt() from
// src/ai/prompts/business-match.ts so responses stay in the user's locale.
export function QuickChat() {
  const t = useTranslations("coFounder");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: input }]);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-[120px] flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-md px-3 py-2 text-sm",
              message.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted"
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
        />
        <Button type="submit" size="icon" aria-label={t("send")}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
