"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateArtist, UpdateArtist, GetArtistById } from "./controller";
import { MoveLeftIcon } from "lucide-react";

type ArtistFormProps = {
  artistId?: string;
  isEdit?: boolean;
};

export default function ArtistForm({ artistId, isEdit = false }: ArtistFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", bio: "" },
  });

  // Fetch data for Edit mode
  useEffect(() => {
    if (!isEdit || !artistId) {
      setInitialLoading(false);
      return;
    }

    const fetchArtist = async () => {
      setInitialLoading(true);
      try {
        const res = await GetArtistById(artistId);
        console.log("✅ Fetched Artist:", res);

        if (res.success && res.data) {
          const artist = res.data;
          setValue("name", artist.name || "");
          setValue("bio", artist.bio || "");
          if (artist.image) setPreview(artist.image);
        } else {
          toast.error("Artist not found");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to load artist data");
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
    <div className="max-w-8xl flex justify-center w-auto py-10 px-4">
       
      <Card>
          <Button 
          onClick={()=>router.back()}
          className="w-30 mx-4"><MoveLeftIcon/>Back</Button>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEdit ? "Edit Artist" : "Create New Artist"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isEdit ? "Update artist information" : "Add a new artist to the platform"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Artist Name</Label>
              <Input placeholder="Arijit Singh" {...register("name")} />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea placeholder="Enter artist biography..." rows={5} {...register("bio")} />
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <Input id="image" type="file" accept="image/*" />
              {preview && (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border mt-3" />
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Artist" : "Create Artist")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}