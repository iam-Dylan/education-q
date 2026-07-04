"use client";

import { useEffect, useRef, useState } from "react";
import { ReplayCase } from "@/lib/replayCases";
import ChatBubble from "./ChatBubble";

const LETTERS = "ABCDEFGHIJ";

export default function ReplayPanel({ case: c }: { case: ReplayCase }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const finished = visibleCount >= c.dialogue.length;

  useEffect(() => {
    if (!playing || finished) return;
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [playing, finished]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleCount]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-card-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {c.category} · Question #{c.questionId} · Teacher: {c.teacherModel}
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            Case study thật từ Appendix F của paper
          </span>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{c.question}</p>
        <div className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
          {c.options.map((opt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 ${
                LETTERS[i] === c.answerLetter ? "bg-[var(--viz-good)]/10" : ""
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  LETTERS[i] === c.answerLetter
                    ? "bg-[var(--viz-good)] text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="text-muted">{opt}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          Lưu ý: Teacher trong hội thoại này <strong>không được thấy</strong> các options trên —
          chỉ thấy câu hỏi + reasoning + đúng/sai của student.
        </p>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-muted">Pre-test</div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{c.preTestResponse}</p>
        <div className="mt-2 text-sm">
          Dự đoán: <strong>{c.preTestPrediction}</strong> —{" "}
          <span className={c.preTestCorrect ? "text-[var(--viz-good)]" : "text-[var(--viz-critical)]"}>
            {c.preTestCorrect ? "Đúng" : "Sai"}
          </span>
        </div>
      </div>

      <div className="flex h-[480px] flex-col rounded-2xl border border-card-border bg-card">
        <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
          <div className="text-sm font-semibold">Hội thoại dạy học (5 rounds)</div>
          {!finished ? (
            <button
              onClick={() => setPlaying((p) => !p)}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
            >
              {playing ? "Tạm dừng" : visibleCount === 0 ? "▶ Phát hội thoại" : "▶ Tiếp tục"}
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(0)}
              className="rounded-full border border-card-border px-3 py-1.5 text-xs font-medium transition hover:bg-accent-soft"
            >
              ↺ Xem lại
            </button>
          )}
        </div>
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {visibleCount === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Bấm &ldquo;Phát hội thoại&rdquo; để xem Teacher và Student trò chuyện từng round.
            </div>
          ) : null}
          {c.dialogue.slice(0, visibleCount).map((turn, i) => (
            <ChatBubble
              key={i}
              role={turn.role}
              content={turn.content}
              roundLabel={turn.role === "teacher" ? `Round ${turn.round}` : undefined}
            />
          ))}
          {playing && visibleCount < c.dialogue.length ? (
            <div className="text-xs text-muted">...</div>
          ) : null}
        </div>
        {!finished && visibleCount > 0 && !playing ? (
          <div className="border-t border-card-border p-3 text-center">
            <button
              onClick={() => setVisibleCount(c.dialogue.length)}
              className="text-xs text-muted underline"
            >
              Bỏ qua, hiện toàn bộ hội thoại
            </button>
          </div>
        ) : null}
      </div>

      {finished ? (
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">Post-test</div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{c.postTestResponse}</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span>
              Dự đoán: <strong>{c.postTestPrediction}</strong> —{" "}
              <span className={c.postTestCorrect ? "text-[var(--viz-good)]" : "text-[var(--viz-critical)]"}>
                {c.postTestCorrect ? "Đúng" : "Sai"}
              </span>
            </span>
            <span className="rounded-full bg-[var(--viz-good)]/15 px-3 py-1 font-semibold text-[var(--viz-good)]">
              ALG: +{c.alg.toFixed(1)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
