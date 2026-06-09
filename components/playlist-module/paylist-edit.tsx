"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

import { UpdatePlaylist, GetPlaylistById } from "./controller"
import { CreatePlaylistSchema, CreatePlaylistFormData } from "@/schemas/playlist"
import { GetSongs, ISong } from "../song-module/controller"
import { useSession } from "next-auth/react"

type PlaylistFormProps = {
  playlistId: string
}

export default function PlaylistForm({ playlistId }: PlaylistFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [availableSongs, setAvailableSongs] = useState<ISong[]>([])
  const [selectedSongs, setSelectedSongs] = useState<ISong[]>([])
  const {data:session} = useSession()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlaylistFormData>({
    resolver: zodResolver(CreatePlaylistSchema),
    defaultValues: { name: "", description: "", songs: [] },
  })

  const watchedSongs = watch("songs") || []

 
useEffect(() => {
  const fetchData = async () => {
    const token = session?.user?.token
    if(!token) return 
    try {
      setInitialLoading(true)

      // 1. Get all songs
      const songsRes = await GetSongs(token)

      const allSongs = songsRes.data || []
      setAvailableSongs(allSongs)

      // 2. Get playlist
      const playlistRes = await GetPlaylistById(playlistId)

      if (playlistRes.success && playlistRes.data) {
        const playlist = playlistRes.data

        // Prefill form fields
        setValue("name", playlist.name || "")
        setValue("description", playlist.description || "")

        // Extract IDs from populated songs
        const songIds = (playlist.songs || []).map(
          (song: any) => song._id
        )

        setValue("songs", songIds)

        // Prefill selected songs
        const preSelectedSongs = allSongs.filter((song: ISong) =>
          songIds.includes(song._id)
        )

        setSelectedSongs(preSelectedSongs)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to load playlist")
    } finally {
      setInitialLoading(false)
    }
  }

  fetchData()
}, [playlistId, setValue])

const toggleSong = (songId: string, song: ISong) => {
  const currentSongs = watch("songs") || []

  if (currentSongs.includes(songId)) {
    const updatedSongs = currentSongs.filter((id) => id !== songId)

    setValue("songs", updatedSongs, {
      shouldValidate: true,
    })

    setSelectedSongs((prev) =>
      prev.filter((s) => s._id !== songId)
    )
  } else {
    const updatedSongs = [...currentSongs, songId]

    setValue("songs", updatedSongs, {
      shouldValidate: true,
    })

    setSelectedSongs((prev) => [...prev, song])
  }
}

//   const removeSong = (songId: string) => {
//     const current = watchedSongs
//     setValue("songs", current.filter(id => id !== songId))
//     setSelectedSongs(prev => prev.filter(s => s._id !== songId))
//   }

  const onSubmit = async (data: CreatePlaylistFormData) => {
    setLoading(true)
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description || "",
        songs: data.songs || []
      }

      const res = await UpdatePlaylist(playlistId, payload)

      if (res.success || res.status === 200 || res.status === 201) {
        toast.success("Playlist updated successfully!")
        router.push("/dashboard/playlists")
      } else {
        toast.error(res.message || "Update failed")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="text-center py-12">Loading playlist data...</div>

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label>Playlist Name *</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label>Description</Label>
                <Textarea {...register("description")} rows={4} />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <Label>Select Songs *</Label>
                <div className="border rounded-md p-4 max-h-80 overflow-y-auto bg-white">
                  {availableSongs.map((song) => (
                    <div
                      key={song._id}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-zinc-100 rounded cursor-pointer"
                      onClick={() => toggleSong(song._id, song)}
                    >
                      <input type="checkbox" checked={watchedSongs.includes(song._id)} readOnly />
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-zinc-500">
                          {typeof song.artist === "object" && song.artist?.name ? song.artist.name : "Unknown Artist"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.songs && <p className="text-red-500 text-sm mt-1">{errors.songs.message}</p>}
              </div>
{/* 
              {selectedSongs.length > 0 && (
                <div>
                  <Label>Selected Songs ({selectedSongs.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSongs.map((song) => (
                      <Badge key={song._id} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                        {song.title}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSong(song._id)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )} */}

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Playlist"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}