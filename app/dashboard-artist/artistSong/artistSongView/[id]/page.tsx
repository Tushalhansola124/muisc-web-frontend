

import SongViewPage from "@/components/song-module/viewSong"

type Props = {
  params: {
    id: string
  }
}

export default function ArtistOwnSongView({ params }: Props) {
  const { id } = params

  if (!id) {
    return <div className="p-8 text-red-400">Song ID not found</div>
  }

  return <SongViewPage id={id} />
}