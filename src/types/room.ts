export type RoomType = "single" | "double" | "suite" | "deluxe";
export type BedType = "single" | "double" | "queen" | "king" | "twin" | "sofa";

export interface Room {
  id: number;
  roomNumber?: string;
  name: string;
  type: RoomType;
  floor: number;
  capacity: number;
  bedType: BedType;
  price: number;
  image: string;
  imageAlt: string;
  amenities: string[];
  description: string;
  status: "available" | "reserved" | "maintenance" | "occupied";
}

export interface BookingDetails {
  checkIn: string; // ISO date (YYYY-MM-DD)
  checkOut: string; // ISO date (YYYY-MM-DD)
  guests: number;
}

export interface GuestDetails {
  name: string;
  email: string;
  phone: number;
}

export type ModalStep = "detail" | "form" | "confirmed";
