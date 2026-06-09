
"use client";

import { useEffect, useState } from "react";
import { GetArtists } from "@/components/artist-module/controller"; // Adjust path as needed
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface IArtist {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  followers?: number;
}

interface ISong {
  _id: string;
  title: string;
  artist?: IArtist | string;
  duration?: number;
  coverImage?: string;
  plays?: number;
  createdAt?: string;
}

// ─── Icons (Keep your existing icons) ───────────────────────────────────────

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

// ─── Components (Keep your beautiful UI) ─────────────────────────────────────

function ArtistCard({ artist }: { artist: IArtist }) {
  const initials = artist.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/artists/${artist._id}`} className="group flex flex-col items-center gap-3 cursor-pointer">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-violet-400 transition-all duration-300">
        {artist.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-2xl font-bold tracking-wider">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="w-11 h-11 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
            <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-medium text-sm truncate w-full">
          {artist.name}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [songs, setSongs] = useState<ISong[]>([]); // You can keep this if you want
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Artists
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoadingArtists(true);
        const response = await GetArtists();

        // Handle both direct array and {status, message, data} response
        if (Array.isArray(response)) {
          setArtists(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setArtists(response.data);
        } else {
          setArtists([]);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load artists");
      } finally {
        setLoadingArtists(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d14] text-white">
      {/* Header (your existing header) */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0d0d14]/80 border-b border-white/5 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MusicIcon className="w-6 h-6 text-violet-400" />
          <span className="font-bold text-lg tracking-tight">Melodex</span>
        </div>
        {/* ... rest of header */}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        <section>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Good to hear you. 🎵
          </h1>
          <p className="mt-2 text-white/50 text-lg">
            Discover popular artists and what's trending right now.
          </p>
        </section>

        {/* Popular Artists Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Popular Artists</h2>
            <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              See all →
            </a>
          </div>

          {loadingArtists ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-full aspect-square rounded-2xl bg-white/10 animate-pulse" />
                  <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : artists.length === 0 ? (
            <p className="text-white/40">No artists found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artists.slice(0, 12).map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}