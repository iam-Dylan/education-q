"use client";

import { useState } from "react";
import { Provider } from "@/lib/types";
import { REPLAY_CASES } from "@/lib/replayCases";
import { MODEL_PRESETS } from "@/lib/llmClient";
import TeacherConfigPanel, { Mode } from "@/components/demo/TeacherConfigPanel";
import ReplayPanel from "@/components/demo/ReplayPanel";
import FreeChatPanel from "@/components/demo/FreeChatPanel";

export default function DemoClient() {
  const [mode, setMode] = useState<Mode>("replay");
  const [replayCaseId, setReplayCaseId] = useState(REPLAY_CASES[0].id);

  const [provider, setProvider] = useState<Provider>("openrouter");
  const [model, setModel] = useState(MODEL_PRESETS.openrouter[0].value);
  const [apiKey, setApiKey] = useState("");

  const activeCase = REPLAY_CASES.find((c) => c.id === replayCaseId) ?? REPLAY_CASES[0];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Đóng vai Student — chat trực tiếp với Teacher LLM
        </h1>
        <p className="mt-2 text-sm text-muted">
          Gõ câu hỏi của bạn, Teacher trả lời ngay như một chatbot thật — theo đúng
          phong cách sư phạm (gợi mở, scaffolding) mà paper EducationQ mô tả.
        </p>
      </header>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Chế độ &amp; Teacher model
          </h2>
          <TeacherConfigPanel
            mode={mode}
            setMode={setMode}
            provider={provider}
            setProvider={setProvider}
            model={model}
            setModel={setModel}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
        </section>

        {mode === "live" ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Chat
            </h2>
            {apiKey.trim() ? (
              <FreeChatPanel provider={provider} apiKey={apiKey} model={model} />
            ) : (
              <div className="rounded-xl border border-dashed border-card-border p-6 text-center text-sm text-muted">
                Nhập API key ở trên để bắt đầu chat với Teacher.
              </div>
            )}
          </section>
        ) : (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Chọn case study
            </h2>
            <div className="flex flex-wrap gap-2">
              {REPLAY_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setReplayCaseId(c.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    c.id === replayCaseId
                      ? "bg-accent text-white"
                      : "border border-card-border text-muted hover:bg-accent-soft"
                  }`}
                >
                  #{c.questionId} {c.category} — {c.teacherModel}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <ReplayPanel case={activeCase} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
