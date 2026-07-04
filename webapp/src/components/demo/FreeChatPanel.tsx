"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "@/lib/types";
import { buildFreeChatMessages } from "@/lib/prompts";
import { callTeacherModel } from "@/lib/llmClient";
import ChatBubble from "./ChatBubble";

type Msg = { role: "teacher" | "student"; content: string };

export default function FreeChatPanel({
  provider,
  apiKey,
  model,
}: {
  provider: Provider;
  apiKey: string;
  model: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function requestReply(next: Msg[]) {
    setLoading(true);
    setError(null);
    try {
      const history = next.map((m) => ({
        role: (m.role === "teacher" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      }));
      const reply = await callTeacherModel({
        provider,
        apiKey,
        model,
        messages: buildFreeChatMessages(history),
      });
      setMessages([...next, { role: "teacher", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định khi gọi Teacher model");
    } finally {
      setLoading(false);
    }
  }

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "student" as const, content: text }];
    setMessages(next);
    setInput("");
    requestReply(next);
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-card-border bg-card">
      <div className="border-b border-card-border px-4 py-3">
        <div className="text-sm font-semibold">Chat trực tiếp với Teacher</div>
        <div className="text-xs text-muted">Gõ bất kỳ câu hỏi nào — Teacher sẽ dạy bạn qua gợi mở, không đưa đáp án ngay.</div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-muted">
            Gõ một câu hỏi bất kỳ ở dưới để bắt đầu — ví dụ: &ldquo;Tại sao bầu trời màu xanh?&rdquo;
            hoặc một bài tập bạn đang mắc kẹt.
          </div>
        ) : null}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading ? <TypingIndicator /> : null}
        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <p>{error}</p>
            <button
              onClick={() => requestReply(messages)}
              className="mt-1.5 font-medium underline underline-offset-2"
            >
              Thử lại
            </button>
          </div>
        ) : null}
      </div>

      <div className="border-t border-card-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Nhập câu hỏi hoặc câu trả lời của bạn..."
            disabled={loading}
            className="flex-1 resize-none rounded-xl border border-card-border bg-background px-3 py-2 text-sm disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm text-white">
        🧑‍🏫
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl px-4 py-3"
        style={{ background: "var(--teacher-bubble)", borderTopLeftRadius: 4 }}
      >
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
