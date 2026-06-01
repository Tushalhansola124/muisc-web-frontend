"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateUserSchema, CreateUserFormData } from "@/schemas/user";
import { CreateUser, UpdateUser, GetUserById } from "@/components/user-module/user-controller";
import { MoveLeft } from "lucide-react";

interface UserFormProps {
  userId?: string;
  isEdit?: boolean;
}
export default function UserForm({
  userId,
  isEdit = false,
}: UserFormProps) {
  const router = useRouter();
  const params = useParams();
//   const userId = params.id as string | undefined;
//   const isEdit = !!userId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,                    // ← Added this
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { role: "user" },
  });

  const selectedRole = watch("role");

  // Fetch user data for Edit mode
  useEffect(() => {
    if (!isEdit || !userId) return;

    const fetchUser = async () => {
      setInitialLoading(true);
      try {
        const res = await GetUserById(userId);
        console.log(" Fetched User Data:", res);

        if (res.success && res.data) {
          const user = res.data;

          setValue("firstName", user.firstName || "");
          setValue("lastName", user.lastName || "");
          setValue("username", user.username || "");
          setValue("email", user.email || "");
          setValue("mobileNumber", user.mobileNumber || "");
          setValue("role", user.role as "user" | "admin");

          if (user.profileImage) {
            setPreview(user.profileImage);
          }
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, [isEdit, userId, setValue]);

  const onSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "profileImage" && value?.[0]) {
        formData.append("profileImage", value[0]);
      } else if (value && value !== "") {
        formData.append(key, value as string);
      }
    });

    try {
      if (isEdit && userId) {
       const res =  await UpdateUser(userId, formData);
       console.log("Update Response:", res);
         if(res.success){
                toast.success(res.message || "User updated successfully!");
                router.push("/dashboard/users");
         }
         else{
                toast.error(res.message || "Failed to update user");
         }
      } else {
        const res = await CreateUser(formData);
        if(res.success){
            toast.success(res.message || "User created successfully!");
            router.push("/dashboard/users");
        }
        else{
            toast.error(res.message || "Failed to create user");
        }
      }
      
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading user data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <Button 
        onClick={()=>router.back()}
        className="w-[6vw] mx-5"><MoveLeft/>Back</Button>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEdit ? "Edit User" : "Create New User"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isEdit ? "Update user information" : "Add a new user to the platform"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="Tushal" {...register("firstName")} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Hansola" {...register("lastName")} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="tushal151" {...register("username")} />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="tushal@gmail.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="5623562353" {...register("mobileNumber")} />
                {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={selectedRole || ""} 
                  onValueChange={(value) => setValue("role", value as "user" | "admin")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="user">User</SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("profileImage", e.target.files);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {preview && (
                <img src={preview} alt="Preview" className="w-28 h-28 object-cover rounded-lg border mt-2" />
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update User" : "Create User")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}