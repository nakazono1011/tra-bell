"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "ホテル名、プラン名で検索...",
}: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Search className="w-4 h-4 text-[var(--text-secondary)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
      />
    </div>
  );
}
