import { formatDisplayDate } from "@/lib/dates";
import type { Room } from "@/types/room";

interface DetailStepProps {
  room: Room;
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  onContinue: () => void;
}

export default function DetailStep({
  room,
  nights,
  checkIn,
  checkOut,
  guests,
  onContinue,
}: DetailStepProps) {
  const canContinue = nights > 0;

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.1em] text-faint">
            {room.floor} · {room.bedType} · Up to {room.capacity} guests
          </p>
          <h3 className="font-display text-[26px] font-normal text-ink">{room.name}</h3>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-display text-[26px] leading-none text-ink">₦{room.price}</p>
          <p className="mt-0.5 text-[11px] text-faint">per night</p>
        </div>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-[#555]">{room.description}</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {room.amenities.map((f) => (
          <span key={f} className="rounded-sm border border-border px-2.5 py-1 text-[11px] text-[#555]">
            {f}
          </span>
        ))}
      </div>

      {canContinue ? (
        <div className="mb-6 flex items-center justify-between rounded-[3px] bg-cream p-4">
          <div>
            <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-faint">Your stay</p>
            <p className="text-[13px] text-ink">
              {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)} · {guests} guest
              {guests !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-0.5 text-[10px] text-faint">
              {nights} night{nights !== 1 ? "s" : ""}
            </p>
            <p className="font-display text-xl text-ink">₦{room.price * nights}</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-[3px] border border-[#f0e8d8] bg-[#fffbf5] p-4">
          <p className="text-[13px] text-muted">
            Select check-in and check-out dates in the search bar to see the total price.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={`w-full rounded-[3px] py-3.5 font-body text-xs uppercase tracking-[0.1em] transition-colors ${
          canContinue ? "cursor-pointer bg-ink text-white hover:bg-ink/90" : "cursor-not-allowed bg-border text-faint"
        }`}
      >
        {canContinue ? "Continue to reserve" : "Select dates to continue"}
      </button>
    </>
  );
}
