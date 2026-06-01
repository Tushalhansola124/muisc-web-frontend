"use server";

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

import axios from "axios";

// ======================================================
// ALBUM INTERFACES
// ======================================================

export interface Artist {
  _id: string;
  name: string;
  bio: string;
  image: string;
  imageFileId: string;
  followers: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAlbum {
  _id: string;
  title: string;
  artist?: Artist | string;
  coverImage: string;
  releaseDate: string;
  songs: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAlbumsResponse {
  success: boolean;
  data: IAlbum[];
  status: number;
  message: string;
}

export interface ISingleAlbumResponse {
  success: boolean;
  data: IAlbum;
}

export interface CreateAlbumPayload {

  title: string;
  artist: string;
  releaseDate: string;
  songs?: string[];
  coverImage?: string;
}

export interface UpdateAlbumPayload {
  title?: string;
  artist?: string;
  releaseDate?: string;
  songs?: string[];
  coverImage?: string;
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

  const token = session?.user?.token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL ALBUMS
// ======================================================

export const GetAlbums = async (): Promise<IAlbumsResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.album.get,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "GET ALBUMS ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Albums"
    );
  }
};

// ======================================================
// CREATE ALBUM
// ======================================================

export const CreateAlbum = async (
  data: FormData
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.album.add,
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

    console.log(
      "CREATE ALBUM ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Create Album Failed"
    );
  }
};

// ======================================================
// GET ALBUM BY ID
// ======================================================

export const GetAlbumById = async (
  id: string
): Promise<ISingleAlbumResponse> => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.album.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "GET ALBUM BY ID ERROR:",
      error
    );

    if (error.response?.status === 404) {
      throw new Error("Album not found");
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Album"
    );
  }
};

// ======================================================
// UPDATE ALBUM
// ======================================================

export const UpdateAlbum = async (
  id: string,
  data: FormData
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.album.update}${id}`,
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

    console.log(
      "UPDATE ALBUM ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Update Album Failed"
    );
  }
};

// ======================================================
// DELETE ALBUM
// ======================================================

export const DeleteAlbum = async (
  id: string
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.album.delete}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "DELETE ALBUM ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Delete Album Failed"
    );
  }
};