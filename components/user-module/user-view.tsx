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
  DeleteUser,
  GetUsers,
} from "@/components/user-module/user-controller"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type User = {
  _id: string
  firstName: string
  lastName: string
  username: string
  email: string
  mobileNumber: string
  role: string
  profileImage?: string
}

export function UsersTable() {

  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin" | "artist">("all")
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const router = useRouter()

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await GetUsers()
      if (res.success) {
        setUsers(res.data || [])
      } else {
        toast.error("Failed to load users")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Filtering
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName} ${user.username}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesRole = 
      roleFilter === "all" || user.role.toLowerCase() === roleFilter

    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = async (_id: string) => {
    try {
      const res = await DeleteUser(_id)
      if (res.success) {
        toast.success(res.message || "User deleted successfully")
        loadUsers()
      } else {
        toast.error(res.message || "Failed to delete user")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user")
    }
  }

  return (
    <div className="space-y-4">

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">

          <Input
            placeholder="Search by name or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 lg:w-96"
          />

          <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="artist">Artist</SelectItem>
            </SelectContent>
          </Select>

        </div>

        <Button
          onClick={() => router.push("/dashboard/users/user-add")}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>

      </div>

      {/* Total Records */}
      <div className="text-sm text-muted-foreground pl-1">
        Total Records: <strong>{filteredUsers.length}</strong>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : user.role === "artist"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/users/user-edit/${user._id}`)}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-accent rounded-sm">
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{user.firstName} {user.lastName}</strong>?
                                <br />This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}