"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGenre, GetGenreById, UpdateGenre } from "./controller";


type GenreFormProps = {
  genreId?: string;
  isEdit?: boolean;
};

export default function GenreForm({ genreId, isEdit = false }: GenreFormProps) {
  const router = useRouter();
  const params = useParams();
  const idFromUrl = params.id as string | undefined;
  const finalId = genreId || idFromUrl;
  const isEditMode = isEdit || !!finalId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // Fetch data if in Edit mode
  useEffect(() => {
    if (!isEditMode || !finalId) {
      setInitialLoading(false);
      return;
    }

    const fetchGenre = async () => {
      setInitialLoading(true);
      try {
        const res = await GetGenreById(finalId);
        if (res.success && res.data) {
          setValue("name", res.data.name);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load genre data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchGenre();
  }, [isEditMode, finalId, setValue]);

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    try {
      if (isEditMode && finalId) {
        const res = await UpdateGenre(finalId, { name: data.name });
        if(res.success || res.status === 200){
             toast.success(res.message || "Genre updated successfully!");
             router.push("/dashboard/genres")
        }
        else{
            toast.error(res.message || "Failed to update genre");
        }
      } else {
        const res = await CreateGenre({ name: data.name });
        if(res.success || res.status === 201){
             toast.success(res.message || "Genre created successfully!");
             router.push("/dashboard/genres")
        }
        else{
            toast.error(res.message || "Failed to create genre");
        }
      }
      
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading genre data...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEditMode ? "Edit Genre" : "Create New Genre"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isEditMode 
              ? "Update genre information" 
              : "Add a new genre to your music platform"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Genre Name</Label>
              <Input
                id="name"
                placeholder="Pop, Rock, Hip-Hop, etc."
                {...register("name")}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Genre" : "Create Genre")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}