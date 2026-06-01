import ArtistForm from "@/components/artist-module/artistsAdd";


export default async function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;     // ← Must await params in Next.js 15+

  return <ArtistForm artistId={id} isEdit={true} />;
}