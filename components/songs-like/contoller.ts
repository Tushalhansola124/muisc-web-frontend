"use server";

import axios from "axios";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import { ISong } from "../song-module/controller";

// ======================================================
// INTERFACES
// ======================================================

export interface ILikeSongResponse {
  success: boolean;
  message: string;
  likes: number;
  isLiked: boolean;
}

export interface ILikedSongsResponse {
  success: boolean;
  total: number;
  data: ISong[];
}

// ======================================================
// LIKE / UNLIKE SONG
// ======================================================

export const LikeSong = async (
  songId: string,
  token: string
): Promise<ILikeSongResponse> => {
  try {
    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.song.likeSong}${songId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE SONG ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Song"
    );
  }
};

export const UnLikeSong = async (
  songId: string,
  token: string
): Promise<ILikeSongResponse> => {
  try {
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.song.unlikeSong}${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE SONG ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Song"
    );
  }
};



export const isLikeSong = async (
  songId: string,
  token: string
): Promise<ILikeSongResponse> => {
  try {
    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.song.isLikeSong}${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE SONG ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Song"
    );
  }
};
