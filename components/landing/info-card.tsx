interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export function InfoCard({
  icon: Icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[var(--bg-tertiary)]">
      <Icon className="w-6 h-6 text-[var(--accent-secondary)] shrink-0 mt-1" />
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
