"use client";

interface EmptyStateProps {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actions,
  footer,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      {icon && (
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 bg-orange-50 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="flex flex-col items-center gap-4">{icon}</div>
            </div>
          </div>
        </div>
      )}

      {/* Heading */}
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>

      {/* Description */}
      <p className="text-sm text-center max-w-md mb-8 leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

      {/* Actions */}
      {actions && (
        <div className="flex flex-col gap-4 w-full max-w-md">{actions}</div>
      )}

      {/* Footer */}
      {footer && <div className="mt-4 w-full max-w-md">{footer}</div>}
    </div>
  );
}
