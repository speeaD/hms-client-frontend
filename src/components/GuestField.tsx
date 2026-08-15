const MAX_GUESTS = 4;

interface GuestFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export default function GuestField({ value, onChange }: GuestFieldProps) {
  return (
    <label htmlFor="guests" className="flex min-w-[90px] cursor-pointer flex-col px-4 py-3">
      <span className="mb-[3px] text-[9px] uppercase tracking-[0.15em] text-faint">
        Guests
      </span>
      <select
        id="guests"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cursor-pointer appearance-none border-none bg-transparent p-0 font-body text-[13px] text-ink outline-none"
      >
        {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} {n === 1 ? "guest" : "guests"}
          </option>
        ))}
      </select>
    </label>
  );
}
