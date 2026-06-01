'use server';

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

import axios from "axios";

// ======================================================
// GENRE INTERFACES
// ======================================================

export interface IGenre {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IGenreResponse {
  success: boolean;
  data: IGenre[];
  status:number;
  message:string;
}

export interface ISingleGenreResponse {
  success: boolean;
  data: IGenre;
}

export interface CreateGenrePayload {
  name: string;
}

export interface UpdateGenrePayload {
  name?: string;
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
// GET ALL GENRES
// ======================================================

export const GetGenres = async (): Promise<IGenreResponse> => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.genre.get,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "GET GENRES ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Genres"
    );
  }
};

// ======================================================
// CREATE GENRE
// ======================================================

export const CreateGenre = async (
  data: CreateGenrePayload
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.genre.add,
      data,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "CREATE GENRE ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Create Genre Failed"
    );
  }
};

// ======================================================
// GET GENRE BY ID
// ======================================================

export const GetGenreById = async (
  id: string
): Promise<ISingleGenreResponse> => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.genre.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "GET GENRE BY ID ERROR:",
      error
    );

    if (error.response?.status === 404) {
      throw new Error("Genre not found");
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Genre"
    );
  }
};

// ======================================================
// UPDATE GENRE
// ======================================================

export const UpdateGenre = async (
  id: string,
  data: UpdateGenrePayload
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.genre.update}${id}`,
      data,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "UPDATE GENRE ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Update Genre Failed"
    );
  }
};

// ======================================================
// DELETE GENRE
// ======================================================

export const DeleteGenre = async (
  id: string
) => {
  try {

    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.genre.delete}${id}`,
      {
        headers,
      }
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "DELETE GENRE ERROR:",
      error
    );

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Delete Genre Failed"
    );
  }
};