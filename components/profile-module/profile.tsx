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

  if (initialLoading)
    return (
      <div className="min-h-screen bg-black text-center py-20 text-zinc-400">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-2 text-white">My Profile</h1>
        <p className="text-zinc-400 mb-8">Manage your personal information</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE - PROFILE INFO */}
          <div className="lg:col-span-5">
            <Card className="p-8 h-full bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-40 h-40 border-4 border-purple-600 shadow-[0_0_30px_-5px_rgba(147,51,234,0.6)]">
                  <AvatarImage src={preview || ""} alt="Profile" />
                  <AvatarFallback className="text-6xl bg-zinc-800 text-purple-400">
                    {session?.user?.firstName?.[0]}
                    {session?.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-semibold mt-6 text-white">
                  {session?.user?.firstName} {session?.user?.lastName}
                </h2>
                <p className="text-zinc-400">@{session?.user?.userName}</p>

                <Badge className="mt-3 bg-purple-600 hover:bg-purple-600 text-white border-0 rounded-full px-4">
                  {session?.user?.role?.toUpperCase()}
                </Badge>

                <div className="w-full mt-8 space-y-4 text-left">
                  <div>
                    <p className="text-xs text-zinc-500 tracking-wide">
                      EMAIL ADDRESS
                    </p>
                    <p className="text-zinc-200">{session?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 tracking-wide">
                      MOBILE NUMBER
                    </p>
                    <p className="text-zinc-200">
                      {session?.user?.mobileNumber}
                    </p>
                  </div>
                </div>

                <Label
                  htmlFor="profileImage"
                  className="mt-8 cursor-pointer text-purple-400 hover:text-purple-300 hover:underline text-sm"
                >
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
            <Card className="bg-zinc-900/60 border border-zinc-800 rounded-2xl">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">First Name</Label>
                      <Input
                        {...register("firstName")}
                        className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-purple-600 focus-visible:border-purple-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Last Name</Label>
                      <Input
                        {...register("lastName")}
                        className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-purple-600 focus-visible:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Username</Label>
                    <Input
                      {...register("username")}
                      className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-purple-600 focus-visible:border-purple-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Email Address</Label>
                    <Input
                      type="email"
                      {...register("email")}
                      className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-purple-600 focus-visible:border-purple-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300">Mobile Number</Label>
                    <Input
                      {...register("mobileNumber")}
                      className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-purple-600 focus-visible:border-purple-600"
                    />
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      className="flex-1 bg-transparent border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-full"
                    >
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}