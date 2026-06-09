
import PlaylistFormEdit from '@/components/playlist-module/paylist-edit';

export default async function EditPlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; 

  return (
    <div className="p-4">
      <PlaylistFormEdit

        playlistId={id} 
  
      />
    </div>
  )
}