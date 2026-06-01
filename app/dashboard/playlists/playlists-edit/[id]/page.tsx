// app/dashboard/playlists/playlists-edit/[id]/page.tsx

import PlaylistForm from '@/components/playlist-module/paylist-create'

export default async function EditPlaylistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; 

  return (
    <div className="p-4">
      <PlaylistForm 
        playlistId={id} 
        isEdit={true} 
      />
    </div>
  )
}