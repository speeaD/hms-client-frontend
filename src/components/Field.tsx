"use client";

import { useId, useState } from "react";

interface FieldProps {
  label: string;
  type: "text" | "email" | "tel";
  value: string;
  placeholder: string;
  error?: string;
  maxLength: number;
  autoComplete?: string;
  onChange: (value: string) => void;
}

export default function Field({
  label,
  type,
  value,
  placeholder,
  error,
  maxLength,
  autoComplete,
  onChange,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-faint"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border-0 border-b bg-transparent py-2.5 font-body text-sm text-ink outline-none transition-colors"
        style={{ borderBottomColor: error ? "#c0392b" : focused ? "#111111" : "#e5e2dd" }}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[11px]" style={{ color: "#c0392b" }}>
          {error}
        </p>
      )}
    </div>
  );
}
