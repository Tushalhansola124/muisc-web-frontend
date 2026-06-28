"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { ArrowLeft, Badge } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import {
    CreateSongFormData,
    CreateSongSchema,
} from "@/schemas/song"
import { GetOwnArtist } from "@/components/artist-module/controller"
import { GetAlbumsForArtist } from "@/components/album-module/controller"
import { GetGenres } from "@/components/genres-module/controller"
import { CreateSong, GetSongById, UpdateSong } from "@/components/song-module/controller"

// ======================================================
// TYPES
// ======================================================

type ArtistOption = {
    _id: string
    name: string
}

type AlbumOption = {
    _id: string
    title: string
}

type GenreOption = {
    _id: string
    name: string
}

type SongFormProps = {
    songId?: string
    isEdit?: boolean
}

// ======================================================
// COMPONENT
// ======================================================

export default function SongFormArtists({
    songId,
    isEdit = false,
}: SongFormProps) {

    const router = useRouter()

    const { data: session } =
        useSession()

    const [loading, setLoading] =
        useState(false)

    const [preview, setPreview] =
        useState<string | null>(null)

    const [artist, setArtist] = useState<ArtistOption | null>(null);

    const [albums, setAlbums] =
        useState<AlbumOption[]>([])

    const [genres, setGenres] =
        useState<GenreOption[]>([])

    // ======================================================
    // FORM
    // ======================================================

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CreateSongFormData>({
        resolver:
            zodResolver(
                CreateSongSchema
            ),

        defaultValues: {
            title: "",
            description: "",
            artist: "",
            album: "",
            genre: [],
            duration: 0,
            isPublished: false,
        },
    })

    // ======================================================
    // LOAD DROPDOWN DATA
    // ======================================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [
                    artistsRes,
                    albumsRes,
                    genresRes,
                ] = await Promise.all([
                    GetOwnArtist(),
                    GetAlbumsForArtist(),
                    GetGenres(),
                ])

                if (artistsRes?.data) {
                    setArtist(artistsRes.data);
                    setValue("artist", artistsRes.data._id);
                }
                if (albumsRes?.data) {
                    setAlbums(
                        albumsRes.data
                    )
                }

                if (genresRes?.data) {
                    setGenres(
                        genresRes.data
                    )
                }

            } catch (error) {

                toast.error(
                    "Failed to load dropdown data"
                )
            }
        }

        fetchData()

    }, [])

    // ======================================================
    // PREFILL EDIT DATA
    // ======================================================

    useEffect(() => {

        if (!isEdit || !songId)
            return

        const token =
            session?.user?.token

        if (!token) return

        const fetchSong =
            async () => {

                try {

                    const res =
                        await GetSongById(
                            songId,
                            token
                        )

                    // console.log(
                    //     "SONG DATA:",
                    //     res
                    // )

                    const song =
                        res?.data

                    if (!song) return

                    reset({

                        title:
                            song.title || "",

                        description:
                            song.description || "",

                        artist:
                            typeof song.artist ===
                                "string"
                                ? song.artist
                                : song.artist?._id || "",

                        album:
                            typeof song.album ===
                                "string"
                                ? song.album
                                : song.album?._id || "",

                        genre:

                            song.genre?.map(
                                (g) => g._id
                            ) || [],

                        duration:
                            Number(
                                song.duration
                            ) || 0,

                        isPublished:
                            Boolean(
                                song.isPublished
                            ),
                    })

                    if (song.thumbnail) {
                        setPreview(
                            song.thumbnail
                        )
                    }

                } catch (error: any) {

                    console.log(error)

                    toast.error(
                        error.message ||
                        "Failed to load song"
                    )
                }
            }

        fetchSong()

    }, [
        isEdit,
        songId,
        session,
        reset,
    ])

    // ======================================================
    // SUBMIT
    // ======================================================

    const onSubmit = async (
        data: CreateSongFormData
    ) => {

        try {

            setLoading(true)

            const token =
                session?.user?.token

            if (!token) {

                toast.error(
                    "Unauthorized"
                )

                return
            }

            const formData =
                new FormData()

            formData.append(
                "title",
                data.title
            )

            formData.append(
                "description",
                data.description
            )

            formData.append(
                "artist",
                data.artist
            )

            formData.append(
                "album",
                data.album
            )

            formData.append(
                "duration",
                data.duration.toString()
            )

            formData.append(
                "isPublished",
                data.isPublished.toString()
            )

            formData.append(
                "genre",
                data.genre.join(",")
            )

            if (data.audio?.[0]) {

                formData.append(
                    "audio",
                    data.audio[0]
                )
            }

            if (
                data.thumbnail?.[0]
            ) {

                formData.append(
                    "thumbnail",
                    data.thumbnail[0]
                )
            }

            if (
                isEdit &&
                songId
            ) {

                const res = await UpdateSong(
                    songId,
                    formData,
                    token
                )

                if (res.success) {
                    toast.success(res.message || "Song Updated Successfully")
                    router.back();
                }
                else {
                    toast.error(res.message ||
                        "Failed to update song"
                    )
                }

            } else {

                const res = await CreateSong(
                    formData,
                    token
                )

                if (res.success) {
                    toast.success(res.message || "Song Created Successfully")
                    router.back();
                }
                else {
                    toast.error(res.message ||
                        "Failed to create song"
                    )
                }
            }

            router.push(
                "/dashboard/songs"
            )

        } catch (error: any) {

            console.log(error)

            toast.error(
                error.message ||
                "Something went wrong"
            )

        } finally {

            setLoading(false)
        }
    }

    // ======================================================
    // JSX
    // ======================================================

    return (
        <div className="min-h-screen bg-zinc-100 py-10 px-4">

            <div className="max-w-3xl mx-auto">

                <Button
                    variant="ghost"
                    onClick={() =>
                        router.back()
                    }
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Card>

                    <CardHeader>

                        <CardTitle className="text-3xl text-center">

                            {isEdit
                                ? "Edit Song"
                                : "Create Song"}

                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >

                            {/* TITLE */}

                            <div>

                                <Label>
                                    Title
                                </Label>

                                <Input
                                    {...register(
                                        "title"
                                    )}
                                />

                                {errors.title && (

                                    <p className="text-red-500 text-sm mt-1">

                                        {
                                            errors.title.message
                                        }

                                    </p>
                                )}
                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <Label>
                                    Description
                                </Label>

                                <Textarea
                                    rows={4}
                                    {...register(
                                        "description"
                                    )}
                                />

                            </div>

                            {/* ARTIST */}
                            <div>
                                <Label>
                                    Artist Name
                                </Label>
                                <Select
                                    value={watch("artist")}
                                    onValueChange={(val:any) => setValue("artist", val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {artist?.name || "Select Artist"}
                                        </SelectValue>

                                        <SelectContent>
                                            {artist && (
                                                <SelectItem
                                                    value={artist._id}
                                                >
                                                    {artist.name}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                </SelectTrigger>
                                </Select>
                            </div>

                            {/* ALBUM */}

                            <div>

                                <Label>
                                    Album
                                </Label>

                                <Select
                                    value={watch(
                                        "album"
                                    )}
                                    onValueChange={(val) => {
                                        if (val) {
                                            setValue(
                                                "album",
                                                val
                                            )
                                        }
                                    }
                                    }
                                >

                                    <SelectTrigger className="w-full">

                                        <SelectValue>
                                            {
                                                albums.find(
                                                    (a) => a._id === watch("album")
                                                )?.title || "Select Album"
                                            }
                                        </SelectValue>

                                    </SelectTrigger>

                                    <SelectContent>

                                        {albums.map(
                                            (album) => (

                                                <SelectItem
                                                    key={
                                                        album._id
                                                    }
                                                    value={
                                                        album._id
                                                    }
                                                >

                                                    {
                                                        album.title
                                                    }

                                                </SelectItem>
                                            )
                                        )}

                                    </SelectContent>

                                </Select>

                            </div>

                            {/* GENRE */}

                            <div>
                                <Label>Genres <span className="text-red-500">*</span></Label>

                                <div className="mt-2 border border-zinc-300 rounded-md p-3 min-h-[120px] max-h-[200px] overflow-y-auto bg-white">
                                    {genres.map((g) => (
                                        <div
                                            key={g._id}
                                            className="flex items-center gap-2 py-2 px-2 hover:bg-zinc-100 rounded cursor-pointer"
                                            onClick={() => {
                                                const current = watch("genre") || []
                                                if (current.includes(g._id)) {
                                                    // Remove
                                                    setValue(
                                                        "genre",
                                                        current.filter((id) => id !== g._id)
                                                    )
                                                } else {
                                                    // Add
                                                    setValue("genre", [...current, g._id])
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(watch("genre") || []).includes(g._id)}
                                                className="w-4 h-4 accent-black"
                                                readOnly
                                            />
                                            <span className="text-sm">{g.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Selected Genres Display */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {(watch("genre") || []).map((genreId) => {
                                        const genreName = genres.find((g) => g._id === genreId)?.name
                                        return (
                                            <Badge key={genreId} variant="secondary" className="bg-zinc-100 text-zinc-700">
                                                {genreName}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setValue(
                                                            "genre",
                                                            (watch("genre") || []).filter((id) => id !== genreId)
                                                        )
                                                    }}
                                                    className="ml-2 text-xs hover:text-red-500"
                                                >
                                                    ✕
                                                </button>
                                            </Badge>
                                        )
                                    })}
                                </div>

                                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>}
                            </div>

                            {/* DURATION */}

                            <div>

                                <Label>
                                    Duration
                                </Label>

                                <Input
                                    type="number"
                                    {...register(
                                        "duration",
                                        {
                                            valueAsNumber: true,
                                        }
                                    )}
                                />

                            </div>

                            {/* PUBLISHED */}

                            <div className="flex items-center gap-3">

                                <Switch
                                    checked={watch(
                                        "isPublished"
                                    )}
                                    onCheckedChange={(checked) =>
                                        setValue(
                                            "isPublished",
                                            checked
                                        )
                                    }
                                />

                                <Label>
                                    Published
                                </Label>

                            </div>

                            {/* AUDIO */}

                            <div>

                                <Label>
                                    Audio
                                </Label>

                                <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        setValue(
                                            "audio",
                                            e.target.files
                                        )
                                    }
                                />

                            </div>

                            {/* THUMBNAIL */}

                            <div>

                                <Label>
                                    Thumbnail
                                </Label>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {

                                        const file =
                                            e.target
                                                .files?.[0]

                                        if (file) {

                                            setValue(
                                                "thumbnail",
                                                e.target.files
                                            )

                                            setPreview(
                                                URL.createObjectURL(
                                                    file
                                                )
                                            )
                                        }
                                    }}
                                />

                                {preview && (

                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="w-40 h-40 rounded-xl object-cover mt-3"
                                    />
                                )}

                            </div>

                            {/* BUTTON */}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >

                                {loading
                                    ? "Loading..."
                                    : isEdit
                                        ? "Update Song"
                                        : "Create Song"}

                            </Button>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}