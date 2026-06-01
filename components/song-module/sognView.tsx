"use client"

import { MoreHorizontalIcon, Plus, Play } from "lucide-react"
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
  DeleteSong,
  GetSongs,
} from "./controller"
import { useSession } from "next-auth/react"

type Song = {
  _id: string
  title: string
  description: string
  artist: string
  album: string
  genre: string[]
  duration: number
  audioUrl: string
  thumbnail: string
  plays: number
  likes: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export function SongsTables() {

  const [songs, setSongs] = useState<Song[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

   
  const router = useRouter()

  // =========================================
  // LOAD SONGS
  // =========================================

  const loadSongs = async () => {
     const token = session?.user?.token
    if(!token) return 
    setLoading(true)
   

    try {

      const res = await GetSongs(token)

      console.log("Songs Response:", res)

      if (
        res.success ||
        res.status === 200 ||
        res.status === 201
      ) {

        setSongs(res.data || [])

      } else {

        toast.error(
          res.message || "Failed to load songs"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to load songs"
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadSongs()
  }, [])

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredSongs = songs.filter((song) =>
    `${song.title} ${song.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // =========================================
  // DELETE SONG
  // =========================================

  const handleDelete = async (_id: string) => {
     const token = session?.user?.token
    if(!token) return 
    try {

      const res = await DeleteSong(_id,token)

      if (
        res.success ||
        res.status === 200
      ) {

        toast.success(
          res.message || "Song deleted successfully"
        )

        loadSongs()

      } else {

        toast.error(
          res.message || "Failed to delete song"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to delete song"
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
            placeholder="Search songs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full sm:w-80 lg:w-96"
          />

        </div>

        <Button
          onClick={() =>
            router.push("/dashboard/songs/song-add")
          }
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Song
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
                Thumbnail
              </TableHead>

              <TableHead>
                Title
              </TableHead>

              <TableHead>
                Description
              </TableHead>

              <TableHead>
                Duration
              </TableHead>

              <TableHead>
                Audio
              </TableHead>

              <TableHead>
                Plays
              </TableHead>

              <TableHead>
                Likes
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Created At
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
                  colSpan={11}
                  className="text-center py-10"
                >
                  Loading songs...
                </TableCell>

              </TableRow>

            ) : filteredSongs.length === 0 ? (

              /* ========================================= */
              /* EMPTY */
              /* ========================================= */

              <TableRow>

                <TableCell
                  colSpan={11}
                  className="text-center py-10"
                >
                  No songs found
                </TableCell>

              </TableRow>

            ) : (

              /* ========================================= */
              /* DATA */
              /* ========================================= */

              filteredSongs.map((song, index) => (

                <TableRow key={song._id}>

                  <TableCell>
                    {index + 1}
                  </TableCell>

                  {/* ========================================= */}
                  {/* THUMBNAIL */}
                  {/* ========================================= */}

                  <TableCell>

                    {song.thumbnail ? (

                      <a
                        href={song.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-14 h-14 rounded-md object-cover border cursor-pointer hover:opacity-80 transition"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg"
                          }}
                        />

                      </a>

                    ) : (

                      <div className="w-14 h-14 bg-zinc-200 rounded-md" />

                    )}

                  </TableCell>

                  {/* ========================================= */}
                  {/* TITLE */}
                  {/* ========================================= */}

                  <TableCell className="font-medium min-w-[150px]">
                    {song.title}
                  </TableCell>

                  {/* ========================================= */}
                  {/* DESCRIPTION */}
                  {/* ========================================= */}

                  <TableCell className="max-w-[250px] truncate">
                    {song.description}
                  </TableCell>

                  {/* ========================================= */}
                  {/* DURATION */}
                  {/* ========================================= */}

                  <TableCell>
                    {song.duration} sec
                  </TableCell>

                  {/* ========================================= */}
                  {/* AUDIO */}
                  {/* ========================================= */}

                  <TableCell>

                    {song.audioUrl ? (

                      <a
                        href={song.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:underline"
                      >

                        <Play className="h-4 w-4" />

                        Play

                      </a>

                    ) : (

                      <span className="text-muted-foreground">
                        No Audio
                      </span>

                    )}

                  </TableCell>

                  {/* ========================================= */}
                  {/* PLAYS */}
                  {/* ========================================= */}

                  <TableCell>
                    {song.plays}
                  </TableCell>

                  {/* ========================================= */}
                  {/* LIKES */}
                  {/* ========================================= */}

                  <TableCell>
                    {song.likes}
                  </TableCell>

                  {/* ========================================= */}
                  {/* STATUS */}
                  {/* ========================================= */}

                  <TableCell>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        song.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {song.isPublished
                        ? "Published"
                        : "Draft"}
                    </span>

                  </TableCell>

                  {/* ========================================= */}
                  {/* CREATED DATE */}
                  {/* ========================================= */}

                  <TableCell>

                    {song.createdAt
                      ? new Date(
                          song.createdAt
                        ).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  {/* ========================================= */}
                  {/* ACTIONS */}
                  {/* ========================================= */}

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
                                `/dashboard/songs/song-edit/${song._id}`
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                            <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/songs/view-song/${song._id}`
                              )
                            }
                          >
                            View List
                          </DropdownMenuItem>


                          <DropdownMenuSeparator />

                          {/* DELETE */}

                          <AlertDialogTrigger>

                            <button
                              type="button"
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
                            Delete Song?
                          </AlertDialogTitle>

                          <AlertDialogDescription>

                            Are you sure you want to delete{" "}
                            <strong>
                              {song.title}
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
                              handleDelete(song._id)
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