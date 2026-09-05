// Mirrors the enums/fields in schema.prisma. Prisma's Decimal fields
// (price, totalAmount, amount) serialize over JSON as strings in most
// setups, so we accept string | number and normalize in lib/format.ts.

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "checked-out"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type TransactionStatus = "pending" | "completed" | "failed";

export type RoomType = "single" | "double" | "suite" | "deluxe";

export type BedType = "single" | "double" | "queen" | "king";

export interface Room {
  id: string;
  name: string;
  roomNumber: string;
  type: RoomType;
  bedType: BedType;
  description: string | null;
  image: string | null;
  imageAlt: string | null;
  price: string | number;
  floor: number;
  amenities: string[];
  capacity: number;
}

export interface Transaction {
  id: string;
  amount: string | number;
  status: TransactionStatus;
  paystackReference: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  totalAmount: string | number;
  paymentStatus: PaymentStatus;
  numberOfGuests: number;
  // Optional: only present if your API's `include` adds `transactions: true`.
  // See README for the one-line backend change that enables this.
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}
