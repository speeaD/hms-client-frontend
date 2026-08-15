import { formatDisplayDate } from "@/lib/dates";
import type { Room } from "@/types/room";

interface ConfirmStepProps {
  room: Room;
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  onClose: () => void;
}

export default function ConfirmStep({
  room,
  nights,
  checkIn,
  checkOut,
  guests,
  name,
  email,
  onClose,
}: ConfirmStepProps) {
  const summary: [string, string][] = [
    ["Room", room.name],
    ["Check in", formatDisplayDate(checkIn)],
    ["Check out", formatDisplayDate(checkOut)],
    ["Guests", String(guests)],
    ["Duration", `${nights} night${nights !== 1 ? "s" : ""}`],
    ["Guest", name],
  ];

  return (
    <div>
      <div className="mb-6 flex h-12 items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg text-white">
          ✓
        </div>
      </div>

      <h3 className="mb-2 text-center font-display text-[26px] font-normal text-ink">
        You are confirmed
      </h3>
      <p className="mb-7 text-center text-[13px] leading-relaxed text-muted">
        A confirmation has been sent to {email}
      </p>

      <div className="mb-6 flex flex-col gap-3 rounded-[3px] bg-cream p-5">
        {summary.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between">
            <span className="text-xs text-faint">{k}</span>
            <span className="text-[13px] text-ink">{v}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-hairline pt-3">
          <span className="text-xs text-faint">Total</span>
          <span className="font-display text-xl text-ink">₦{room.price * nights}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full cursor-pointer rounded-[3px] border border-ink bg-white py-3 font-body text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:bg-cream"
      >
        Done
      </button>
    </div>
  );
}
