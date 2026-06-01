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
import { DeletePlaylist, GetPlaylists } from "./controller"

type Playlist = {
  _id: string
  name: string
  description?: string
  user: string
  songs: any[]           // Array of songs
  createdAt: string
  updatedAt: string
}

export function PlaylistsTable() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loadPlaylists = async () => {
    setLoading(true)
    try {
      const res = await GetPlaylists()
      if (res.success || res.status === 200) {
        setPlaylists(res.data || [])
      } else {
        toast.error(res.message || "Failed to load playlists")
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to load playlists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(search.toLowerCase()) ||
    (playlist.description && playlist.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDelete = async (_id: string) => {
    try {
      const res = await DeletePlaylist(_id)
      if (res.success || res.status === 200) {
        toast.success(res.message || "Playlist deleted successfully")
        loadPlaylists()
      } else {
        toast.error(res.message || "Failed to delete playlist")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete playlist")
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
          <Input
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 lg:w-96"
          />
        </div>

        <Button
          onClick={() => router.push("/dashboard/playlists/palylist-add")}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Playlist
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Playlist Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Songs Count</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading playlists...
                </TableCell>
              </TableRow>
            ) : filteredPlaylists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No playlists found
                </TableCell>
              </TableRow>
            ) : (
              filteredPlaylists.map((playlist, index) => (
                <TableRow key={playlist._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{playlist.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {playlist.description || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{playlist.songs?.length || 0}</span> songs
                  </TableCell>
                  <TableCell>
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(playlist.updatedAt).toLocaleDateString()}
                  </TableCell>
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

                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/playlists/playlists-edit/${playlist._id}`
                              )
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <AlertDialogTrigger>

                            <button
                              className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-accent rounded-sm"
                            >
                              Delete
                            </button>

                          </AlertDialogTrigger>

                        </DropdownMenuContent>

                      </DropdownMenu>

                      <AlertDialogContent>

                        <AlertDialogHeader>

                          <AlertDialogTitle>
                            Delete Playlist?
                          </AlertDialogTitle>

                          <AlertDialogDescription>

                            Are you sure you want to delete
                            <strong> {playlist.name}</strong> ?

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
                              handleDelete(playlist._id)
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