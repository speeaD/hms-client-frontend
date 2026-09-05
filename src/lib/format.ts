// Paystack amounts in the controller are converted to kobo, which implies
// NGN. Change the currency code below if your property bills in a
// different currency.
const CURRENCY = "NGN";

export function formatCurrency(amount: string | number | undefined, currency = CURRENCY) {
  if (amount === undefined) return "—";
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function nightsBetween(checkIn: string | Date, checkOut: string | Date) {
  const inDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const outDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  const ms = outDate.getTime() - inDate.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function formatRoomType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatBedType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1) + " bed";
}

export function formatGuestCount(count: number) {
  return `${count} ${count === 1 ? "guest" : "guests"}`;
}
