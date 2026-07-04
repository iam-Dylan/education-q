// Data transcribed from EducationQ (Shi, Liang, Xu — ACL 2025), Table 4 and Section 7.
// Source PDF: 2504.14928v3.pdf

export type TeacherModelResult = {
  rank: number;
  model: string;
  org: string;
  gpqaPre: number;
  gpqaPost: number;
  gpqaAlg: number;
  mmluPre: number;
  mmluPost: number;
  mmluAlg: number;
  overallPre: number;
  overallPost: number;
  overallAlg: number;
  css: number;
  pnir: number;
  uic: number;
};

export const TEACHER_RESULTS: TeacherModelResult[] = [
  { rank: 1, model: "Llama 3.1 70B Instruct", org: "Meta", gpqaPre: 46.97, gpqaPost: 59.60, gpqaAlg: 12.63, mmluPre: 47.85, mmluPost: 58.62, mmluAlg: 10.77, overallPre: 47.73, overallPost: 58.74, overallAlg: 11.01, css: 0.041, pnir: 0.18, uic: 37 },
  { rank: 2, model: "Gemini 1.5 Pro 002", org: "Google", gpqaPre: 46.97, gpqaPost: 54.55, gpqaAlg: 7.58, mmluPre: 47.85, mmluPost: 55.31, mmluAlg: 7.46, overallPre: 47.73, overallPost: 55.21, overallAlg: 7.48, css: 0.030, pnir: 0.40, uic: 37 },
  { rank: 3, model: "Llama 3.1 405B Instruct", org: "Meta", gpqaPre: 46.97, gpqaPost: 55.05, gpqaAlg: 8.08, mmluPre: 47.85, mmluPost: 53.69, mmluAlg: 5.85, overallPre: 47.73, overallPost: 53.87, overallAlg: 6.14, css: 0.045, pnir: 0.28, uic: 9 },
  { rank: 4, model: "OpenAI o1-mini", org: "OpenAI", gpqaPre: 46.97, gpqaPost: 56.57, gpqaAlg: 9.60, mmluPre: 47.85, mmluPost: 53.12, mmluAlg: 5.27, overallPre: 47.73, overallPost: 53.57, overallAlg: 5.84, css: 0.054, pnir: 0.25, uic: 7 },
  { rank: 5, model: "Qwen 2.5 72B Instruct", org: "Alibaba", gpqaPre: 46.97, gpqaPost: 55.05, gpqaAlg: 8.08, mmluPre: 47.85, mmluPost: 52.85, mmluAlg: 5.00, overallPre: 47.73, overallPost: 53.14, overallAlg: 5.41, css: 0.054, pnir: 0.33, uic: 7 },
  { rank: 6, model: "Llama 3.1 8B Instruct", org: "Meta", gpqaPre: 46.97, gpqaPost: 52.02, gpqaAlg: 5.05, mmluPre: 47.85, mmluPost: 52.69, mmluAlg: 4.85, overallPre: 47.73, overallPost: 52.60, overallAlg: 4.87, css: 0.051, pnir: 0.40, uic: 13 },
  { rank: 7, model: "Hermes 3 Llama 3.1 70B", org: "Nous", gpqaPre: 46.97, gpqaPost: 51.52, gpqaAlg: 4.55, mmluPre: 47.85, mmluPost: 51.92, mmluAlg: 4.08, overallPre: 47.73, overallPost: 51.67, overallAlg: 4.14, css: 0.051, pnir: 0.39, uic: 6 },
  { rank: 8, model: "Mistral Nemo", org: "Mistral", gpqaPre: 46.97, gpqaPost: 51.52, gpqaAlg: 4.55, mmluPre: 47.85, mmluPost: 51.69, mmluAlg: 3.85, overallPre: 47.73, overallPost: 51.67, overallAlg: 3.94, css: 0.058, pnir: 0.30, uic: 12 },
  { rank: 9, model: "Claude 3.5 Sonnet", org: "Anthropic", gpqaPre: 46.97, gpqaPost: 52.53, gpqaAlg: 5.56, mmluPre: 47.85, mmluPost: 51.38, mmluAlg: 3.54, overallPre: 47.73, overallPost: 51.54, overallAlg: 3.81, css: 0.059, pnir: 0.30, uic: 5 },
  { rank: 10, model: "WizardLM-2 8x22B", org: "Microsoft", gpqaPre: 46.97, gpqaPost: 50.51, gpqaAlg: 3.54, mmluPre: 47.85, mmluPost: 51.54, mmluAlg: 3.67, overallPre: 47.73, overallPost: 51.40, overallAlg: 3.67, css: 0.047, pnir: 0.34, uic: 2 },
  { rank: 11, model: "DeepSeek V2.5", org: "DeepSeek", gpqaPre: 46.97, gpqaPost: 50.51, gpqaAlg: 3.54, mmluPre: 47.85, mmluPost: 51.08, mmluAlg: 3.23, overallPre: 47.73, overallPost: 51.00, overallAlg: 3.27, css: 0.051, pnir: 0.46, uic: 3 },
  { rank: 12, model: "Command R 08-2024", org: "Cohere", gpqaPre: 46.97, gpqaPost: 49.49, gpqaAlg: 2.53, mmluPre: 47.85, mmluPost: 50.85, mmluAlg: 3.00, overallPre: 47.73, overallPost: 50.67, overallAlg: 2.94, css: 0.057, pnir: 0.53, uic: 7 },
  { rank: 13, model: "GPT-4o-mini", org: "OpenAI", gpqaPre: 46.97, gpqaPost: 50.51, gpqaAlg: 3.54, mmluPre: 47.85, mmluPost: 50.12, mmluAlg: 2.27, overallPre: 47.73, overallPost: 50.17, overallAlg: 2.44, css: 0.085, pnir: 0.40, uic: 2 },
  { rank: 14, model: "Phi-3.5-mini Instruct", org: "Microsoft", gpqaPre: 46.97, gpqaPost: 48.99, gpqaAlg: 2.02, mmluPre: 47.85, mmluPost: 48.92, mmluAlg: 1.08, overallPre: 47.73, overallPost: 48.93, overallAlg: 1.20, css: 0.172, pnir: 0.69, uic: 4 },
];

