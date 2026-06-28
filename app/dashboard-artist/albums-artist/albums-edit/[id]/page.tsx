
import AlbumFormForArtist from "@/components/artist/albums-artist/albums-addAndEdit";



export default async function EditAlbumPageForArtist({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;     // ← Must await params in Next.js 15+

  return <AlbumFormForArtist albumId={id} isEdit={true} />;
}