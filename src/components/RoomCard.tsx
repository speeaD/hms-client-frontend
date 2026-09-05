"use client";

import { useState } from "react";
import Image from "next/image";
import type { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
  nights: number;
  featured: boolean;
  onSelect: (room: Room) => void;
}

export default function RoomCard({ room, nights, featured, onSelect }: RoomCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`cursor-pointer overflow-hidden rounded-[3px] border transition-colors ${
        hovered ? "border-[#ccc]" : "border-hairline"
      } ${featured ? "md:col-span-2" : ""}`}
      onClick={() => {
        console.log("RoomCard clicked:", room);
        onSelect(room);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex ${featured ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div
          className={`relative flex-shrink-0 overflow-hidden ${
            featured ? "h-[260px] sm:flex-[0_0_52%]" : "h-[210px]"
          }`}
          style={{ background: "#d0cdc9" }}
        >
          <Image
            src={room.image}
            alt={room.imageAlt}
            fill
            sizes={featured ? "(min-width: 640px) 52vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 ease-out"
            style={{ transform: hovered ? "scale(1.03)" : "scale(1)" }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.1em] text-faint">
                  {room.type} · {room.floor}
                </p>
                <h3
                  className={`font-display font-normal leading-tight text-ink ${
                    featured ? "text-2xl" : "text-xl"
                  }`}
                >
                  {room.name}
                </h3>
              </div>
              <div className="flex-shrink-0 text-right">
                <p
                  className={`font-display leading-none text-ink ${
                    featured ? "text-2xl" : "text-xl"
                  }`}
                >
                  ₦{room.price}
                </p>
                <p className="mt-0.5 text-[10px] text-faint">/ night</p>
                {nights > 0 && (
                  <p className="mt-1 text-[11px] text-[#555]">₦{room.price * nights} total</p>
                )}
              </div>
            </div>

            <p className="mb-3.5 text-[13px] leading-relaxed text-[#666]">{room.description}</p>

            <div className="flex flex-wrap gap-3">
              {room.amenities.map((f) => (
                <span key={f} className="text-[11px] text-muted">
                  · {f}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-5">
            <span className="text-[11px] text-faint">Up to {room.capacity} guests</span>
              <button
              type="button"
              onClick={() => {
                console.log("RoomCard Reserve clicked:", room);
                onSelect(room);
              }}
              className={`rounded-sm border border-ink px-5 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                hovered ? "bg-ink text-white" : "bg-white text-ink"
              }`}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