export type SubjectStrength = {
  model: string;
  subject: string;
  alg: number;
};

// Section 7.3 subject-specific highlights
export const SUBJECT_STRENGTHS: SubjectStrength[] = [
  { model: "Llama 3.1 70B Instruct", subject: "Health", alg: 24 },
  { model: "Llama 3.1 70B Instruct", subject: "Philosophy", alg: 19 },
  { model: "Llama 3.1 70B Instruct", subject: "Psychology", alg: 18 },
  { model: "Llama 3.1 70B Instruct", subject: "History", alg: 14 },
  { model: "Llama 3.1 70B Instruct", subject: "Law", alg: 11 },
  { model: "OpenAI o1-mini", subject: "Math", alg: 9 },
  { model: "OpenAI o1-mini", subject: "Physics", alg: 8.6 },
  { model: "Gemini 1.5 Pro 002", subject: "Economics", alg: 9 },
  { model: "Gemini 1.5 Pro 002", subject: "Business", alg: 8 },
  { model: "Hermes 3 Llama 3.1 70B", subject: "Engineering", alg: 10 },
  { model: "Qwen 2.5 72B Instruct", subject: "Chemistry", alg: 11 },
];

export const QUALITATIVE_DIMENSIONS = {
  holistic: [
    "Assessment Effectiveness",
    "Questioning Effectiveness",
    "Feedback Effectiveness",
    "Instructional Adaptation Effectiveness",
    "Learning Objective Achievement",
  ],
  teacherCentric: [
    "Question Relevance",
    "Cognitive Level",
    "Knowledge Dimension",
    "Question Diversity",
    "Scaffolding Progression",
    "Metacognitive Promotion",
  ],
  studentCentric: [
    "Response Relevance",
    "Cognitive Level Demonstration",
    "Knowledge Dimension Integration",
    "Response Diversity",
    "Elaboration Progression",
    "Metacognitive Reflection",
  ],
};

export const EVOLUTION_STAGES = [
  {
    key: "a",
    title: "Individual Single-Turn General LLM Task",
    desc: "MMLU, HumanEval — model chỉ là 'người trả lời'. Một câu hỏi, một câu trả lời, chấm đúng/sai.",
    caps: ["answering", "reasoning", "coding"],
  },
  {
    key: "b",
    title: "Individual Single-Turn Educational Agent Task",
    desc: "Sinh câu hỏi, chấm bài tự động, phản hồi formative — nhưng mỗi năng lực được đo tách rời.",
    caps: ["student assessing", "content generating", "question answering"],
  },
  {
    key: "c",
    title: "Multi-Agent Multi-Turn Dynamic Educational Scenario",
    desc: "EducationQ: Teacher, Student, Evaluator tương tác động — đo năng lực dạy học tổng hợp.",
    caps: ["assessing", "questioning", "teaching"],
  },
];
