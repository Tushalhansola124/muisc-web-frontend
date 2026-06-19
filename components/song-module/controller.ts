'use server';
import axios from "axios"
import { API_ENDPOINTS } from "@/core/constants/api_endpoint"
import { SERVER_URL } from "@/index"

// ======================================================
// SONG INTERFACES
// ======================================================

export interface Artist {
  _id: string
  name: string
  bio?: string
  image?: string
  followers?: number
}

export interface Album {
  _id: string
  title: string
  coverImage?: string
  releaseDate?: string
}

export interface Genre {
  _id: string
  name: string
}
export interface ISong {
  _id: string
  title: string
  description: string
  artist: Artist
  album: Album 
  genre: Genre[]
  duration: number
  audioUrl: string
  audioPublicId?: string
  thumbnail: string
  isLikedByCurrentUser?: boolean
  thumbnailPublicId?: string
  plays: number
  likes: number
  likedBy?: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}
export interface ISongsResponse {

  success?: boolean
  status: number
  message: string
  data: ISong[]
}



export interface ISingleSongResponse {
  success: boolean
  status: number
  message: string
  data: ISong
}

// ======================================================
// AXIOS INSTANCE
// ======================================================

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
})

// ======================================================
// GET ALL SONGS
// ======================================================

export const GetSongs = async (
): Promise<ISongsResponse> => {

  try {

    const response = await axiosInstance.get(
      API_ENDPOINTS.song.get,
  
    )

    return response.data

  } catch (error: any) {

    console.log("GET SONGS ERROR:", error)

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Songs"
    )
  }
}

// ======================================================
// CREATE SONG
// ======================================================

export const CreateSong = async (
  data: FormData,
  token: string
) => {

  try {

    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.song.add}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data

  } catch (error: any) {

    console.log("CREATE SONG ERROR:", error)

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Create Song Failed"
    )
  }
}

// ======================================================
// GET SONG BY ID
// ======================================================

export const GetSongById = async (
  id: string,

): Promise<ISingleSongResponse> => {

  try {

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.song.getById}${id}`,
      {
  
      }
    )
    // console.log("GET SONG BY ID RESPONSE:", response.data)
    return response.data

  } catch (error: any) {

    console.log("GET SONG BY ID ERROR:", error)

    if (error.response?.status === 404) {
      throw new Error("Song not found")
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Session expired. Please login again."
      )
    }

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Failed To Fetch Song"
    )
  }
}

// ======================================================
// UPDATE SONG
// ======================================================

export const UpdateSong = async (
  id: string,
  data: FormData,
  token: string
) => {

  try {

    const response = await axios.put(
      `${SERVER_URL}${API_ENDPOINTS.song.update}${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data

  } catch (error: any) {

    console.log("UPDATE SONG ERROR:", error)

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Update Song Failed"
    )
  }
}

// ======================================================
// DELETE SONG
// ======================================================

export const DeleteSong = async (
  id: string,
  token: string
) => {

  try {

    const response = await axios.delete(
      `${SERVER_URL}${API_ENDPOINTS.song.delete}${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data

  } catch (error: any) {

    console.log("DELETE SONG ERROR:", error)

    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Delete Song Failed"
    )
  }
}