"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { GetUserById, UpdateUser } from "@/components/user-module/user-controller";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      mobileNumber: "",
    },
  });

  // Fetch Profile
  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await GetUserById(session.user.id);
      if (res.success && res.data) {
        const user = res.data;

        setValue("firstName", user.firstName || "");
        setValue("lastName", user.lastName || "");
        setValue("username", user.username || "");
        setValue("email", user.email || "");
        setValue("mobileNumber", user.mobileNumber || "");

        if (user.profileImage) {
          setPreview(user.profileImage);
        }
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("mobileNumber", data.mobileNumber);

    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      if (session?.user?.id) {
        await UpdateUser(session.user.id, formData);
        toast.success("Profile updated successfully!");
        await update();
        await fetchProfile();
        setSelectedFile(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your personal information</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDE - PROFILE INFO */}
        <div className="lg:col-span-5">
          <Card className="p-8 h-full">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-40 h-40 border-4 border-white shadow-xl">
                <AvatarImage src={preview || ""} alt="Profile" />
                <AvatarFallback className="text-6xl">
                  {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-semibold mt-6">
                {session?.user?.firstName} {session?.user?.lastName}
              </h2>
              <p className="text-muted-foreground">@{session?.user?.userName || session?.user?.username}</p>

              <Badge variant="secondary" className="mt-3">
                {session?.user?.role?.toUpperCase()}
              </Badge>

              <div className="w-full mt-8 space-y-4 text-left">
                <div>
                  <p className="text-xs text-muted-foreground">EMAIL ADDRESS</p>
                  <p>{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">MOBILE NUMBER</p>
                  <p>{session?.user?.mobileNumber}</p>
                </div>
              </div>

              <Label htmlFor="profileImage" className="mt-8 cursor-pointer text-primary hover:underline text-sm">
                Change Profile Picture
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE - EDIT FORM */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input {...register("firstName")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input {...register("lastName")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input {...register("username")} />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" {...register("email")} />
                </div>

                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input {...register("mobileNumber")} />
                </div>

                <div className="flex gap-4 pt-8">
                  <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}