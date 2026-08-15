'use server';

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import axios from "axios";

// ======================================================
// HISTORY INTERFACES
// ======================================================

export interface HistoryArtist {
  _id: string;
  name: string;
  image: string;
}

export interface HistorySong {
  _id: string;
  title: string;
  artist: HistoryArtist;
  duration: number;
  thumbnail: string;
}

export interface HistoryItem {
  _id: string;
  song: HistorySong;
  playedAt: string;
}

export interface IHistoryResponse {
  success: boolean;
  message: string;
  data: HistoryItem[];
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: SERVER_URL || process.env.SERVER_URL2,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// TOKEN HELPER (same as Artist)
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
// GET HISTORY
// ======================================================

export const GetHistory = async (): Promise<IHistoryResponse> => {
  try {
    const headers = await getAuthHeaders();
    console.log("GET HISTORY Endpoint::", API_ENDPOINTS.history.get);
    const response = await axiosInstance.get(
      API_ENDPOINTS.history.get,
      { headers }
    );

    console.log("GET HISTORY RESPONSE:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("GET HISTORY ERROR:", error);

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (error.response?.status === 404) {
      throw new Error("History endpoint not found. Check API_ENDPOINTS.");
    }

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch History"
    );
  }
};

// ======================================================
// ADD TO HISTORY
// ======================================================

export const AddToHistory = async (songId: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.history.add,
      { songId },
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("ADD TO HISTORY ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Add To History Failed"
    );
  }
};

// ======================================================
// CLEAR HISTORY
// ======================================================

export const ClearHistory = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      API_ENDPOINTS.history.clearHistory,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("CLEAR HISTORY ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Clear History Failed"
    );
  }
};

// ======================================================
// DELETE HISTORY ITEM
// ======================================================

export const DeleteHistory = async (historyId: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.history.deleteHistory}${historyId}`,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("DELETE HISTORY ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Delete History Failed"
    );
  }
};