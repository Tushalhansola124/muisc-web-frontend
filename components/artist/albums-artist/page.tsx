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
import { DeleteAlbum, GetAlbums, GetAlbumsForArtist, IAlbum } from "@/components/album-module/controller"



type Album = {
  _id: string
  title: string

  artist?: {
    _id: string
    name: string
  } | null

  coverImage: string
  releaseDate: string
  songs: any[]

  createdAt: string
  updatedAt: string
}

export function AlbumsForArtistTables() {

 const [albums, setAlbums] = useState<IAlbum[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // =========================================
  // LOAD ALBUMS
  // =========================================

  const loadAlbums = async () => {

    setLoading(true)

    try {

      const res = await GetAlbumsForArtist()

      console.log("Albums Response:", res)

      if (res.success || res.status === 200) {

        setAlbums(res.data || [])

      } else {

        toast.error(
          res.message || "Failed to load albums"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to load albums"
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadAlbums()
  }, [])

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredAlbums = albums.filter((album) =>
    `${album.title} ${typeof album.artist === "object" ? album.artist.name : album.artist || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // =========================================
  // DELETE ALBUM
  // =========================================

  const handleDelete = async (_id: string) => {

    try {

      const res = await DeleteAlbum(_id)

      if (res.success || res.status === 200) {

        toast.success(
          res.message || "Album deleted successfully"
        )

        // Reload Table
        loadAlbums()

      } else {

        toast.error(
          res.message || "Failed to delete album"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to delete album"
      )

    }
  }

  return (

    <div className="space-y-4">

      {/* ========================================= */}
      {/* TOP SECTION */}
      {/* ========================================= */}

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">

          <Input
            placeholder="Search by album or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 lg:w-96"
          />

        </div>

        <Button
          onClick={() =>
            router.push("/dashboard-artist/albums-artist/albums-add")
          }
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Album
        </Button>

      </div>

      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}

      <div className="rounded-md border overflow-x-auto">

        <Table>

          {/* ========================================= */}
          {/* TABLE HEADER */}
          {/* ========================================= */}

          <TableHeader>

            <TableRow>

              <TableHead>#</TableHead>

              <TableHead>
                Album Title
              </TableHead>

              <TableHead>
                Artist
              </TableHead>

              <TableHead>
                Cover Image
              </TableHead>

              <TableHead>
                Release Date
              </TableHead>

              <TableHead>
                Songs
              </TableHead>

              <TableHead>
                Created At
              </TableHead>

              <TableHead>
                Updated At
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          {/* ========================================= */}
          {/* TABLE BODY */}
          {/* ========================================= */}

          <TableBody>

            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={9}
                  className="text-center py-10"
                >
                  Loading albums...
                </TableCell>

              </TableRow>

            ) : filteredAlbums.length === 0 ? (

              /* ========================================= */
              /* EMPTY */
              /* ========================================= */

              <TableRow>

                <TableCell
                  colSpan={9}
                  className="text-center py-10"
                >
                  No albums found
                </TableCell>

              </TableRow>

            ) : (

              /* ========================================= */
              /* DATA */
              /* ========================================= */

              filteredAlbums.map((album, index) => (

                <TableRow key={album._id}>

                  <TableCell>
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {album.title}
                  </TableCell>

                  <TableCell>
                    {typeof album.artist === "object"
                      ? album.artist.name
                      : album.artist || "-"}
                  </TableCell>

                  {/* IMAGE */}
                  <TableCell>

                    {album.coverImage ? (

                      <img
                        src={album.coverImage}
                        alt={album.title}
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

                    {album.releaseDate
                      ? new Date(
                          album.releaseDate
                        ).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  <TableCell>
                    {album.songs?.length || 0}
                  </TableCell>

                  <TableCell>

                    {album.createdAt
                      ? new Date(
                          album.createdAt
                        ).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  <TableCell>

                    {album.updatedAt
                      ? new Date(
                          album.updatedAt
                        ).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  {/* ========================================= */}
                  {/* ACTIONS */}
                  {/* ========================================= */}

                  <TableCell className="text-right">

                    <AlertDialog>

                      <DropdownMenu>

                        {/* IMPORTANT FIX */}
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
                                `/dashboard-artist/albums-artist/albums-edit/${album._id}`
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

                      {/* ========================================= */}
                      {/* DELETE DIALOG */}
                      {/* ========================================= */}

                      <AlertDialogContent>

                        <AlertDialogHeader>

                          <AlertDialogTitle>
                            Delete Album?
                          </AlertDialogTitle>

                          <AlertDialogDescription>

                            Are you sure you want to delete{" "}

                            <strong>
                              {album.title}
                            </strong>

                            ?

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
                              handleDelete(album._id)
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