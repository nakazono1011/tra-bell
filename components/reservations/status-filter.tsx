"use client";

type FilterStatus = "all" | "active" | "cancelled" | "rebooked";

interface StatusFilterProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

const FILTER_OPTIONS: Array<{ value: FilterStatus; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "active", label: "アクティブ" },
  { value: "cancelled", label: "キャンセル済" },
  { value: "rebooked", label: "再予約済" },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white border border-[var(--bg-tertiary)]">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">ステータス:</span>
        <div className="flex gap-1">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                value === option.value
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
