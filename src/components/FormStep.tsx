"use client";

import { useState } from "react";
import Field from "@/components/Field";
import { validateGuestForm } from "@/lib/validation";
import type { Room } from "@/types/room";

interface FormStepProps {
  room: Room;
  nights: number;
  name: string;
  phone: number;
  email: string;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onPhone: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function FormStep({
  room,
  nights,
  name,
  email,
  phone,
  onName,
  onEmail,
  onPhone,
  onBack,
  onSubmit,
}: FormStepProps) {
  const [submitted, setSubmitted] = useState(false);
  const errors = validateGuestForm(name, email, phone);
  const canSubmit = Object.keys(errors).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (canSubmit) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 border-none bg-none p-0 font-body text-xs text-muted"
      >
        ← {room.name}
      </button>

      <h3 className="mb-1.5 font-display text-[22px] font-normal text-ink">Your details</h3>
      <p className="mb-6 text-[13px] text-muted">
        {nights} night{nights !== 1 ? "s" : ""} · ₦{room.price * nights} total
      </p>

      <div className="mb-8 flex flex-col gap-5">
        <Field
          label="Full name"
          type="text"
          value={name}
          placeholder="James Pemberton"
          maxLength={100}
          autoComplete="name"
          error={submitted ? errors.name : undefined}
          onChange={onName}
        />
        <Field
          label="Phone number"
          type="tel"
          value={phone.toString()}
          placeholder="123-456-7890"
          maxLength={20}
          autoComplete="tel"
          error={submitted ? errors.phone : undefined}
          onChange={onPhone}
        />
        <Field
          label="Email address"
          type="email"
          value={email}
          placeholder="james@example.com"
          maxLength={254}
          autoComplete="email"
          error={submitted ? errors.email : undefined}
          onChange={onEmail}
        />
      </div>

      <p className="mb-4 text-[11px] leading-relaxed text-faint">
        By reserving you agree to our cancellation policy. Free cancellation up to 48h before
        arrival.
      </p>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-[3px] bg-ink py-3.5 font-body text-xs uppercase tracking-[0.1em] text-white transition-colors hover:bg-ink/90"
      >
        Confirm reservation · ₦{room.price * nights}
      </button>
    </form>
  );
}
