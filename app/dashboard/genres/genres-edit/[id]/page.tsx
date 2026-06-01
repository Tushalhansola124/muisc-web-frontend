import GenreForm from "@/components/genres-module/genreAdd";


export default async function EditGenrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <GenreForm genreId={id} isEdit={true} />;
}