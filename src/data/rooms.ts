import type { Room } from "@/types/room";
const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";


export const ROOMS = async () => {
  const data =  await fetch(baseUrl+ "/v1/room/")
  if (!data.ok) {
    throw new Error("Failed to fetch rooms");
  }
  const rooms: [Room] = await data.json();
  return rooms;
}

// export const ROOM_CATEGORIES: { label: string; value: "All" | Room["category"] }[] = [
//   { label: "All", value: "All" },
//   { label: "Classic", value: "classic" },
//   { label: "Deluxe", value: "deluxe" },
//   { label: "Suite", value: "suite" },
//   { label: "Penthouse", value: "penthouse" },
// ];

// export const ROOMS: Room[] = [
//   {
//     id: 1,
//     name: "Deluxe King",
//     type: "deluxe",
//     floor: 5,
//     capacity: 2,
//     bedType: "king",
//     price: 32000,
//     image:
//       "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=900&h=640&fit=crop&auto=format",
//     imageAlt: "Deluxe King room with city view and rainfall shower",
//     ammenities: ["City view", "Rainfall shower", "Minibar"],
//     description:
//       "Floor-to-ceiling windows frame the city skyline. White oak finishes and hand-stitched linens.",
//   },
//   {
//     id: 2,
//     name: "Garden Suite",
//     type: "suite",
//     floor: 6,
//     capacity: 2,
//     bedType: "king",
//     price: 52000,
//     image:
//       "https://images.unsplash.com/photo-1578898886225-c7c894047899?w=900&h=640&fit=crop&auto=format",
//     imageAlt: "Garden Suite with private terrace and soaking tub",
//     ammenities: ["Private terrace", "Soaking tub", "Living room"],
//     description:
//       "A private terrace opens to curated gardens. Natural stone with warm brass accents throughout.",
//   },
//   {
//     id: 3,
//     name: "Junior Suite",
//     type: "suite",
//     floor: 6,
//     capacity: 3,
//     bedType: "king",
//     price: 43000,
//     image:
//       "https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=900&h=640&fit=crop&auto=format",
//     imageAlt: "Junior Suite with panoramic view and lounge area",
//     ammenities: ["Panoramic view", "Walk-in closet", "Lounge area"],
//     description:
//       "Elevated on the sixth floor with sweeping panoramic vistas and a dedicated lounge area.",
//   },
//   {
//     id: 4,
//     name: "Classic Double",
//     type: "deluxe",
//     floor: 3,
//     capacity: 2,
//     bedType: "double",
//     price: 22000,
//     image:
//       "https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?w=900&h=640&fit=crop&auto=format",
//     imageAlt: "Classic Double room with courtyard view",
//     ammenities: ["Courtyard view", "Marble bathroom", "Writing desk"],
//     description:
//       "Refined comfort with understated elegance. Marble surfaces and warm, considered lighting.",
//   },
//   {
//     id: 5,
//     name: "Penthouse",
//     type: "suite",
//     floor: 7,
//     capacity: 4,
//     bedType: "king",

//     price: 120000,
//     image:
//       "https://images.unsplash.com/photo-1742821855309-d26c83bdfe1d?w=900&h=640&fit=crop&auto=format",
//     imageAlt: "Penthouse with 360 degree terrace and private kitchen",
//     ammenities: ["360° terrace", "Private kitchen", "Butler service"],
//     description:
//       "The crown of the property — a wraparound terrace, private kitchen, and dedicated butler.",
//   },
//   // {
//   //   id: 6,
//   //   name: "Superior Twin",
//   //   type: "suite",
//   //   floor: 6,
//   //   capacity: 2,
//   //   bedType: "twin",
//   //   price: 26000,
//   //   image:
//   //     "https://images.unsplash.com/photo-1590675560125-0d832b9d719e?w=900&h=640&fit=crop&auto=format",
//   //   imageAlt: "Superior Twin room with two beds and city view",
//   //   ammenities: ["City view", "Espresso machine", "Work desk"],
//   //   description:
//   //     "Two plush beds separated by a marble nightstand. Ideal for colleagues or companions.",
//   // },
// ];
 