"use client"

import { MoreHorizontalIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

import {
    DeleteArtist,
    GetArtists,
} from "./controller"

type Artist = {
    _id: string
    name: string
    bio: string
    image: string
    followers: number
    createdAt: string
    updatedAt: string
}

export function ArtistsTable() {

    const [artists, setArtists] = useState<Artist[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    // =========================================
    // LOAD ARTISTS
    // =========================================

    const loadArtists = async () => {

        setLoading(true)

        try {

            const res = await GetArtists()

            console.log("Artists Response:", res)

            if (res.success || res.status === 200) {

                setArtists(res.data || [])

            } else {

                toast.error(
                    res.message || "Failed to load artists"
                )

            }

        } catch (error: any) {

            console.error(error)

            toast.error(
                error.message || "Failed to load artists"
            )

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {
        loadArtists()
    }, [])

    // =========================================
    // SEARCH FILTER
    // =========================================

    const filteredArtists = artists.filter((artist) =>
        `${artist.name} ${artist.bio}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    // =========================================
    // DELETE ARTIST
    // =========================================

    const handleDelete = async (_id: string) => {

        try {

            const res = await DeleteArtist(_id)

            if (res.success || res.status === 200) {

                toast.success(
                    res.message || "Artist deleted successfully"
                )

                loadArtists()

            } else {

                toast.error(
                    res.message || "Failed to delete artist"
                )

            }

        } catch (error: any) {

            console.error(error)

            toast.error(
                error.message || "Failed to delete artist"
            )

        }
    }

    return (
        <div className="space-y-4">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">

                    <Input
                        placeholder="Search by artist name or bio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 lg:w-96"
                    />

                </div>

                <Button
                    onClick={() =>
                        router.push("/dashboard/artists/artists-add")
                    }
                    className="w-full sm:w-auto whitespace-nowrap"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Artist
                </Button>

            </div>

            {/* Table */}
            <div className="rounded-md border">

                <Table>

                    <TableHeader>

                        <TableRow>

                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Bio</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Followers</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>

                            <TableHead className="text-right">
                                Actions
                            </TableHead>

                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    className="text-center py-10"
                                >
                                    Loading artists...
                                </TableCell>

                            </TableRow>

                        ) : filteredArtists.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    className="text-center py-10"
                                >
                                    No artists found
                                </TableCell>

                            </TableRow>

                        ) : (

                            filteredArtists.map((artist, index) => (

                                <TableRow key={artist._id}>

                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {artist.name}
                                    </TableCell>

                                    <TableCell className="max-w-[250px] truncate">
                                        {artist.bio}
                                    </TableCell>

                                    {/* IMAGE */}
                                    <TableCell>

                                        {artist.image ? (

                                            <img
                                                src={artist.image}
                                                alt={artist.name}
                                                className="w-12 h-12 rounded-md object-cover border"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/placeholder.svg"
                                                }}
                                            />

                                        ) : (

                                            <div className="w-12 h-12 bg-zinc-200 rounded-md" />

                                        )}

                                    </TableCell>

                                    <TableCell>
                                        {artist.followers}
                                    </TableCell>

                                    <TableCell>

                                        {artist.createdAt
                                            ? new Date(
                                                artist.createdAt
                                            ).toLocaleDateString()
                                            : "-"}

                                    </TableCell>

                                    <TableCell>

                                        {artist.updatedAt
                                            ? new Date(
                                                artist.updatedAt
                                            ).toLocaleDateString()
                                            : "-"}

                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell className="text-right">

                                        <AlertDialog>

                                            <DropdownMenu>

                                                <DropdownMenuTrigger>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <MoreHorizontalIcon className="h-4 w-4" />
                                                    </Button>

                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">

                                                    {/* EDIT */}
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/artists/artists-edit/${artist._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    {/* DELETE */}
                                                    <AlertDialogTrigger>

                                                        <button
                                                            className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-accent rounded-sm"
                                                        >
                                                            Delete
                                                        </button>

                                                    </AlertDialogTrigger>


                                                </DropdownMenuContent>

                                            </DropdownMenu>

                                            {/* DIALOG */}
                                            <AlertDialogContent>

                                                <AlertDialogHeader>

                                                    <AlertDialogTitle>
                                                        Delete Artist?
                                                    </AlertDialogTitle>

                                                    <AlertDialogDescription>

                                                        Are you sure you want to delete{" "}
                                                        <strong>{artist.name}</strong> ?

                                                        <br />

                                                        This action cannot be undone.

                                                    </AlertDialogDescription>

                                                </AlertDialogHeader>

                                                <AlertDialogFooter>

                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(artist._id)
                                                        }
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Yes, Delete
                                                    </AlertDialogAction>

                                                </AlertDialogFooter>

                                            </AlertDialogContent>

                                        </AlertDialog>

                                    </TableCell>

                                </TableRow>

                            ))

                        )}

                    </TableBody>

                </Table>

            </div>

        </div>
    )
}