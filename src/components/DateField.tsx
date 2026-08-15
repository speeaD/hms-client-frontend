interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
}

export default function DateField({ id, label, value, min, onChange }: DateFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-1 cursor-pointer flex-col px-4 py-3 min-w-[120px]">
      <span className="mb-[3px] text-[9px] uppercase tracking-[0.15em] text-faint">
        {label}
      </span>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer border-none bg-transparent p-0 font-body text-[13px] text-ink outline-none"
      />
    </label>
  );
}
