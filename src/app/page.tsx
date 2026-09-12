import HotelExperience from "@/components/HotelExperience";
import { ROOMS } from "@/data/rooms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await ROOMS();
  return <HotelExperience rooms={rooms} />;
}
