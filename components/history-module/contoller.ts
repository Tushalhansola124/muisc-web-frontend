'use server';

import axios from "axios";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

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
  baseURL: SERVER_URL,
});

// ======================================================
// GET HISTORY
// ======================================================

export const GetHistory = async (
  token: string
): Promise<IHistoryResponse> => {
  try {
    
    const response = await axiosInstance.get(API_ENDPOINTS.history.get, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("GET HISTORY RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("GET HISTORY ERROR:", error);

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

export const AddToHistory = async (songId: string, token: string) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.history.add}`,
      { songId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

export const ClearHistory = async (token: string) => {
  try {
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.history.clearHistory}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

export const DeleteHistory = async (historyId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.history.deleteHistory}${historyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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