import SongFormArtists from "@/components/artist/song-artist/add-song-artist";



export default async function EditSongArtitstPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return (
    <SongFormArtists
      songId={id}
      isEdit={true}
    />
  );
}