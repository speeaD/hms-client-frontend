import HotelExperience from "@/components/HotelExperience";
import { ROOMS } from "@/data/rooms";

export default function Home() {
  // Room data is static and known at build time, so it's read on the server
  // and passed down rather than re-imported inside a client bundle.
  return <HotelExperience rooms={ROOMS} />;
}
