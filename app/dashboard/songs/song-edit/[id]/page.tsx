import SongForm from "@/components/song-module/songaddandedit";


export default async function EditSongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return (
    <SongForm
      songId={id}
      isEdit={true}
    />
  );
}