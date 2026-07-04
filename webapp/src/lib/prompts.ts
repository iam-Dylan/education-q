import { ChatMessage } from "./llmClient";

// Free-chat mode: the user asks anything (not tied to a dataset MCQ) and the
// Teacher LLM answers live, following the same pedagogical stance as the
// paper's Teacher agent — probing questions and feedback, not handed answers.
export function freeChatSystemMessage() {
  return `You are an expert, encouraging teacher having a live tutoring conversation with a student. Follow formative-assessment teaching principles: ask probing, thought-provoking questions to gauge and deepen the student's understanding, give constructive feedback, and adapt to what the student says. Prefer guiding the student to figure things out over directly stating final answers outright — use scaffolding (hints, follow-up questions, breaking problems into steps) before giving a direct answer, unless the student explicitly asks you to just tell them or is clearly stuck after genuine effort. Keep responses concise and conversational (a few sentences), like a real chat.`;
}

export function buildFreeChatMessages(history: { role: "user" | "assistant"; content: string }[]): ChatMessage[] {
  return [{ role: "system", content: freeChatSystemMessage() }, ...history];
}
