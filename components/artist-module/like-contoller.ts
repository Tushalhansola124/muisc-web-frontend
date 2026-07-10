"use server";

import axios from "axios";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import { ISong } from "../song-module/controller";

// ======================================================
// INTERFACES
// ======================================================

export interface ILikeArtistResponse {
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
// LIKE / UNLIKE ARTIST
// ======================================================

export const LikeArtist = async (
  artistId: string,
  token: string
): Promise<ILikeArtistResponse> => {
  try {
    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.artist.likeArtist}${artistId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE ARTIST ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Artist"
    );
  }
};

export const UnLikeArtist = async (
  artistId: string,
  token: string
): Promise<ILikeArtistResponse> => {
  try {
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.artist.unlikeArtist}${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE ARTIST ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Song"
    );
  }
};



export const isLikeSong = async (
  artistId: string,
  token: string
): Promise<ILikeArtistResponse> => {
  try {
    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.artist.isLikeArtist}${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("LIKE ARTIST ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Like Artist"
    );
  }
};
