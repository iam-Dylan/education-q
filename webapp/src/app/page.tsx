import Link from "next/link";
import { EVOLUTION_STAGES } from "@/lib/paperData";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 py-16 sm:py-20">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          ACL 2025 · arXiv:2504.14928
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          EducationQ: LLM biết nhiều chưa chắc dạy giỏi.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          Các benchmark như MMLU, GPQA chỉ đo <strong>model có biết đáp án không</strong>.
          EducationQ đo câu hỏi khác: <strong>model có giúp học sinh hiểu hơn sau một
          cuộc hội thoại dạy học hay không?</strong> — bằng một framework mô phỏng
          3 agent: Teacher, Student, Evaluator.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Thử demo tương tác →
          </Link>
          <Link
            href="/results"
            className="rounded-full border border-card-border px-5 py-2.5 text-sm font-medium transition hover:bg-accent-soft"
          >
            Xem kết quả gốc của paper
          </Link>
        </div>
      </section>

      {/* Key finding */}
      <section className="grid gap-4 rounded-2xl border border-card-border bg-card p-6 sm:grid-cols-3 sm:p-8">
        <Stat value="11.01%" label="Absolute Learning Gain cao nhất — Llama 3.1 70B Instruct, đứng #1/14 teacher models" />
        <Stat value="70B > 405B" label="Model nhỏ hơn 5.8× dạy hiệu quả hơn ~1.8× nhờ chiến lược đặt câu hỏi tốt hơn" />
        <Stat value="78%" label="Tỷ lệ đồng thuận giữa evaluator agent (LLM) và 7 giáo viên con người thật" />
      </section>

      {/* Evolution */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ba giai đoạn đánh giá LLM trong giáo dục
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Paper đặt EducationQ vào bức tranh tiến hóa của cách chúng ta đánh giá LLM (Figure 1).
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {EVOLUTION_STAGES.map((stage, i) => (
            <div
              key={stage.key}
              className={`relative rounded-2xl border p-6 ${
                i === 2
                  ? "border-accent bg-accent-soft"
                  : "border-card-border bg-card"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Giai đoạn {stage.key.toUpperCase()}
              </span>
              <h3 className="mt-2 text-lg font-semibold leading-snug">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{stage.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {stage.caps.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-card-border px-2 py-0.5 text-xs text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-agent architecture */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Kiến trúc 3 agent</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Mô phỏng informal formative assessment (IFA) 1-kèm-1 trong lớp học thật.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <AgentCard
            emoji="🎓"
            role="Student Agent"
            model="Llama 3.1 70B Instruct (cố định)"
            desc="Làm pre-test, tham gia hội thoại, làm post-test. Thấy đầy đủ câu hỏi + options, nhưng không biết mình pre-test đúng/sai."
          />
          <AgentCard
            emoji="🧑‍🏫"
            role="Teacher Agent"
            model="Model đang được đánh giá (14 LLMs trong paper)"
            desc="Chỉ nhận: câu hỏi (không options), reasoning của student, và nhãn đúng/sai. Phải dạy bằng câu hỏi gợi mở, không được tiết lộ đáp án."
          />
          <AgentCard
            emoji="📊"
            role="Evaluator Agent"
            model="GPT-4o"
            desc="Tính ALG/PNIR/CSS/UIC, và chấm 17 chiều sư phạm (questioning, feedback, scaffolding...) theo thang 1-10."
          />
        </div>
      </section>

      {/* Content boundary */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Content Boundary — thiết kế quan trọng nhất
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-card-border">
          <table className="w-full text-sm">
            <thead className="bg-accent-soft text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Ai</th>
                <th className="px-4 py-3 font-medium">Thấy được</th>
                <th className="px-4 py-3 font-medium">Không thấy được</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              <tr>
                <td className="px-4 py-3 font-medium">Teacher</td>
                <td className="px-4 py-3 text-muted">Câu hỏi, reasoning của student, đúng/sai</td>
                <td className="px-4 py-3 text-muted">Answer options, đáp án đúng</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Student</td>
                <td className="px-4 py-3 text-muted">Toàn bộ câu hỏi + options</td>
                <td className="px-4 py-3 text-muted">Kết quả đúng/sai của pre-test</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Lý do: nếu teacher thấy đáp án, model có thể &ldquo;dạy&rdquo; bằng cách nói gần đáp án —
          không còn đo teaching skill nữa. Trong human evaluation, không reviewer nào phát hiện
          trường hợp teacher tiết lộ đáp án trực tiếp.
        </p>
      </section>

      {/* Pipeline */}
      <section className="py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Pipeline 3 bước</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PipelineStep n={1} title="Pre-test" desc="Student làm bài theo protocol gốc (MMLU-Pro / GPQA), tạo baseline accuracy." />
          <PipelineStep n={2} title="Interaction (5 rounds)" desc="Teacher hỏi, Student trả lời — mô phỏng formative assessment trong lớp học." />
          <PipelineStep n={3} title="Post-test" desc="Student làm lại câu hỏi với context pre-test + hội thoại. ALG = Post − Pre." />
        </div>
        <p className="mt-6 max-w-2xl text-sm text-muted">
          Demo trang sau cho phép bạn xem lại 2 hội thoại pre-test/interaction/post-test
          thật từ paper, hoặc chat trực tiếp và tự do với một Teacher LLM thật.
        </p>
        <div className="mt-6 text-center">
          <Link
            href="/demo"
            className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Chat thử với Teacher ngay →
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-accent">{value}</div>
      <div className="mt-1 text-sm leading-snug text-muted">{label}</div>
    </div>
  );
}

function AgentCard({
  emoji,
  role,
  model,
  desc,
}: {
  emoji: string;
  role: string;
  model: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold">{role}</h3>
      <div className="mt-1 text-xs font-medium text-accent">{model}</div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

function PipelineStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
        {n}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
