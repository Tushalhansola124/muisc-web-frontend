"use server";

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import axios from "axios";

// ======================================================
// INTERFACES
// ======================================================

export interface IArtist {
  _id: string;
  name: string;
  bio: string;
  image: string;
  imageFileId?: string;
  followers: number;
  userId?: string | { _id: string };
  user?: { _id: string };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ISingleArtistResponse {
  success: boolean;
  message?: string;
  data: {
    artist: IArtist;
    totalSongs: number;
    songs: any[];
  };
}

export interface IArtistsResponse {
  success: boolean;
  count?: number;
  data: IArtist[];
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

// ======================================================
// TOKEN HELPER
// ======================================================

const getAuthHeaders = async () => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL ARTISTS
// ======================================================

export const GetArtists = async () => {
  try {
    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.artist.get}`
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

export const CreateArtist = async (data: FormData) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.artist.add,
      data,
      {
        headers: {
          ...headers,
          // Do NOT force Content-Type for FormData
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE ARTIST ERROR :", error);
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Create Artist Failed"
    );
  }
};

// ======================================================
// GET ARTIST BY ID  (FIXED)
// ======================================================

export const GetArtistById = async (
  id: string
): Promise<ISingleArtistResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.artist.getById}${id}`,
      { headers }
    );

    console.log("✅ Artist Data Received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ GetArtistById Error:", {
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

export const UpdateArtist = async (id: string, data: FormData) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.artist.update}${id}`,
      data,
      {
        headers: {
          ...headers,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("UPDATE ARTIST ERROR :", error);
    throw new Error(
      error?.response?.data?.message || "Update Artist Failed"
    );
  }
};

// ======================================================
// DELETE ARTIST
// ======================================================

export const DeleteArtist = async (id: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.artist.delete}${id}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Delete Artist Failed"
    );
  }
};

// ======================================================
// GET OWN ARTIST
// ======================================================

export const GetOwnArtist = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.artist.getOwnArtist}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Own Artist"
    );
  }
};