'use server';

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

import axios from "axios";

import { cookies } from "next/headers";

// ======================================================
// USER INTERFACES
// ======================================================

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobileNumber: string;
  role: string;

  profileImage?: string;

  likedSongs: string[];
  playlists: string[];
  followingArtists: string[];

  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  success: boolean;
  count: number;
  data: IUser[];
}

export interface ISingleUserResponse {
  success: boolean;
  data: IUser;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
  profileImage?: string;
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// TOKEN HELPER
// ======================================================

const getAuthHeaders = async () => {

  const session = await auth();

//   console.log("SESSION :", session);

  const token = session?.user?.token;

//   console.log("TOKEN :", token);

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL USERS
// ======================================================

export const GetUsers = async () => {
  try {

    const headers =
      await getAuthHeaders();

    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.user.get}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

   

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Users"
    );
  }
};


// ======================================================
// CREATE USER
// ======================================================

export const CreateUser = async (
  data: FormData
) => {
  try {

    const headers =
      await getAuthHeaders();

    const response =
      await axiosInstance.post(
        API_ENDPOINTS.user.add,
        data,
        {
          headers: {
            ...headers,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;

  } catch (error: any) {

    console.log(
      "CREATE USER ERROR :",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Create User Failed"
    );
  }
};

// ======================================================
// GET USER BY ID
// ======================================================

export const GetUserById = async (
  id: string
): Promise<ISingleUserResponse> => {
  try {
    const headers = await getAuthHeaders();



    const response = await axiosInstance.get(
      `${API_ENDPOINTS.user.getById}${id}`,
      { headers }
    );

    console.log("✅ User Data Received:", response.data);

    return response.data;

  } catch (error: any) {
    console.error("❌ GetUserById Error Details:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error.response?.data,
    });

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error.response?.status === 404) {
      throw new Error("User not found");
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch User"
    );
  }
};



// ======================================================
// UPDATE USER
// ======================================================

export const UpdateUser = async (
  id: string,
  data: FormData
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.user.update}${id}`,
      data,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE USER ERROR :", error);
    throw new Error(
      error?.response?.data?.message || "Update User Failed"
    );
  }
};

// ======================================================
// DELETE USER
// ======================================================

export const DeleteUser = async (
  id: string
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.user.delete}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      "Delete User Failed"
    );
  }
};