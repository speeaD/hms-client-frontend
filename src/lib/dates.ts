const MS_PER_DAY = 86_400_000;

/** Returns today's date as an ISO date string (YYYY-MM-DD), in the local timezone. */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Returns the ISO date string for `daysFromNow` days after today. */
export function addDaysISO(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a strict YYYY-MM-DD string into a local-midnight Date. Throws on malformed input. */
function parseISODate(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error("Invalid ISO date string");
  }
  return new Date(`${iso}T00:00:00`);
}

/** Formats an ISO date string for display, e.g. "3 Aug". Returns an em dash for empty input. */
export function formatDisplayDate(iso: string): string {
  if (!iso) return "—";
  try {
    return parseISODate(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "—";
  }
}

/** Number of nights between two ISO dates. Never negative; returns 0 for invalid ranges. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  try {
    const a = parseISODate(checkIn).getTime();
    const b = parseISODate(checkOut).getTime();
    return Math.max(0, Math.round((b - a) / MS_PER_DAY));
  } catch {
    return 0;
  }
}
