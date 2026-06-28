"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


import { CreateAlbumSchema, CreateAlbumFormData } from "@/schemas/album"

import { ArrowLeft } from "lucide-react"
import { GetOwnArtist } from "@/components/artist-module/controller"
import { CreateAlbum, GetAlbumById, UpdateAlbum } from "@/components/album-module/controller"

type ArtistOption = {
    _id: string
    name: string
}

type AlbumFormProps = {
    albumId?: string
    isEdit?: boolean
}

export default function AlbumFormForArtist({ albumId, isEdit = false }: AlbumFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEdit)
    const [preview, setPreview] = useState<string | null>(null)
    const [artist, setArtist] = useState<ArtistOption | null>(null);
    const [selectedArtistName, setSelectedArtistName] = useState<string>("") // For display

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateAlbumFormData>({
        resolver: zodResolver(CreateAlbumSchema),
        defaultValues: { title: "", artist: "", releaseDate: "" },
    })

    // Fetch all artists
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await GetOwnArtist();

                if (res?.data) {
                    setArtist(res.data);
                    setValue("artist", res.data._id);
                }
            } catch (error) {
                toast.error("Failed to load artists");
            }
        };

        fetchArtists();
    }, [setValue]);

    // Fetch album for Edit mode
    useEffect(() => {
        if (!isEdit || !albumId) return

        const fetchAlbum = async () => {
            setInitialLoading(true)
            try {
                const res = await GetAlbumById(albumId)
                if (res.success && res.data) {
                    const album = res.data

                    setValue("title", album.title)
                    setValue("releaseDate", album.releaseDate?.split("T")[0] || "")

                    const artistId = typeof album.artist === "string"
                        ? album.artist
                        : album.artist?._id || ""

                    setValue("artist", artistId)

                    // Find and set artist name for display
                    const selectedArtist = artist?._id === artistId ? artist : null
                    if (selectedArtist) {
                        setSelectedArtistName(selectedArtist.name)
                    }

                    if (album.coverImage) {
                        setPreview(album.coverImage)
                    }
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load album")
            } finally {
                setInitialLoading(false)
            }
        }

        fetchAlbum()
    }, [isEdit, albumId, setValue, artist])

    const onSubmit = async (data: CreateAlbumFormData) => {
        setLoading(true)
        const formData = new FormData()

        formData.append("title", data.title)
        formData.append("artist", data.artist)        // Send ID to backend
        formData.append("releaseDate", data.releaseDate)

        if (data.coverImage?.[0]) {
            formData.append("coverImage", data.coverImage[0])
        }

        try {
            if (isEdit && albumId) {
                const res = await UpdateAlbum(albumId, formData)
                if (res.success) {
                    toast.success(res.message || "Album updated successfully")
                    router.back();
                }
                else {
                    toast.error(res.message || "Failed to update album")
                }
            } else {
                const res = await CreateAlbum(formData)
                if (res.success) {
                    toast.success(res.message || "Album created successfully")
                    router.back();
                }
                else {
                    toast.error(res.message || "Failed to create album")
                }
            }

        } catch (error: any) {
            toast.error(error.message || "Operation failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Button

                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-whitehover:text-white hover:bg-zinc-900"
            >
                <ArrowLeft className="h-5 w-5" />
                Back
            </Button>
            <Card>

                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Album" : "Create New Album"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div>
                            <Label>Album Title</Label>
                            <Input {...register("title")} placeholder="Aashiqui Album" />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div>
                        <Label>Name Of Artist</Label>
                        <Select
                            value={watch("artist")}
                            onValueChange={(val:any) => setValue("artist", val)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue>
                                    {artist && watch("artist") === artist._id
                                        ? artist.name
                                        : "Select Artist"}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {artist && (
                                    <SelectItem value={artist._id}>
                                        {artist.name}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        </div>
                        <div>
                            <Label>Release Date</Label>
                            <Input type="date" {...register("releaseDate")} />
                            {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate.message}</p>}
                        </div>

                        <div>
                            <Label>Cover Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setValue("coverImage", e.target.files!)
                                        setPreview(URL.createObjectURL(file))
                                    }
                                }}
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-3 w-32 h-32 object-cover rounded-lg border"
                                />
                            )}
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Album" : "Create Album")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}