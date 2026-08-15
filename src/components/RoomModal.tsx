"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import DetailStep from "@/components/DetailStep";
import FormStep from "@/components/FormStep";
import ConfirmStep from "@/components/ConfirmStep";
import type { BookingDetails, GuestDetails, ModalStep, Room } from "@/types/room";

interface RoomModalProps {
  room: Room;
  step: ModalStep;
  booking: BookingDetails;
  nights: number;
  guest: GuestDetails;
  onGuestName: (value: string) => void;
  onGuestEmail: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function RoomModal({
  room,
  step,
  booking,
  nights,
  guest,
  onGuestName,
  onGuestEmail,
  onContinue,
  onBack,
  onSubmit,
  onClose,
}: RoomModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = "room-modal-title";

  // Lock background scroll while the dialog is open, and restore focus to
  // whatever triggered it on close — standard dialog accessibility practice.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Close on Escape, and keep Tab focus trapped inside the dialog.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-md bg-white outline-none md:w-auto md:max-w-2xl md:rounded-md"
      >
        <div className="relative h-[260px]">
          <Image
            src={room.image}
            alt={room.imageAlt}
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
            style={{ background: "#d0cdc9" }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-sm border-none bg-white/90 text-sm text-ink"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          <h2 id={titleId} className="sr-only">
            Reserve {room.name}
          </h2>

          {step === "detail" && (
            <DetailStep
              room={room}
              nights={nights}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              guests={booking.guests}
              onContinue={onContinue}
            />
          )}

          {step === "form" && (
            <FormStep
              room={room}
              nights={nights}
              name={guest.name}
              email={guest.email}
              onName={onGuestName}
              onEmail={onGuestEmail}
              onBack={onBack}
              onSubmit={onSubmit}
            />
          )}

          {step === "confirmed" && (
            <ConfirmStep
              room={room}
              nights={nights}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              guests={booking.guests}
              name={guest.name}
              email={guest.email}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
