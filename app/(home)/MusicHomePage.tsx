"use client";

import { useEffect, useState } from "react";
import { GetArtists } from "@/components/artist-module/controller";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  );
}

// ─── Artist Card ──────────────────────────────────────────────────────────────

function ArtistCard({ artist }: { artist: IArtist }) {
  const initials = artist.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      href={`/artists/${artist._id}`}
      className="group flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-violet-500 transition-all duration-300">
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
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="text-center w-full">
        <p className="text-white font-semibold text-sm truncate">{artist.name}</p>
        {artist.followers && (
          <p className="text-zinc-500 text-xs mt-0.5">
            {(artist.followers / 1_000_000).toFixed(1)}M followers
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonArtistCard() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full aspect-square rounded-2xl bg-zinc-800/50 animate-pulse" />
      <div className="h-3.5 w-3/4 bg-zinc-800/50 rounded animate-pulse" />
      <div className="h-2.5 w-1/2 bg-zinc-800/30 rounded animate-pulse" />
    </div>
  );
}

// ─── Genre Chip ───────────────────────────────────────────────────────────────

const GENRES = ["All", "Pop", "Hip-Hop", "Electronic", "R&B", "Indie", "Jazz", "Rock", "Latin"];

function GenreChips({
  active,
  onChange,
}: {
  active: string;
  onChange: (g: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onChange(genre)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-600 transition-all duration-200 ${
            active === genre
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

// ─── Trending Song Row ────────────────────────────────────────────────────────

const TRENDING_SONGS = [
  { num: 1, title: "Gravity Wells", artist: "Nova Pulse", plays: "3.2M", dur: "4:58", hot: true },
  { num: 2, title: "Neon Rain", artist: "Mara Ellis", plays: "2.8M", dur: "3:41", hot: false },
  { num: 3, title: "Static Haze", artist: "The Static", plays: "2.5M", dur: "5:12", hot: false },
  { num: 4, title: "Gold Rush", artist: "Drift King", plays: "2.1M", dur: "3:28", hot: true },
  { num: 5, title: "Softcore", artist: "Luxa", plays: "1.9M", dur: "4:02", hot: false },
  { num: 6, title: "Blue Void", artist: "Vex Coral", plays: "1.7M", dur: "3:55", hot: false },
];

function TrendingSongRow({
  song,
  index,
  isPlaying,
  onClick,
}: {
  song: (typeof TRENDING_SONGS)[0];
  index: number;
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group grid grid-cols-[40px_1fr_160px_100px_80px] gap-0 px-5 py-3 cursor-pointer transition-colors duration-150 border-b border-zinc-900 last:border-0 ${
        isPlaying ? "bg-violet-950/20" : "hover:bg-zinc-900/50"
      }`}
    >
      <span className="flex items-center text-sm text-zinc-500">
        {isPlaying ? (
          <span className="text-violet-400 text-xs">▶</span>
        ) : (
          song.num
        )}
      </span>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-800 to-fuchsia-800 shrink-0" />
        <div>
          <p className={`text-sm font-semibold ${isPlaying ? "text-violet-400" : "text-zinc-200"}`}>
            {song.title}
            {song.hot && (
              <span className="ml-2 text-[9px] font-bold uppercase tracking-wide bg-red-600 text-white px-1.5 py-0.5 rounded">
                Hot
              </span>
            )}
          </p>
        </div>
      </div>
      <span className="flex items-center text-sm text-zinc-400">{song.artist}</span>
      <span className="flex items-center text-sm text-zinc-500">{song.plays}</span>
      <span className="flex items-center justify-end text-sm text-zinc-500">{song.dur}</span>
    </div>
  );
}

// ─── Playlist Card ────────────────────────────────────────────────────────────

const PLAYLISTS = [
  { name: "Night Drive", count: "28 tracks", from: "#1e1b4b", to: "#4c1d95" },
  { name: "Chill Vibes", count: "42 tracks", from: "#064e3b", to: "#065f46" },
  { name: "Workout Fuel", count: "35 tracks", from: "#7c2d12", to: "#9a3412" },
  { name: "Lo-Fi Study", count: "60 tracks", from: "#1e3a5f", to: "#1e40af" },
];

function PlaylistCard({ playlist }: { playlist: (typeof PLAYLISTS)[0] }) {
  return (
    <div className="group bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200 cursor-pointer">
      <div
        className="h-36 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${playlist.from}, ${playlist.to})` }}
      >
        <svg
          className="w-14 h-14 text-white/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path d="M9 18V5l12-2v13M9 18a2 2 0 11-4 0 2 2 0 014 0zm12-2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <PlayIcon className="w-3.5 h-3.5 text-white ml-0.5" />
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-zinc-200">{playlist.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{playlist.count}</p>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoadingArtists(true);
        const response = await GetArtists();
        if (Array.isArray(response)) {
          setArtists(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setArtists(response.data);
        } else {
          setArtists([]);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-violet-500/30">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#09090b]/80 border-b border-zinc-900 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-[60px] flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl">
              <MusicIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Melodex
            </span>
           
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {["Discover", "Artists", "Charts", "Radio", "Events"].map((item) => (
              <a
                key={item}
                className={`text-sm font-medium px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                  item === "Discover"
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Search + Auth */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 w-52">
              <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-xs text-zinc-500">Search artists, songs…</span>
            </div>

            {/* Auth */}
            {!session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm font-medium text-zinc-400 hover:text-white px-3.5 py-2 rounded-xl hover:bg-zinc-900 transition-all duration-150"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-xl transition-all duration-150"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 p-1.5 pr-3 rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-zinc-700">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-xs">
                      {session.user?.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-zinc-200 leading-none">
                        {session.user?.firstName}
                      </span>
                    
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={6}
                  className="w-60 bg-[#0f0f12] border border-zinc-800 text-zinc-200 p-1.5 rounded-xl shadow-2xl"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium truncate text-zinc-300 mt-0.5">
                      {session.user?.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator className="bg-zinc-800/60 my-1" />

                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="px-3 py-2 text-sm rounded-lg text-zinc-300 focus:bg-zinc-900 focus:text-white cursor-pointer"
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/playlist")}
                    className="px-3 py-2 text-sm rounded-lg text-zinc-300 focus:bg-zinc-900 focus:text-white cursor-pointer"
                  >
                    My Playlists
                  </DropdownMenuItem>
                  {((session.user as any)?.role === "admin" ||
                    (session.user as any)?.role === "artist") && (
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                      className="px-3 py-2 text-sm rounded-lg text-zinc-300 focus:bg-zinc-900 focus:text-white cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-zinc-800/60 my-1" />

                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 py-2 text-sm rounded-lg text-red-400 font-medium focus:bg-red-950/30 focus:text-red-300 cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-14">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-950 p-8 sm:p-10">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-40 w-72 h-72 rounded-full bg-fuchsia-600/8 blur-[80px]" />

          <div className="relative grid sm:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
                🎵 Weekly Highlight
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
                The sound of{" "}
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  tomorrow, today.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed mb-8">
                Discover breakthrough artists, trending tracks, and curated playlists tailored to
                your taste. Stream 90M+ songs in lossless quality.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150">
                  <PlayIcon className="w-4 h-4" />
                  Start listening free
                </button>
                <button className="text-sm font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white px-5 py-2.5 rounded-xl transition-all duration-150">
                  Explore Premium →
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-800/60">
                {[
                  { value: "90M+", label: "Songs" },
                  { value: "4.2M", label: "Artists" },
                  { value: "180+", label: "Countries" },
                  { value: "Hi-Fi", label: "Lossless" },
                ].map((stat, i, arr) => (
                  <div key={stat.label} className="flex items-center gap-6">
                    <div>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px h-8 bg-zinc-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Featured album card */}
            <div className="hidden sm:block w-64 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shrink-0">
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-900">
                <MusicIcon className="w-16 h-16 text-white/20" />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-1">
                  Featured Album
                </p>
                <p className="text-sm font-bold text-white">Midnight Frequencies</p>
                <p className="text-xs text-zinc-500 mt-0.5">Nova Pulse · 2025</p>
                {/* Progress */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">2:14</span>
                  <div className="flex-1 h-1 bg-zinc-800 rounded-full">
                    <div className="w-[42%] h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-zinc-500">4:58</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0">
                    <PlayIcon className="w-3.5 h-3.5 text-white ml-0.5" />
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-zinc-300">Gravity Wells</p>
                    <p className="text-[10px] text-zinc-600">Track 3 of 12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Genre Chips ── */}
        <section>
          <GenreChips active={activeGenre} onChange={setActiveGenre} />
        </section>

        {/* ── Popular Artists ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-100">Popular Artists</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Top streaming profiles globally this week</p>
            </div>
            <a
              href="/artists"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 px-3 py-1.5 rounded-xl transition-all duration-150"
            >
              See all →
            </a>
          </div>

          {loadingArtists ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonArtistCard key={i} />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-14 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              <MusicIcon className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm font-medium">No active artists found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {artists.slice(0, 12).map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          )}
        </section>

        {/* ── Trending Now ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-100">Trending Now</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Chart-climbing tracks across all genres</p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_160px_100px_80px] gap-0 px-5 py-2.5 border-b border-zinc-900">
              <span className="text-[11px] text-zinc-600">#</span>
              <span className="text-[11px] text-zinc-600">Title</span>
              <span className="text-[11px] text-zinc-600">Artist</span>
              <span className="text-[11px] text-zinc-600">Plays</span>
              <span className="text-[11px] text-zinc-600 text-right">Duration</span>
            </div>
            {TRENDING_SONGS.map((song, i) => (
              <TrendingSongRow
                key={song.num}
                song={song}
                index={i}
                isPlaying={playingIndex === i}
                onClick={() => setPlayingIndex(playingIndex === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* ── Featured Playlists ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-100">Featured Playlists</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Hand-picked by our editorial team</p>
            </div>
            <a
              href="/playlists"
              className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 px-3 py-1.5 rounded-xl transition-all duration-150"
            >
              See all →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PLAYLISTS.map((playlist) => (
              <PlaylistCard key={playlist.name} playlist={playlist} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}