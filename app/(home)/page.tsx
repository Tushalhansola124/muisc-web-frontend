// app/page.tsx
import { GetSongs, ISong } from "@/components/song-module/controller";
import { cookies } from "next/headers";
import HomePage from "./MusicHomePage";


// ⚠️ 'use client' HATAVO — server component rakhvo
export default async function Page() {
  const token = (await cookies()).get("token")?.value ?? "";

  let songs: ISong[] = [];
  try {
    const res = await GetSongs(token);
    console.log("Fetched Songs:", res.data);
    songs = res.data ?? [];
  } catch (err) {
    console.error("Songs fetch failed:", err);
  }

  return <HomePage />;
}