import RoomCard from "@/components/RoomCard";
import { formatDisplayDate } from "@/lib/dates";
import type { Room } from "@/types/room";

interface RoomsSectionProps {
  rooms: Room[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  checkIn: string;
  checkOut: string;
  nights: number;
  onSelectRoom: (room: Room) => void;
}

export default function RoomsSection({
  rooms,
  activeCategory,
  onCategoryChange,
  checkIn,
  checkOut,
  nights,
  onSelectRoom,
}: RoomsSectionProps) {

  const ROOM_CATEGORIES: { label: string; value: "All" | Room["type"] }[] = [
    { label: "All", value: "All" },
    { label: "Deluxe", value: "deluxe" },
    { label: "Suite", value: "suite" },
  ];
  return (
    <section id="rooms" className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:px-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-normal text-ink">
          Available rooms
        </h2>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter rooms by category">
          {ROOM_CATEGORIES.map((c) => {
            const active = activeCategory === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onCategoryChange(c.value)}
                aria-pressed={active}
                className={`rounded-sm border px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.08em] transition-all ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-border bg-transparent text-muted"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {nights > 0 && (
        <p className="-mt-1 mb-6 text-[13px] text-muted">
          Showing prices for{" "}
          <strong className="text-ink">
            {nights} night{nights !== 1 ? "s" : ""}
          </strong>{" "}
          · {formatDisplayDate(checkIn)} → {formatDisplayDate(checkOut)}
        </p>
      )}

      {rooms.length === 0 ? (
        <div className="py-24 text-center text-faint">
          <p className="mb-2 font-display text-xl text-ink">No rooms match</p>
          <p className="text-sm">Try changing the guest count or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rooms.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              nights={nights}
              featured={i === 0}
              onSelect={onSelectRoom}
            />
          ))}
        </div>
      )}
    </section>
  );
}
