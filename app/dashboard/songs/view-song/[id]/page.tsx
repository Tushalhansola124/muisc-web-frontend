import SongViewPage from '@/components/song-module/viewSong'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ViewSongSingle({ params }: Props) {
  const { id } = await params   

  return <SongViewPage id={id} />
}