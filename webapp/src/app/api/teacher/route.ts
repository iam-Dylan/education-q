import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type TeacherRequestBody = {
  provider: "openai" | "openrouter";
  apiKey: string;
  model: string;
  messages: ChatMessage[];
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  let body: TeacherRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { provider, apiKey, model, messages } = body;

  if (!apiKey || !apiKey.trim()) {
    return NextResponse.json({ error: "Missing API key" }, { status: 400 });
  }
  if (!model || !model.trim()) {
    return NextResponse.json({ error: "Missing model name" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing messages" }, { status: 400 });
  }

  const url = provider === "openrouter" ? OPENROUTER_URL : OPENAI_URL;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://educationq-demo.local";
    headers["X-Title"] = "EducationQ Demo";
  }

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0,
        max_tokens: 300,
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const raw = data?.error?.message || `Upstream error (${upstream.status})`;
      const providerLabel = provider === "openrouter" ? "OpenRouter" : "OpenAI";
      let message = `${providerLabel}: ${raw}`;
      if (upstream.status === 401) {
        message = `${providerLabel} từ chối API key này (401). Kiểm tra lại: key có đúng định dạng của ${providerLabel} không (${
          provider === "openrouter" ? "sk-or-v1-..." : "sk-..."
        }), key còn hiệu lực/chưa hết hạn, và bạn đang chọn đúng Provider khớp với key đã nhập.`;
      } else if (upstream.status === 404) {
        message = `${providerLabel} không tìm thấy model "${model}" (404). Model có thể sai tên hoặc không khả dụng với key này.`;
      } else if (upstream.status === 429) {
        message = `${providerLabel} báo vượt quota/rate limit (429). Tài khoản có thể chưa nạp credit hoặc gọi quá nhanh.`;
      }
      return NextResponse.json({ error: message }, { status: upstream.status });
    }

    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    return NextResponse.json({ content: content.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error calling LLM provider";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
