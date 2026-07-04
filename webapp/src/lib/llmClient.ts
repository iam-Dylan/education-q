import { Provider } from "./types";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callTeacherModel(params: {
  provider: Provider;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}): Promise<string> {
  const res = await fetch("/api/teacher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Failed to call teacher model");
  }
  return data.content as string;
}

export const MODEL_PRESETS: Record<Provider, { label: string; value: string }[]> = {
  openai: [
    { label: "GPT-4o mini", value: "gpt-4o-mini" },
    { label: "GPT-4o", value: "gpt-4o" },
    { label: "GPT-4.1 mini", value: "gpt-4.1-mini" },
  ],
  openrouter: [
    { label: "🆓 Llama 3.1 8B Instruct (free)", value: "meta-llama/llama-3.1-8b-instruct:free" },
    { label: "🆓 Gemini 2.0 Flash (free)", value: "google/gemini-2.0-flash-exp:free" },
    { label: "Llama 3.1 70B Instruct (paper's top teacher)", value: "meta-llama/llama-3.1-70b-instruct" },
    { label: "Llama 3.1 405B Instruct", value: "meta-llama/llama-3.1-405b-instruct" },
    { label: "Qwen 2.5 72B Instruct", value: "qwen/qwen-2.5-72b-instruct" },
    { label: "Gemini 1.5 Pro", value: "google/gemini-pro-1.5" },
    { label: "Mistral Nemo", value: "mistralai/mistral-nemo" },
    { label: "Claude 3.5 Sonnet", value: "anthropic/claude-3.5-sonnet" },
  ],
};
