"use client";

import { Spinner } from "@/components/ui/spinner";

interface GmailSyncButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  label: string;
  loadingLabel: string;
  icon?: React.ReactNode;
}

export function GmailSyncButton({
  onClick,
  disabled,
  isLoading,
  label,
  loadingLabel,
  icon,
}: GmailSyncButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30"
    >
      {isLoading ? (
        <>
          <Spinner className="w-5 h-5" />
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}
