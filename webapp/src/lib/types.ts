export type ChatTurn = {
  round: number;
  role: "teacher" | "student";
  content: string;
};

export type Provider = "openai" | "openrouter";
