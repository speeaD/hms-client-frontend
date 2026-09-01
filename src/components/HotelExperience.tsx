"use client";

import { useMemo, useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoomsSection from "@/components/RoomsSection";
import RoomModal from "@/components/RoomModal";
import Footer from "@/components/Footer";
import { addDaysISO, nightsBetween, todayISO } from "@/lib/dates";
import { sanitizeOnChange } from "@/lib/validation";
import type { BookingDetails, GuestDetails, ModalStep, Room } from "@/types/room";

interface HotelExperienceProps {
  rooms: Room[];
}

const TODAY = todayISO();
const TOMORROW = addDaysISO(TODAY, 1);

export default function HotelExperience({ rooms }: HotelExperienceProps) {
  const [booking, setBooking] = useState<BookingDetails>({
    checkIn: TODAY,
    checkOut: TOMORROW,
    guests: 2,
  });
  const [category, setCategory] = useState("All");

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [step, setStep] = useState<ModalStep>("detail");
  const [guest, setGuest] = useState<GuestDetails>({ name: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nights = useMemo(
    () => nightsBetween(booking.checkIn, booking.checkOut),
    [booking.checkIn, booking.checkOut]
  );

  useEffect(() => {
    console.log("HotelExperience mounted");
  }, []);

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        if (category !== "All" && room.type !== category.toLowerCase()) return false;
        if (room.capacity < booking.guests) return false;
        return true;
      }),
    [rooms, category, booking.guests]
  );

  function openRoom(room: Room) {
    console.log("openRoom", room);
    setSelectedRoom(room);
    setStep("detail");
    setGuest({ name: "", email: "" });
  }

  function closeModal() {
    setSelectedRoom(null);
  }

  async function submitReservation() {
    if (nights <= 0 || !selectedRoom) return;
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const [firstName, ...rest] = guest.name.trim().split(" ");
    const lastName = rest.join(" ") || "";
    const payload = {
      roomId: selectedRoom.id,
      checkInDate: booking.checkIn,
      checkOutDate: booking.checkOut,
      firstName,
      lastName,
      email: guest.email,
      phone: undefined,
      totalAmount: selectedRoom.price * nights,
      numberOfGuests: booking.guests,
    } as any;

    try {
      const resp = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = body?.error || body?.message || "Failed to initialize payment";
        throw new Error(msg);
      }

      // backend returns { success: true, data: { authorization_url, ... } }
      const authorizationUrl = body?.data?.authorization_url || body?.authorization_url || null;
      if (authorizationUrl) {
        // Redirect the user to Paystack to complete payment
        window.location.href = authorizationUrl;
        return;
      }

      // If no URL returned, show confirmation in UI
      setStep("confirmed");
    } catch (err: any) {
      console.error("Reservation/payment init failed", err);
      setErrorMessage(err?.message || String(err));
      // keep the modal open so the user can retry
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header />

      <Hero
        booking={booking}
        today={TODAY}
        onCheckIn={(checkIn) => setBooking((b) => ({ ...b, checkIn }))}
        onCheckOut={(checkOut) => setBooking((b) => ({ ...b, checkOut }))}
        onGuests={(guests) => setBooking((b) => ({ ...b, guests }))}
      />

      <RoomsSection
        rooms={filteredRooms}
        activeCategory={category}
        onCategoryChange={setCategory}
        checkIn={booking.checkIn}
        checkOut={booking.checkOut}
        nights={nights}
        onSelectRoom={openRoom}
      />

      <Footer />

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          step={step}
          booking={booking}
          nights={nights}
          guest={guest}
          onGuestName={(name) => setGuest((g) => ({ ...g, name: sanitizeOnChange(name, 100) }))}
          onGuestEmail={(email) =>
            setGuest((g) => ({ ...g, email: sanitizeOnChange(email, 254) }))
          }
          onContinue={() => setStep("form")}
          onBack={() => setStep("detail")}
          onSubmit={submitReservation}
          onClose={closeModal}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
