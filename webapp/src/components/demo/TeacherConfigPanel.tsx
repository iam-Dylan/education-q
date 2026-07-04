"use client";

import { MODEL_PRESETS } from "@/lib/llmClient";
import { Provider } from "@/lib/types";

export type Mode = "replay" | "live";

export default function TeacherConfigPanel({
  mode,
  setMode,
  provider,
  setProvider,
  model,
  setModel,
  apiKey,
  setApiKey,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  provider: Provider;
  setProvider: (p: Provider) => void;
  model: string;
  setModel: (m: string) => void;
  apiKey: string;
  setApiKey: (k: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <ModeCard
          active={mode === "replay"}
          title="Replay mẫu (khuyên dùng)"
          desc="Xem lại 2 hội thoại thật từ paper (Llama 3.1 70B, Gemini 1.5 Pro) — không cần API key, chạy ngay."
          onClick={() => setMode("replay")}
        />
        <ModeCard
          active={mode === "live"}
          title="Live — dùng model thật"
          desc="Gọi API thật bằng key của bạn. Teacher sẽ dạy bạn theo đúng system prompt của paper."
          onClick={() => setMode("live")}
        />
      </div>

      {mode === "live" ? (
        <div className="space-y-3 rounded-xl border border-card-border bg-card p-4">
          {!apiKey.trim() ? (
            <div className="rounded-lg bg-accent-soft p-3 text-xs leading-relaxed text-foreground">
              <strong>Chưa có API key?</strong> Lấy miễn phí trong 1 phút:
              <ol className="mt-1 list-inside list-decimal space-y-0.5">
                <li>
                  Tạo tài khoản tại{" "}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent underline"
                  >
                    openrouter.ai/keys
                  </a>{" "}
                  (chọn Provider = OpenRouter bên dưới)
                </li>
                <li>Tạo key, copy vào ô &ldquo;API key&rdquo; bên dưới</li>
                <li>
                  Chọn model có nhãn <strong>🆓 (free)</strong> trong danh sách Teacher model —
                  không tốn phí
                </li>
              </ol>
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Provider</label>
            <div className="flex gap-2">
              {(["openrouter", "openai"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    setModel(MODEL_PRESETS[p][0].value);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    provider === p
                      ? "bg-accent text-white"
                      : "border border-card-border text-muted hover:bg-accent-soft"
                  }`}
                >
                  {p === "openrouter" ? "OpenRouter" : "OpenAI"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Teacher model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm"
            >
              {MODEL_PRESETS[provider].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {provider === "openrouter" ? "OpenRouter API key" : "OpenAI API key"}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === "openrouter" ? "sk-or-v1-..." : "sk-..."}
              className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-mono"
            />
            <p className="mt-1.5 text-xs text-muted">
              Key chỉ được gửi trực tiếp tới provider để gọi model, không lưu ở server nào.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ModeCard({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active ? "border-accent bg-accent-soft" : "border-card-border bg-card hover:bg-accent-soft/40"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-muted">{desc}</div>
    </button>
  );
}
