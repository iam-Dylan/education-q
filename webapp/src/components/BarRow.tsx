type BarRowProps = {
  label: string;
  sublabel?: string;
  value: number;
  maxValue: number;
  displayValue: string;
  emphasis?: boolean;
};

export default function BarRow({
  label,
  sublabel,
  value,
  maxValue,
  displayValue,
  emphasis,
}: BarRowProps) {
  const pct = Math.max(2, (value / maxValue) * 100);
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-44 shrink-0 text-right">
        <div className={`text-sm leading-tight ${emphasis ? "font-semibold" : ""}`}>
          {label}
        </div>
        {sublabel ? <div className="text-xs text-muted">{sublabel}</div> : null}
      </div>
      <div className="flex h-6 flex-1 items-center">
        <div
          className="h-[10px] rounded-full"
          style={{
            width: `${pct}%`,
            background: emphasis ? "var(--viz-emphasis)" : "var(--viz-base)",
          }}
        />
        <span className="ml-2 shrink-0 text-xs font-medium tabular-nums text-muted">
          {displayValue}
        </span>
      </div>
    </div>
  );
}
