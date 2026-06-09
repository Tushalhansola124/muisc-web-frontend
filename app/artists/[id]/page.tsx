import { auth } from "@/auth";
import { GetArtistById } from "@/components/artist-module/controller";
import { ISong } from "@/components/song-module/controller";
import MusicHomePage from "@/components/song-module/muisc-home";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {

  const { id } = await params;

  let songs: ISong[] = [];

  try {

    const res = await GetArtistById(id);

   
    songs = res.data.songs ?? [];

  } catch (err) {

    console.error("Artist fetch failed:", err);

  }

  return (
    <MusicHomePage

      songs={songs}
    />
  );
}