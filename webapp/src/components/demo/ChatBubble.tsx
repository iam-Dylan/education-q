export default function ChatBubble({
  role,
  content,
  roundLabel,
}: {
  role: "teacher" | "student";
  content: string;
  roundLabel?: string;
}) {
  const isTeacher = role === "teacher";
  return (
    <div className={`flex gap-3 ${isTeacher ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isTeacher ? "bg-accent text-white" : "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-100"
        }`}
      >
        {isTeacher ? "🧑‍🏫" : "🎓"}
      </div>
      <div className={`flex max-w-[80%] flex-col ${isTeacher ? "items-start" : "items-end"}`}>
        {roundLabel ? (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">
            {roundLabel}
          </span>
        ) : null}
        <div
          className="whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
          style={{
            background: isTeacher ? "var(--teacher-bubble)" : "var(--student-bubble)",
            borderTopLeftRadius: isTeacher ? 4 : undefined,
            borderTopRightRadius: !isTeacher ? 4 : undefined,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
