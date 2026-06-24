"use server";

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";

import axios from "axios";

// ======================================================
// PLAYLIST INTERFACES
// ======================================================

export interface IPlaylist {
  _id: string;
  name: string;
  description?: string;
  user: string;
  songs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPlaylistsResponse {
  success: boolean;
  status: number;
  message: string;
  data: IPlaylist[];
}

export interface ISinglePlaylistResponse {
  success: boolean;
  status: number;
  message: string;
  data: IPlaylist;
}

export interface CreatePlaylistPayload {
  name: string;
  description?: string;
  songs?: string[];
}

export interface UpdatePlaylistPayload {
  name?: string;
  description?: string;
  songs?: string[];
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
   console.log("TOKEN :", token);

//   console.log("TOKEN :", token);

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ALL PLAYLISTS
// ======================================================

export const GetPlaylists = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await axios.get(
      `${SERVER_URL}${API_ENDPOINTS.playlist.get}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Playlists"
    );
  }
};

// ======================================================
// CREATE PLAYLIST
// ======================================================

// export const CreatePlaylist = async (
// playlistId: string, songId: string, data: CreatePlaylistPayload) => {
//   try {
//     const headers = await getAuthHeaders();

//     const response = await axiosInstance.post(
//       API_ENDPOINTS.playlist.add,
//       data,
//       {
//         headers,
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     console.log("CREATE PLAYLIST ERROR:", error);

//     throw new Error(
//       error?.response?.data?.message ||
//       error?.message ||
//       "Create Playlist Failed"
//     );
//   }
// };

export const CreatePlaylist = async (
  playlistId: string, 
  songId: string, 
  data: CreatePlaylistPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.post(
      API_ENDPOINTS.playlist.add,       
      {
        playlistId,
        songId,
        ...data
      },
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.log("CREATE PLAYLIST ERROR:", error);
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Create Playlist Failed"
    );
  }
};

// ======================================================
// GET PLAYLIST BY ID
// ======================================================

export const GetPlaylistById = async (
  id: string
): Promise<ISinglePlaylistResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.playlist.getById}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("GET PLAYLIST BY ID ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Playlist"
    );
  }
};

// ======================================================
// UPDATE PLAYLIST
// ======================================================

export const UpdatePlaylist = async (
  id: string,
  data: UpdatePlaylistPayload
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.put(
      `${API_ENDPOINTS.playlist.update}${id}`,
      data,
      { headers }
    );

    console.log("UPDATE PLAYLIST SUCCESS:", response.data);
    return response.data;

  } catch (error: any) {
    console.error("UPDATE PLAYLIST FULL ERROR:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Update Playlist Failed"
    );
  }
};

// ======================================================
// DELETE PLAYLIST
// ======================================================

export const DeletePlaylist = async (
id: string, songId: string) => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.playlist.delete}${id}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("DELETE PLAYLIST ERROR:", error);

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Delete Playlist Failed"
    );
  }
};

// =====================================
// ADD SONG TO PLAYLIST
// =====================================
export const AddSongToPlaylist = async (
  playlistId: string,
  songId: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.playlist.addSong}${playlistId}/${songId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("ADD SONG TO PLAYLIST FULL ERROR:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 403) {
      throw new Error("Access denied. You can only modify your own playlists.");
    }

    throw new Error(
      error?.response?.data?.message || 
      "Failed To Add Song To Playlist"
    );
  }
};

// =====================================
// REMOVE SONG FROM PLAYLIST
// =====================================
export const RemoveSongFromPlaylist = async (
  playlistId: string,
  songId: string,
  token: string
) => {
  try {
    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.playlist.removeSong}${playlistId}/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("REMOVE SONG FROM PLAYLIST FULL ERROR:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 403) {
      throw new Error("Access denied. You can only modify your own playlists.");
    }

    throw new Error(
      error?.response?.data?.message || 
      "Failed To Remove Song From Playlist"
    );
  }
};