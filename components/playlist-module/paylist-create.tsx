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

import { CreatePlaylist, UpdatePlaylist, GetPlaylistById } from "./controller"
import { CreatePlaylistSchema, CreatePlaylistFormData } from "@/schemas/playlist"
import { GetSongs, ISong, ISongsResponse } from "../song-module/controller"
import { useSession } from "next-auth/react"

// type SongOption = {
//   _id: string
//   title: string
//   artist?: { name: string }
// }

type PlaylistFormProps = {
  playlistId?: string
  isEdit?: boolean
}

export default function PlaylistForm({ playlistId, isEdit = false }: PlaylistFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [playlistData, setPlaylistData] = useState<any>(null);
const [availableSongs, setAvailableSongs] = useState<ISong[]>([])    
  const [selectedSongs, setSelectedSongs] = useState<ISong[]>([])
  const {data:session} = useSession()
  useEffect(() => {
    if (!session) {
      toast.error("You must be logged in to create a playlist")
      router.push("/login")
    }
  }, [session, router])
  const getToken = () => session?.user?.token || ""

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

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await GetSongs(getToken())
        if (res.success || res.status === 200) {
          setAvailableSongs(res.data || [])
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchSongs()
  }, [])

  // Fetch playlist for edit
useEffect(() => {
  if (!isEdit || !playlistId) return;

  const fetchPlaylist = async () => {
    try {
      const res = await GetPlaylistById(playlistId);

      if (res.success && res.data) {
        const p = res.data;

        setPlaylistData(p);

        setValue("name", p.name);
        setValue("description", p.description || "");
        setValue("songs", p.songs || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInitialLoading(false);
    }
  };

  fetchPlaylist();
}, [playlistId, isEdit, setValue]);

useEffect(() => {
  if (!playlistData || availableSongs.length === 0) return;

  const matchedSongs = availableSongs.filter(song =>
    playlistData.songs.includes(song._id)
  );

  setSelectedSongs(matchedSongs);
}, [playlistData, availableSongs]);

  const watchedSongs = watch("songs") || []

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
  console.log("DATA:", data);
  console.log("PLAYLIST ID:", playlistId);

  const payload = {
    name: data.name.trim(),
    description: data.description?.trim() || "",
    songs: data.songs || [],
  };

  console.log("PAYLOAD:", payload);

  const res = await UpdatePlaylist(playlistId!, payload);

  console.log("API RESPONSE:", res);
};

  if (initialLoading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-8xl  w-full mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Playlist" : "Create New Playlist"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Playlist Name *</Label>
              <Input {...register("name")} placeholder="Chill Vibes 2026" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} placeholder="My personal favorite songs..." rows={4} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label>Select Songs *</Label>
              <div className="border rounded-md p-4 max-h-80 overflow-y-auto bg-zinc-50">
                {availableSongs.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-3 py-2 px-3 hover:bg-white rounded cursor-pointer"
                    onClick={() => toggleSong(song._id, song)}
                  >
                    <input type="checkbox" checked={watchedSongs.includes(song._id)} readOnly />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-zinc-500">
                        {song.artist?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.songs && <p className="text-red-500 text-sm mt-1">{errors.songs.message}</p>}
            </div>

            {/* Selected Songs */}
            {selectedSongs.length > 0 && (
              <div>
                <Label>Selected ({selectedSongs.length})</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSongs.map((song) => (
                    <Badge key={song._id} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      {song.title}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSong(song._id)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Playlist" : "Create Playlist")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}