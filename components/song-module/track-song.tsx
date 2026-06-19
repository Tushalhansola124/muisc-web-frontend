"use client";

import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, Share2, Clock } from 'lucide-react';
import { GetSongById, ISingleSongResponse } from '@/components/song-module/controller';

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isLikeSong, LikeSong, UnLikeSong } from '../songs-like/contoller';   // ← Import both

interface SongDetailProps {
  songId: string;
}

const SongDetail: React.FC<SongDetailProps> = ({ songId }) => {
  const { data: session } = useSession();
  const [song, setSong] = useState<ISingleSongResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const audioRef = React.useRef<HTMLAudioElement>(null);

useEffect(() => {
  const fetchSong = async () => {
    try {
      setLoading(true);
      const response = await GetSongById(songId);
      
      setSong(response.data);
      setLikeCount(response.data.likes || 0);

      // ✅ Correct way to check like status
      if (session?.user?.token) {
        const likeResponse = await isLikeSong(songId, session.user.token);
        
  
        setIsLiked(!!likeResponse.isLiked);       

      } else {
        setIsLiked(false);
      }

    } catch (err: any) {
      console.error("❌ Like check ERROR:", err);
      setIsLiked(false); // fallback
    } finally {
      setLoading(false);
    }
  };

  if (songId) fetchSong();
}, [songId, session?.user?.token]); // Important: added token dependency 

  // Like / Unlike Handler
  const handleLikeToggle = async () => {
    if (!session?.user?.token) {
      toast.error("Please login to like songs");
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        const res = await UnLikeSong(songId, session.user.token);
        if (res.success) {
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          toast.success("Song unliked 💔");
        }
      } else {
        // Like
        const res = await LikeSong(songId, session.user.token);
        if (res.success) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          toast.success("Song liked ❤️");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update like status");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !song) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-950 to-black">
        <div className="text-white text-xl">Loading song...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-950 to-black text-red-500">
        {error || 'Song not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 via-zinc-900 to-black text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-end">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img src={song.thumbnail} alt={song.title} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-20 p-8 md:p-12 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <div className="uppercase text-sm tracking-widest text-emerald-400 mb-2">SONG</div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{song.title}</h1>
              
              <div className="flex items-center gap-3 text-xl">
                <img src={song.artist.image} alt={song.artist.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                <div>
                  <p className="font-semibold">{song.artist.name}</p>
                  <p className="text-sm text-zinc-400">{song.artist.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-8 -mt-8 relative z-30">
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-10 h-10 text-black" fill="black" /> : <Play className="w-10 h-10 text-black ml-1" fill="black" />}
          </button>

          {/* Like Button */}
       <button
            onClick={handleLikeToggle}
            className={`p-4 rounded-full transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-zinc-400 hover:text-white'}`}
          >
            <Heart className="w-8 h-8" fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          <button className="p-4 text-zinc-400 hover:text-white transition-colors">
            <Share2 className="w-8 h-8" />
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-sm">
          <div>
            <p className="text-zinc-500">Duration</p>
            <p className="text-xl font-medium flex items-center gap-2">
              <Clock className="w-5 h-5" /> {formatDuration(song.duration)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Likes</p>
            <p className="text-xl font-medium">{likeCount}</p>
          </div>
        </div>

        {/* Description & Genres */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">About this song</h3>
          <p className="text-zinc-300 leading-relaxed max-w-3xl text-lg">{song.description}</p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Genres</h3>
          <div className="flex flex-wrap gap-3">
            {song.genre.map((g) => (
              <span key={g._id} className="px-5 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-medium">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <audio ref={audioRef} src={song.audioUrl} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default SongDetail;