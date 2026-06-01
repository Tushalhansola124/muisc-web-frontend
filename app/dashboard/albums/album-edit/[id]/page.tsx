import AlbumForm from "@/components/album-module/albumAddandEdit";



export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;     // ← Must await params in Next.js 15+

  return <AlbumForm albumId={id} isEdit={true} />;
}