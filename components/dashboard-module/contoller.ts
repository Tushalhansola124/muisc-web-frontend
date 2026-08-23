"use server";

import { auth } from "@/auth";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import axios from "axios";

// ======================================================
// DASHBOARD INTERFACES
// ======================================================

export interface IAdminDashboardTotals {
  users: number;
  artists: number;
  songs: number;
  albums: number;
  genres: number;
  playlists: number;
  historyPlays: number;
}

export interface IAdminSongStats {
  published: number;
  draft: number;
  totalLikes: number;
  totalPlays: number;
}

export interface IAdminUsersByRole {
  admin: number;
  artist: number;
  user: number;
}

export interface IAdminTopSong {
  _id: string;
  title: string;
  artist: {
    _id: string;
    name: string;
    image: string;
  };
  thumbnail: string;
  plays: number;
  likes: number;
}

export interface IAdminRecentUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface IAdminRecentSong {
  _id: string;
  title: string;
  artist: {
    _id: string;
    name: string;
  };
  plays: number;
  likes: number;
  isPublished: boolean;
  createdAt: string;
}

export interface IAdminDashboardData {
  totals: IAdminDashboardTotals;
  songStats: IAdminSongStats;
  usersByRole: IAdminUsersByRole;
  topPlayedSongs: IAdminTopSong[];
  topLikedSongs: IAdminTopSong[];
  recentUsers: IAdminRecentUser[];
  recentSongs: IAdminRecentSong[];
}

export interface IAdminDashboardResponse {
  success: boolean;
  message: string;
  data: IAdminDashboardData;
}

// Artist dashboard counts
export interface IArtistDashboardData {
  users: number;
  artists: number;
  songs: number;
  albums: number;
  genres: number;
  playlists: number;
}

export interface IArtistDashboardResponse {
  success: boolean;
  message: string;
  data: IArtistDashboardData;
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

  console.log("TOKEN :", token);

  if (!token) {
    throw new Error("Unauthorized");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ======================================================
// GET ADMIN DASHBOARD STATS
// ======================================================

export const GetAdminDashboardStats = async (): Promise<IAdminDashboardResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.dashboard.admin,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error("GET ADMIN DASHBOARD STATS ERROR:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Admin Dashboard Stats"
    );
  }
};

// ======================================================
// GET ARTIST DASHBOARD COUNTS
// ======================================================

export const GetArtistDashboardCounts = async (): Promise<IArtistDashboardResponse> => {
  try {
    const headers = await getAuthHeaders();

    const response = await axiosInstance.get(
      API_ENDPOINTS.dashboard.artist,
      { headers }
    );

    return response.data;
  } catch (error: any) {
    console.error("GET ARTIST DASHBOARD COUNTS ERROR:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed To Fetch Artist Dashboard Counts"
    );
  }
};