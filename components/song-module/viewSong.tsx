"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, ExternalLink, Clock, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GetSongById } from "./controller"
import { useSession } from "next-auth/react"

type Song = {
  _id: string
  title: string
  description: string
  artist: any
  album: any
  genre: any[]
  duration: number
  audioUrl: string
  thumbnail: string
  plays: number
  likes: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

type Props = {
  id: string
}

export default function SongViewPage({ id }: Props) {
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  useEffect(() => {

    const fetchSong = async () => {
       const token = session?.user?.token
    if(!token) return 
      try {
        const res = await GetSongById(id,token)
        if ((res.status === 200 || res.success) && res.data) {
          setSong(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch song:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchSong()
  }, [id])

  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`
  const formatCount = (num: number) => num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading masterpiece...</p>
        </div>
      </div>
    )
  }

  if (!song) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400">Song not found</div>
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section with Background Image */}
      <div className="relative h-[620px] overflow-hidden">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-zinc-950" />

        <div className="absolute top-8 left-8 z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 backdrop-blur-md"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Library
          </Button>
        </div>

        <div className="absolute bottom-16 left-8 right-8 z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {song.genre?.map((g: any, i: number) => (
              <Badge key={i} className="bg-white/10 backdrop-blur-md text-white border border-white/20">
                {g.name}
              </Badge>
            ))}
            {song.isPublished && (
              <Badge className="bg-emerald-500 text-black font-medium">Published</Badge>
            )}
          </div>

          <h1 className="text-6xl font-bold text-white tracking-tighter mb-3">
            {song.title}
          </h1>
          <p className="text-2xl text-zinc-300">
            {typeof song.artist === "object" ? song.artist.name : song.artist}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Audio Player & Thumbnail */}
          <div className="lg:col-span-5 pt-5 space-y-6">
            <Card className="bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full aspect-square object-cover"
              />
            </Card>

            {song.audioUrl && (
              <Card className="bg-zinc-900 border border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Now Playing</p>
                    <p className="text-sm text-zinc-400">Full Track • {formatDuration(song.duration)}</p>
                  </div>
                </div>
                <audio controls className="w-full accent-blue-500" style={{ height: "48px" }}>
                  <source src={song.audioUrl} type="audio/mpeg" />
                </audio>
              </Card>
            )}
          </div>

          {/* Information Section */}
          <div className="lg:col-span-7 space-y-8 pt-4">
            <Card className="bg-zinc-900 border border-zinc-800 p-8">
              <h3 className="uppercase text-xs tracking-widest text-zinc-500 mb-3">About this track</h3>
              <p className="text-zinc-200 leading-relaxed text-[15.5px]">
                {song.description}
              </p>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Clock className="h-5 w-5" />, label: "Duration", value: formatDuration(song.duration) },
                { icon: <Play className="h-5 w-5" />, label: "Plays", value: formatCount(song.plays) },
                { icon: <Heart className="h-5 w-5" />, label: "Likes", value: formatCount(song.likes) },
                { icon: <Calendar className="h-5 w-5" />, label: "Released", value: new Date(song.createdAt).toLocaleDateString('en-GB') },
              ].map((stat, i) => (
                <Card key={i} className="bg-zinc-900 border border-zinc-800 px-10 text-center hover:border-zinc-600 transition-colors">
                  <div className="text-zinc-400 mb-3 flex justify-center">{stat.icon}</div>
                  <div className="text-1xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {song.audioUrl && (
                <Button size="lg" className="bg-white p-5 pt-5 text-black hover:bg-zinc-100">
                  <a href={song.audioUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-3 h-5 w-5" /> Listen Full Audio
                  </a>
                </Button>
              )}
              {song.thumbnail && (
                <Button size="lg"  className="p-5 pt-5" variant="outline">
                  <a href={song.thumbnail} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-3 h-5 w-5" /> View Cover Art
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}