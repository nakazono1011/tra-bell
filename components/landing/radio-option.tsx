interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label
      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
        checked
          ? 'border-[var(--accent-primary)] bg-orange-50'
          : 'border-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required
        className="sr-only"
      />
      <div
        className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center shrink-0 transition-all ${
          checked
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
            : 'border-gray-300 bg-white'
        }`}
      >
        {checked && (
          <div className="w-2 h-2 rounded-full bg-white" />
        )}
      </div>
      <span className="text-sm text-[var(--text-primary)]">
        {label}
      </span>
    </label>
  );
}
