import { SUBJECT_STRENGTHS, TEACHER_RESULTS } from "@/lib/paperData";
import BarRow from "@/components/BarRow";

export const metadata = {
  title: "Kết quả gốc của paper — EducationQ Demo",
};

export default function ResultsPage() {
  const maxAlg = Math.max(...TEACHER_RESULTS.map((r) => r.overallAlg));
  const maxSubjectAlg = Math.max(...SUBJECT_STRENGTHS.map((s) => s.alg));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-12 sm:px-6">
      <header className="max-w-3xl">
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          Table 4 · Section 7 · EducationQ paper
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Kết quả gốc: 14 teacher models trên 1,498 câu hỏi
        </h1>
        <p className="mt-3 text-muted">
          Student cố định: Llama 3.1 70B Instruct. Mỗi teacher dạy 5 rounds/câu hỏi.
          ALG = Post-test accuracy − Pre-test accuracy. Dữ liệu chép lại nguyên văn từ
          Table 4 của paper (2504.14928v3).
        </p>
      </header>

      {/* ALG ranking chart */}
      <section className="mt-10 rounded-2xl border border-card-border bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            Absolute Learning Gain (ALG) — xếp hạng 14 models
          </h2>
          <span className="text-xs text-muted">đơn vị: điểm % accuracy</span>
        </div>
        <div className="mt-6">
          {TEACHER_RESULTS.map((r) => (
            <BarRow
              key={r.model}
              label={r.model}
              sublabel={r.org}
              value={r.overallAlg}
              maxValue={maxAlg}
              displayValue={`+${r.overallAlg.toFixed(2)}%`}
              emphasis={r.rank === 1}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          <strong>Llama 3.1 70B Instruct</strong> dẫn đầu với ALG +11.01%, vượt qua cả{" "}
          <strong>Llama 3.1 405B Instruct</strong> (5.8× lớn hơn, ALG chỉ +6.14%, hạng 3) —
          bằng chứng rằng teaching effectiveness không tương quan tuyến tính với model scale.
        </p>
      </section>

      {/* Full table */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Bảng đầy đủ (Table 4)</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-card-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-accent-soft text-left">
              <tr>
                <th className="px-3 py-2.5 font-medium">#</th>
                <th className="px-3 py-2.5 font-medium">Model</th>
                <th className="px-3 py-2.5 text-right font-medium">GPQA Pre</th>
                <th className="px-3 py-2.5 text-right font-medium">GPQA Post</th>
                <th className="px-3 py-2.5 text-right font-medium">MMLU-Pro Pre</th>
                <th className="px-3 py-2.5 text-right font-medium">MMLU-Pro Post</th>
                <th className="px-3 py-2.5 text-right font-medium">ALG</th>
                <th className="px-3 py-2.5 text-right font-medium" title="Positive-Negative Impact Ratio, lower = better">
                  PNIR ↓
                </th>
                <th className="px-3 py-2.5 text-right font-medium" title="Cross-Subject Stability, lower = better">
                  CSS ↓
                </th>
                <th className="px-3 py-2.5 text-right font-medium" title="Unique Improvement Count">
                  UIC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border tabular-nums">
              {TEACHER_RESULTS.map((r) => (
                <tr key={r.model} className={r.rank === 1 ? "bg-accent-soft/60" : ""}>
                  <td className="px-3 py-2.5 text-muted">{r.rank}</td>
                  <td className="px-3 py-2.5 font-medium">
                    {r.model}
                    <div className="text-xs font-normal text-muted">{r.org}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right">{r.gpqaPre.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right">{r.gpqaPost.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right">{r.mmluPre.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right">{r.mmluPost.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-accent">
                    +{r.overallAlg.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right">{r.pnir.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right">{r.css.toFixed(3)}</td>
                  <td className="px-3 py-2.5 text-right">{r.uic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Subject strengths */}
      <section className="mt-10 rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold">Chuyên môn theo môn học (Section 7.3)</h2>
        <p className="mt-1 text-sm text-muted">
          &ldquo;Teacher tốt nhất&rdquo; không phải một điểm số duy nhất — mỗi model mạnh
          ở nhóm môn khác nhau.
        </p>
        <div className="mt-6">
          {SUBJECT_STRENGTHS.map((s) => (
            <BarRow
              key={`${s.model}-${s.subject}`}
              label={s.subject}
              sublabel={s.model}
              value={s.alg}
              maxValue={maxSubjectAlg}
              displayValue={`+${s.alg}%`}
            />
          ))}
        </div>
      </section>

      {/* Human alignment */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <MiniStat value="78%" label="Đồng thuận giữa 7 giáo viên thật và evaluator agent (39/50 cặp dialogue)" />
        <MiniStat value="7.38 vs 6.41" label="Điểm human rating (/10): dialogue có learning gain vs. dialogue không có" />
        <MiniStat value="r = 0.871" label="Tương quan xếp hạng teacher giữa GPQA Diamond và MMLU-Pro Stratified (p<0.001)" />
      </section>

      <section className="mt-10 rounded-2xl border border-card-border bg-card p-6">
        <h2 className="text-lg font-semibold">Hai kết luận chính của paper</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
          <li>
            <strong className="text-foreground">1. Model scale không dự đoán được teaching effectiveness.</strong>{" "}
            Model nhỏ/open-source (Llama 3.1 70B) có thể dạy tốt hơn model lớn hơn nhiều
            (Llama 3.1 405B) hoặc commercial (GPT-4o-mini, Claude 3.5 Sonnet) nếu có chiến
            lược sư phạm tốt hơn.
          </li>
          <li>
            <strong className="text-foreground">2. LLM-as-Teacher cần được tối ưu riêng cho việc dạy.</strong>{" "}
            Cần tập trung vào questioning, feedback, adaptation, scaffolding — thay vì chỉ
            scale model hoặc tối ưu QA benchmark.
          </li>
        </ol>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5">
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="mt-1 text-sm leading-snug text-muted">{label}</div>
    </div>
  );
}
