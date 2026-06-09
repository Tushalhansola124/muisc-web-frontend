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

import { CreatePlaylist } from "./controller"
import { CreatePlaylistSchema, CreatePlaylistFormData } from "@/schemas/playlist"
import { GetSongs, ISong } from "../song-module/controller"
import { useSession } from "next-auth/react"

export default function PlaylistForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [availableSongs, setAvailableSongs] = useState<ISong[]>([])
  const [selectedSongs, setSelectedSongs] = useState<ISong[]>([])

  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlaylistFormData>({
    resolver: zodResolver(CreatePlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
      songs: [],
    },
  })

  const watchedSongs = watch("songs") || []

  // Fetch All Songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await GetSongs(session?.user?.token || "")
        if (res.success || res.status === 200) {
          setAvailableSongs(res.data || [])
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to load songs")
      }
    }
    fetchSongs()
  }, [session])

  const toggleSong = (songId: string, song: ISong) => {
    const current = watchedSongs
    if (current.includes(songId)) {
      setValue("songs", current.filter(id => id !== songId))
      setSelectedSongs(prev => prev.filter(s => s._id !== songId))
    } else {
      setValue("songs", [...current, songId])
      setSelectedSongs(prev => [...prev, song])
    }
  }

  const removeSong = (songId: string) => {
    const current = watchedSongs
    setValue("songs", current.filter(id => id !== songId))
    setSelectedSongs(prev => prev.filter(s => s._id !== songId))
  }

  const onSubmit = async (data: CreatePlaylistFormData) => {
    setLoading(true)
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
        songs: data.songs || []
      }

      const res = await CreatePlaylist(payload)

      if (res.success || res.status === 200 || res.status === 201) {
        toast.success("Playlist created successfully!")
        router.push("/dashboard/playlists")
      } else {
        toast.error(res.message || "Failed to create playlist")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Playlist Name */}
              <div>
                <Label>Playlist Name *</Label>
                <Input 
                  {...register("name")} 
                  placeholder="Chill Vibes 2026" 
                  className="mt-1"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea 
                  {...register("description")} 
                  placeholder="My personal favorite songs collection..." 
                  rows={4}
                  className="mt-1"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Select Songs */}
              <div>
                <Label>Select Songs * ({watchedSongs.length} selected)</Label>
                <div className="border rounded-xl p-5 max-h-96 overflow-y-auto bg-white mt-2">
                  {availableSongs.map((song) => (
                    <div
                      key={song._id}
                      className="flex items-center gap-3 py-3 px-4 hover:bg-zinc-100 rounded-xl cursor-pointer transition"
                      onClick={() => toggleSong(song._id, song)}
                    >
                      <input 
                        type="checkbox" 
                        checked={watchedSongs.includes(song._id)} 
                        readOnly 
                        className="w-5 h-5 accent-black"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-base">{song.title}</p>
                        <p className="text-sm text-zinc-500">
                          {typeof song.artist === "object" && song.artist?.name 
                            ? song.artist.name 
                            : "Unknown Artist"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.songs && <p className="text-red-500 text-sm mt-1">{errors.songs.message}</p>}
              </div>

              {/* Selected Songs Badges */}
              {selectedSongs.length > 0 && (
                <div>
                  <Label>Selected Songs</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSongs.map((song) => (
                      <Badge 
                        key={song._id} 
                        variant="secondary" 
                        className="px-4 py-1.5 text-sm flex items-center gap-2"
                      >
                        {song.title}
                        <X 
                          className="h-4 w-4 cursor-pointer hover:text-red-500" 
                          onClick={() => removeSong(song._id)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-black hover:bg-zinc-800 text-white"
                >
                  {loading ? "Creating Playlist..." : "Create Playlist"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}