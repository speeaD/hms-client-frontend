import Image from "next/image";
import DateField from "@/components/DateField";
import GuestField from "@/components/GuestField";
import { addDaysISO } from "@/lib/dates";
import type { BookingDetails } from "@/types/room";

interface HeroProps {
  booking: BookingDetails;
  today: string;
  onCheckIn: (value: string) => void;
  onCheckOut: (value: string) => void;
  onGuests: (value: number) => void;
}

export default function Hero({ booking, today, onCheckIn, onCheckOut, onGuests }: HeroProps) {
  function handleCheckIn(value: string) {
    onCheckIn(value);
    // Keep check-out valid: push it a day later if it would land on or
    // before the new check-in date.
    if (value >= booking.checkOut) {
      onCheckOut(addDaysISO(value, 1));
    }
  }

  return (
    <section className="relative h-[88vh] min-h-[480px]">
      <Image
        src="https://images.unsplash.com/photo-1646645409452-866ad2fb64e4?w=1800&h=1000&fit=crop&auto=format"
        alt="Aldermere hotel lobby with warm natural light"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ background: "#d0cdc9" }}
      />
      <div className="absolute inset-0 bg-black/[0.32]" />

      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 md:px-16 md:pb-20">
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/60">
          Lagos, Nigeria
        </p>
        <h1 className="mb-8 max-w-[600px] font-display text-[clamp(36px,5.5vw,72px)] font-normal leading-[1.1] text-white">
          A quiet address
          <br />
          <em>in the city</em>
        </h1>

        <div className="flex max-w-[580px] flex-col items-stretch overflow-hidden rounded-[3px] bg-white sm:flex-row sm:items-center">
          <DateField
            id="checkin"
            label="Check in"
            value={booking.checkIn}
            min={today}
            onChange={handleCheckIn}
          />
          <div className="w-px self-stretch bg-hairline" />
          <DateField
            id="checkout"
            label="Check out"
            value={booking.checkOut}
            min={booking.checkIn}
            onChange={onCheckOut}
          />
          <div className="w-px self-stretch bg-hairline" />
          <GuestField value={booking.guests} onChange={onGuests} />
          <a
            href="#rooms"
            className="flex min-w-[110px] items-center justify-center whitespace-nowrap bg-ink px-6 py-4 text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink/90"
          >
            Search
          </a>
        </div>
      </div>
    </section>
  );
}
