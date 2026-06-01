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
  DeleteGenre,
  GetGenres,
} from "./controller"

type Genre = {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export function GenresTable() {

  const [genres, setGenres] = useState<Genre[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // =========================================
  // LOAD GENRES
  // =========================================

  const loadGenres = async () => {

    setLoading(true)

    try {

      const res = await GetGenres()

      console.log("Genres Response:", res)

      if (res.success || res.status === 200) {

        setGenres(res.data || [])

      } else {

        toast.error(
          res.message || "Failed to load genres"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to load genres"
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadGenres()
  }, [])

  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredGenres = genres.filter((genre) =>
    genre.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // =========================================
  // DELETE GENRE
  // =========================================

  const handleDelete = async (_id: string) => {

    try {

      const res = await DeleteGenre(_id)

      if (res.success || res.status === 200) {

        toast.success(
          res.message || "Genre deleted successfully"
        )

        // Reload Table
        loadGenres()

      } else {

        toast.error(
          res.message || "Failed to delete genre"
        )

      }

    } catch (error: any) {

      console.error(error)

      toast.error(
        error.message || "Failed to delete genre"
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
            placeholder="Search genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 lg:w-96"
          />

        </div>

        <Button
          onClick={() =>
            router.push("/dashboard/genres/genres-add")
          }
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Genre
        </Button>

      </div>

      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}

      <div className="rounded-md border">

        <Table>

          {/* ========================================= */}
          {/* TABLE HEADER */}
          {/* ========================================= */}

          <TableHeader>

            <TableRow>

              <TableHead>#</TableHead>
              <TableHead>Genre Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>

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
                  colSpan={5}
                  className="text-center py-10"
                >
                  Loading genres...
                </TableCell>

              </TableRow>

            ) : filteredGenres.length === 0 ? (

              /* ========================================= */
              /* EMPTY */
              /* ========================================= */

              <TableRow>

                <TableCell
                  colSpan={5}
                  className="text-center py-10"
                >
                  No genres found
                </TableCell>

              </TableRow>

            ) : (

              /* ========================================= */
              /* DATA */
              /* ========================================= */

              filteredGenres.map((genre, index) => (

                <TableRow key={genre._id}>

                  <TableCell>
                    {index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {genre.name}
                  </TableCell>

                  <TableCell>

                    {genre.createdAt
                      ? new Date(
                          genre.createdAt
                        ).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  <TableCell>

                    {genre.updatedAt
                      ? new Date(
                          genre.updatedAt
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
                                `/dashboard/genres/genres-edit/${genre._id}`
                              )
                            }
                          >
                            Edit
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
                            Delete Genre?
                          </AlertDialogTitle>

                          <AlertDialogDescription>

                            Are you sure you want to delete{" "}
                            <strong>
                              {genre.name}
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
                              handleDelete(genre._id)
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