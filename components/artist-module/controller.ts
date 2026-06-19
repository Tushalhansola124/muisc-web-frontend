'use server';

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

import axios from "axios";

import { cookies } from "next/headers";

// ======================================================
// USER INTERFACES
// ======================================================

export interface IArtist {
  songs: never[];
  artist: any;
  _id: string
  name: string
  bio: string
  image: string
  imageFileId: string
  followers: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IUserResponse {
  success: boolean;
  count: number;
  data: IArtist[];
}

export interface ISingleArtistResponse {
  success: boolean;
  data: IArtist;
}

export interface RegisterPayload {
  name: string
  bio: string
  image: string
}

export interface UpdateArtistPayload {
  name: string
  bio: string
  image: string
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

export const GetArtists = async () => {
  try {

    // const headers =
    //   await getAuthHeaders();

    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.artist.get}`,
  
    );

    return response.data;

  } catch (error: any) {

   

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Artists"
    );
  }
};


// ======================================================
// CREATE ARTIST
// ======================================================

export const CreateArtist = async (
  data: FormData
) => {
  try {

    const headers =
      await getAuthHeaders();

    const response =
      await axiosInstance.post(
        API_ENDPOINTS.artist.add,
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
      "CREATE ARTIST ERROR :",
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
// GET ARTIST BY ID
// ======================================================

export const GetArtistById = async (
  id: string
): Promise<ISingleArtistResponse> => {
  try {
    // const headers = await getAuthHeaders();



    const response = await axiosInstance.get(
      `${API_ENDPOINTS.artist.getById}${id}`,
     
    );

    console.log("✅ Artist Data Received:", response.data);

    return response.data;

  } catch (error: any) {
    console.error("❌ GetArtistById Error Details:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error.response?.data,
    });

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error.response?.status === 404) {
      throw new Error("Artist not found");
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Artist"
    );
  }
};



// ======================================================
// UPDATE ARTIST
// ======================================================

export const UpdateArtist = async (
  id: string,
  data: FormData
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.artist.update}${id}`,
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

export const DeleteArtist = async (
  id: string
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.artist.delete}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      "Delete Artist Failed"
    );
  }
};