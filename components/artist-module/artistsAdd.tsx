"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeftIcon } from "lucide-react";

import { CreateArtist, UpdateArtist, GetArtistById } from "./controller";
import { GetUsers } from "../user-module/user-controller";

type ArtistFormProps = {
  artistId?: string;
  isEdit?: boolean;
};

type UserOption = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export default function ArtistForm({ artistId, isEdit = false }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [preview, setPreview] = useState<string | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      bio: "",
      userId: "",           // New field for selected user
    },
  });

  // Fetch Users for Dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await GetUsers();
        if (res.success && res.data) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Artist Data for Edit
  useEffect(() => {
    if (!isEdit || !artistId) {
      setInitialLoading(false);
      return;
    }

    const fetchArtist = async () => {
      setInitialLoading(true);
      try {
        const res = await GetArtistById(artistId);
        if (res.success && res.data) {
          const artist = res.data;
          setValue("name", artist.name || "");
          setValue("bio", artist.bio || "");
          setValue("userId", artist.userId || ""); // if you have userId in artist
          if (artist.image) setPreview(artist.image);
        }
      } catch (error: any) {
        toast.error("Failed to load artist data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchArtist();
  }, [isEdit, artistId, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("bio", data.bio);
    if (data.userId) formData.append("userId", data.userId);

    const fileInput = (document.getElementById("image") as HTMLInputElement)?.files;
    if (fileInput?.[0]) {
      formData.append("image", fileInput[0]);
    }

    try {
      if (isEdit && artistId) {
        await UpdateArtist(artistId, formData);
        toast.success("Artist updated successfully!");
      } else {
        await CreateArtist(formData);
        toast.success("Artist created successfully!");
      }
      router.push("/dashboard/artists");
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading artist data...</div>;
  }

  return (
    <div className="max-w-8xl mx-10 py-10 px-4">
      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <MoveLeftIcon className="h-5 w-5" /> Back
            </Button>
            <CardTitle className="text-3xl font-bold">
              {isEdit ? "Edit Artist" : "Create New Artist"}
            </CardTitle>
          </div>
          <p className="text-muted-foreground mt-2">
            {isEdit ? "Update artist details and profile" : "Add a new artist to your music platform"}
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Artist Name */}
            <div className="space-y-2">
              <Label>Artist Name</Label>
              <Input placeholder="Arijit Singh" {...register("name")} />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>Biography</Label>
              <Textarea
                placeholder="Enter detailed biography of the artist..."
                rows={6}
                {...register("bio")}
              />
            </div>

            {/* User Dropdown */}
            <div className="space-y-2">
              <Label>Associated User</Label>

              <Select
                value={watch("userId") || ""}
                onValueChange={(val) => setValue("userId", val)}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select User">
                    {users.find((u) => u._id === watch("userId"))
                      ? `${users.find((u) => u._id === watch("userId"))?.firstName} ${users.find((u) => u._id === watch("userId"))?.lastName}`
                      : ""}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      key={user._id}
                      value={user._id}
                    >
                      <div className="flex flex-col py-1">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <Input id="image" type="file" accept="image/*" />
              {preview && (
                <div className="mt-4">
                  <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border shadow" />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (isEdit ? "Updating Artist..." : "Creating Artist...") : (isEdit ? "Update Artist" : "Create Artist")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}