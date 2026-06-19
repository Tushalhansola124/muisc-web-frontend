"use client";
import { ISong } from "@/components/song-module/controller";
import {
  GetPlaylists,
  CreatePlaylist,
  IPlaylist,
  DeletePlaylist,
  CreatePlaylistPayload,
  AddSongToPlaylist,
} from "@/components/playlist-module/controller";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────
type PlaylistSong = string | ISong;

interface SongMenuState {
  songId: string;
  x: number;
  y: number;
}

// ─── Helpers ─────────────────────────────────────────────────
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getArtistName(artist: ISong["artist"]) {
  if (typeof artist === "string") return artist;
  return artist?.name ?? "Unknown";
}

function getAlbumTitle(album: ISong["album"]) {
  if (typeof album === "string") return album;
  return album?.title ?? "Unknown";
}

function getSongId(entry: PlaylistSong): string {
  return typeof entry === "string" ? entry : (entry as ISong)._id;
}

function getPlaylistSongs(playlistSongs: PlaylistSong[], allSongs: ISong[]): ISong[] {
  const result: ISong[] = [];
  for (const entry of playlistSongs) {
    if (typeof entry === "string") {
      const found = allSongs.find((s) => s._id === entry);
      if (found) result.push(found);
    } else if (entry && typeof entry === "object" && "_id" in entry) {
      result.push(entry as ISong);
    }
  }
  return result;
}

/** Returns true if songId is already in the playlist's songs array */
function isSongInPlaylist(playlist: IPlaylist, songId: string): boolean {
  return (playlist.songs ?? []).some((s) => getSongId(s as PlaylistSong) === songId);
}

const COLORS = [
  "#e63946", "#f4a261", "#2a9d8f", "#8338ec",
  "#06d6a0", "#ffb703", "#fb5607", "#3a86ff",
  "#ff006e", "#8ecae6",
];
const PLAYLIST_ICONS = ["♪", "🌊", "🌙", "🔥", "☀️", "🎯", "📼", "✨", "🎧", "💫"];

interface Props {
  songs: ISong[];
}

export default function MusicHomePage({ songs }: Props) {
  const [activeSongId, setActiveSongId] = useState<string | null>(songs?.[0]?._id ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { data: session } = useSession();

  // ── Playlists ─────────────────────────────────────────────
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  // ── Song context menu (right-click / ⋮ button) ────────────
  const [songMenu, setSongMenu] = useState<SongMenuState | null>(null);
  const [menuLoadingId, setMenuLoadingId] = useState<string | null>(null); // which playlist action is in-flight
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Create playlist modal ─────────────────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // ── Sidebar ───────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Fetch playlists ───────────────────────────────────────
  const loadPlaylists = useCallback(async () => {
    try {
      setPlaylistsLoading(true);
      const res = await GetPlaylists();
      setPlaylists(res?.data ?? []);
    } catch (err) {
      console.error("Failed to load playlists:", err);
      setPlaylists([]);
    } finally {
      setPlaylistsLoading(false);
    }
  }, []);

  useEffect(() => { loadPlaylists(); }, [loadPlaylists]);

  // ── Close menu on outside click / scroll ─────────────────
  useEffect(() => {
    if (!songMenu) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSongMenu(null);
      }
    };
    const closeOnScroll = () => setSongMenu(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [songMenu]);

  // ── Derive visible songs ──────────────────────────────────
  const activePlaylist = playlists.find((p) => p._id === activePlaylistId) ?? null;
  const visibleSongs: ISong[] = activePlaylist
    ? getPlaylistSongs(activePlaylist.songs as PlaylistSong[], songs)
    : songs;

  const currentSong = songs.find((s) => s._id === activeSongId) ?? songs[0];
  const currentIndex = visibleSongs.findIndex((s) => s._id === activeSongId);
  const currentColor = currentSong ? COLORS[songs.indexOf(currentSong) % COLORS.length] : "#2a9d8f";
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  // ── Audio effects ─────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;
    audio.src = currentSong.audioUrl;
    audio.load();
    audio.volume = volume / 100;
    if (isPlaying) audio.play().catch(console.error);
  }, [activeSongId]); // eslint-disable-line

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      const next = safeIndex + 1;
      if (next < visibleSongs.length) {
        setActiveSongId(visibleSongs[next]._id);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [safeIndex, visibleSongs]);

  // ── Playback handlers ─────────────────────────────────────
  const playSong = (songId: string) => {
    if (songId === activeSongId) { setIsPlaying((p) => !p); }
    else { setActiveSongId(songId); setIsPlaying(true); setProgress(0); setCurrentTime(0); }
  };
  const playPrev = () => {
    if (safeIndex > 0) { setActiveSongId(visibleSongs[safeIndex - 1]._id); setIsPlaying(true); setProgress(0); }
  };
  const playNext = () => {
    if (safeIndex < visibleSongs.length - 1) { setActiveSongId(visibleSongs[safeIndex + 1]._id); setIsPlaying(true); setProgress(0); }
  };
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const audio = audioRef.current;
    if (audio?.duration) audio.currentTime = (val / 100) * audio.duration;
  };
  const toggleLike = (id: string) =>
    setLiked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  // ── Song context menu ─────────────────────────────────────
  const openSongMenu = (e: React.MouseEvent, songId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Smart position: keep menu within viewport
    const MENU_W = 220;
    const MENU_H = Math.min(playlists.length * 44 + 80, 320);
    let x = e.clientX;
    let y = e.clientY;
    if (x + MENU_W > window.innerWidth) x = window.innerWidth - MENU_W - 8;
    if (y + MENU_H > window.innerHeight) y = window.innerHeight - MENU_H - 8;
    setSongMenu({ songId, x, y });
  };

/** Add or remove a song from a playlist */
const toggleSongInPlaylist = async (playlistId: string, songId: string, alreadyIn: boolean) => {
  const key = `${playlistId}-${songId}`;
  setMenuLoadingId(key);

  try {
    if (alreadyIn) {
      // Remove song
      await DeletePlaylist(playlistId, songId);        // Assuming this exists and works
      toast.success("Song removed from playlist");
    } else {
      // ADD song - Use the correct API
      await AddSongToPlaylist(playlistId, songId);     // ← New function
      toast.success("Song added to playlist");
    }

    await loadPlaylists(); // Refresh
  } catch (err: any) {
    console.error("Playlist update failed:", err);
    toast.error(err.message || "Failed to update playlist");
  } finally {
    setMenuLoadingId(null);
    setSongMenu(null);
  }
};
  // ── Playlist selection ────────────────────────────────────
  const selectPlaylist = (id: string | null) => {
    setActivePlaylistId(id);
    if (id) {
      const pl = playlists.find((p) => p._id === id);
      if (pl?.songs?.length) {
        const first = pl.songs[0];
        setActiveSongId(typeof first === "string" ? first : (first as ISong)._id);
      }
    } else {
      setActiveSongId(songs[0]?._id ?? null);
    }
    setIsPlaying(false); setProgress(0); setCurrentTime(0);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // ── Create playlist modal ─────────────────────────────────
  const openCreateModal = () => {
    setNewPlaylistName(""); setNewPlaylistDesc(""); setSelectedSongIds(new Set()); setCreateError("");
    setShowCreateModal(true);
  };
  const toggleSongSelection = (id: string) =>
    setSelectedSongIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const submitCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) { setCreateError("Playlist name is required"); return; }
    try {
      setCreating(true); setCreateError("");
      const res = await CreatePlaylist({ name: newPlaylistName.trim(), description: newPlaylistDesc.trim() || undefined, songs: Array.from(selectedSongIds) });
      if (res?.data) setPlaylists((prev) => [res.data, ...prev]);
      await loadPlaylists();
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  // ── The song whose menu is open ───────────────────────────
  const menuSong = songMenu ? songs.find((s) => s._id === songMenu.songId) : null;

  return (
    <div
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="flex flex-col h-screen bg-[#0a0a0f] text-white overflow-hidden"
    >
      <audio ref={audioRef} preload="metadata" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
        .song-row:hover .song-index{display:none}
        .song-row:hover .play-icon{display:flex}
        .song-row:hover .song-menu-btn{opacity:1!important}
        .play-icon{display:none}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06)}
        .progress-bar::-webkit-slider-thumb{appearance:none;width:12px;height:12px;background:white;border-radius:50%;cursor:pointer}
        @keyframes bars{0%,100%{height:4px}50%{height:14px}}
        .bar1{animation:bars 0.8s ease-in-out infinite}
        .bar2{animation:bars 0.8s ease-in-out infinite 0.2s}
        .bar3{animation:bars 0.8s ease-in-out infinite 0.4s}
        .sidebar-drawer{transition:transform 0.28s ease,opacity 0.28s ease}
        .sidebar-backdrop{transition:opacity 0.28s ease}
        /* Context menu fade-in */
        @keyframes menuIn{from{opacity:0;transform:scale(0.95) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .ctx-menu{animation:menuIn 0.15s ease forwards}
        /* Bottom player (mobile) */
        .bottom-player{display:none}
        @media(max-width:1023px){
          .bottom-player{display:flex}
          .now-playing-panel{display:none}
        }
        @media(max-width:767px){
          .song-grid{grid-template-columns:32px 1fr 44px!important}
          .song-grid .col-album,.song-grid .col-plays{display:none}
        }
      `}</style>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Backdrop */}
        {sidebarOpen && (
          <div className="sidebar-backdrop fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside className={`sidebar-drawer fixed lg:static top-0 left-0 h-full z-40 w-64 flex-shrink-0 flex flex-col bg-[#0d0d14] border-r border-white/5 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full lg:hidden"}`}>
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold">♪</div>
              <span style={{ fontFamily: "'Space Mono',monospace" }} className="text-lg font-bold tracking-tight">WAVR</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">✕</button>
          </div>

          <nav className="px-3 py-4 border-b border-white/5">
            {[{ icon: "⊞", label: "Home", active: true }, { icon: "⊕", label: "Search", active: false }, { icon: "◫", label: "Your Library", active: false }].map((item) => (
              <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${item.active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                <span className="text-base">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex items-center justify-between px-3 mb-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Playlists</span>
              <button onClick={openCreateModal} className="text-zinc-500 hover:text-white text-lg leading-none transition-colors" aria-label="Create playlist">+</button>
            </div>

            <button onClick={() => selectPlaylist(null)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 group ${activePlaylistId === null ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              <span className="text-base w-6 text-center">♥</span>
              <span className="flex-1 text-left truncate font-medium">All Songs</span>
              <span className="text-xs text-zinc-600 group-hover:text-zinc-400">{songs.length}</span>
            </button>

            {playlistsLoading && <div className="px-3 py-4 text-xs text-zinc-600">Loading playlists…</div>}
            {!playlistsLoading && playlists.length === 0 && <div className="px-3 py-4 text-xs text-zinc-600">No playlists yet. Tap + to create one.</div>}

            {playlists.map((pl, idx) => (
              <button key={pl._id} onClick={() => selectPlaylist(pl._id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 group ${activePlaylistId === pl._id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                <span className="text-base w-6 text-center">{PLAYLIST_ICONS[idx % PLAYLIST_ICONS.length]}</span>
                <span className="flex-1 text-left truncate font-medium">{pl.name}</span>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-400">{pl.songs?.length ?? 0}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#111118] to-[#0a0a0f] w-full min-w-0">

          {/* Topbar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 bg-[#111118]/90 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen((p) => !p)} className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition-colors">☰</button>
              <button className="w-8 h-8 rounded-full glass items-center justify-center text-sm hover:bg-white/10 transition-colors hidden sm:flex">←</button>
              <button className="w-8 h-8 rounded-full glass items-center justify-center text-sm hover:bg-white/10 transition-colors hidden sm:flex">→</button>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-1 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">{session?.user?.firstName?.charAt(0).toUpperCase() || "N"}</div>
              <span className="text-sm font-medium pr-3 hidden sm:inline">{session?.user?.firstName || "Not found"}</span>
            </div>
          </div>

          {/* Song list */}
          <div className="px-4 sm:px-8 py-6 pb-28 lg:pb-6">
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold">{activePlaylist ? activePlaylist.name : "All Songs"}</h1>
              {activePlaylist?.description && <p className="w-full text-sm text-zinc-500 -mt-2">{activePlaylist.description}</p>}
              <span className="glass text-xs px-3 py-1 rounded-full text-zinc-400">{visibleSongs.length} tracks</span>
            </div>

            {visibleSongs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                <span className="text-5xl mb-3">🎵</span>
                <p className="text-lg font-medium">{activePlaylist ? "This playlist is empty" : "No songs found"}</p>
                <p className="text-sm mt-1">{activePlaylist ? "Right-click any song to add it here" : "Upload songs to get started"}</p>
              </div>
            )}

            {visibleSongs.length > 0 && (
              <>
                <div className="song-grid grid grid-cols-[40px_1fr_180px_80px_80px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                  <span>#</span><span>Title</span>
                  <span className="col-album">Album</span>
                  <span className="col-plays text-right">Plays</span>
                  <span className="text-right">⏱</span>
                </div>

                <div className="space-y-0.5">
                  {visibleSongs.map((song, idx) => {
                    const isActive = song._id === activeSongId;
                    const color = COLORS[songs.indexOf(song) % COLORS.length] ?? COLORS[idx % COLORS.length];
                    return (
                      <div
                        key={song._id}
                        onClick={() => playSong(song._id)}
                        onContextMenu={(e) => openSongMenu(e, song._id)}
                        className={`song-row song-grid grid grid-cols-[40px_1fr_180px_80px_80px] gap-4 px-4 py-3 rounded-lg items-center cursor-pointer group transition-all select-none ${isActive ? "bg-white/8" : "hover:bg-white/5"}`}
                      >
                        {/* Index / playing indicator */}
                        <div className="relative flex items-center justify-center">
                          <span className={`song-index text-sm font-mono ${isActive ? "text-emerald-400" : "text-zinc-500"}`}>
                            {isActive && isPlaying ? (
                              <span className="flex items-end gap-[2px] h-4">
                                <span className="bar1 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                                <span className="bar2 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                                <span className="bar3 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                              </span>
                            ) : idx + 1}
                          </span>
                          <span className="play-icon absolute items-center justify-center text-white text-sm">{isActive && isPlaying ? "⏸" : "▶"}</span>
                        </div>

                        {/* Title + artist */}
                        <div className="flex items-center gap-3 min-w-0">
                          {song.thumbnail ? (
                            <img src={song.thumbnail} alt={song.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" style={{ border: `1px solid ${color}33` }} />
                          ) : (
                            <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                              <span style={{ color }}>♪</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "text-white"}`}>
                              <Link href={`/track/${song._id}`} onClick={(e) => e.stopPropagation()}>{song.title}</Link>
                            </div>
                            <div className="text-xs text-zinc-500 truncate">{getArtistName(song.artist)}</div>
                          </div>
                        </div>

                        <div className="col-album text-sm text-zinc-500 truncate">{getAlbumTitle(song.album)}</div>
                        <div className="col-plays text-sm text-zinc-500 text-right font-mono">
                          {song.plays >= 1_000_000 ? `${(song.plays / 1_000_000).toFixed(1)}M` : song.plays >= 1_000 ? `${(song.plays / 1_000).toFixed(1)}K` : song.plays}
                        </div>

                        {/* Like + duration + menu button */}
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }}
                            className={`text-sm opacity-0 group-hover:opacity-100 transition-all ${liked.has(song._id) ? "opacity-100 text-emerald-400" : "text-zinc-500 hover:text-white"}`}
                          >{liked.has(song._id) ? "♥" : "♡"}</button>
                          <span className="text-xs text-zinc-500 font-mono">{formatDuration(song.duration)}</span>
                          {/* ⋮ menu trigger */}
                          <button
                            song-menu-btn="true"
                            onClick={(e) => openSongMenu(e, song._id)}
                            className="song-menu-btn w-6 h-6 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all opacity-0 text-base leading-none flex-shrink-0"
                            aria-label="Song options"
                          >⋮</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>

        {/* ── RIGHT PANEL — Now Playing ────────────────────── */}
        <aside className="now-playing-panel w-72 flex-shrink-0 bg-[#0d0d14] border-l border-white/5 flex flex-col">
          <div className="px-6 py-5 border-b border-white/5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Now Playing</span>
          </div>

          {currentSong ? (
            <>
              <div className="px-6 pt-6 pb-4">
                <div className="aspect-square rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden mb-4"
                  style={{ background: `linear-gradient(135deg,${currentColor}33,${currentColor}11)`, border: `1px solid ${currentColor}33` }}>
                  {currentSong.thumbnail ? (
                    <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <>
                      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 40% 40%,${currentColor}55,transparent 70%)` }} />
                      <span className="relative" style={{ color: currentColor }}>♪</span>
                    </>
                  )}
                  {isPlaying && (
                    <div className="absolute bottom-3 right-3 flex items-end gap-[3px]">
                      <span className="bar1 w-[4px] rounded-sm inline-block" style={{ background: currentColor }} />
                      <span className="bar2 w-[4px] rounded-sm inline-block" style={{ background: currentColor }} />
                      <span className="bar3 w-[4px] rounded-sm inline-block" style={{ background: currentColor }} />
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-base leading-tight">{currentSong.title}</div>
                    <div className="text-sm text-zinc-500 mt-0.5">{getArtistName(currentSong.artist)}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{getAlbumTitle(currentSong.album)}</div>
                  </div>
                  <button onClick={() => toggleLike(currentSong._id)} className={`text-xl transition-colors mt-0.5 ${liked.has(currentSong._id) ? "text-emerald-400" : "text-zinc-600 hover:text-white"}`}>
                    {liked.has(currentSong._id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="mb-4">
                  <input type="range" min={0} max={100} value={progress} onChange={handleProgressChange} className="progress-bar w-full h-1 rounded-full outline-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,${currentColor} ${progress}%,#333 ${progress}%)` }} />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || currentSong.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <button className="text-zinc-500 hover:text-white transition-colors text-sm">⇄</button>
                  <button onClick={playPrev} disabled={safeIndex === 0} className="text-zinc-400 hover:text-white transition-colors text-lg disabled:opacity-30">⏮</button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-105 active:scale-95" style={{ background: currentColor }}>
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button onClick={playNext} disabled={safeIndex === visibleSongs.length - 1} className="text-zinc-400 hover:text-white transition-colors text-lg disabled:opacity-30">⏭</button>
                  <button className="text-zinc-500 hover:text-white transition-colors text-sm">↻</button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm">🔈</span>
                  <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="progress-bar flex-1 h-1 rounded-full outline-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,#666 ${volume}%,#222 ${volume}%)` }} />
                  <span className="text-zinc-500 text-sm">🔊</span>
                </div>
              </div>

              {/* Queue */}
              <div className="flex-1 overflow-y-auto border-t border-white/5 px-4 py-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-2">Up Next</div>
                {visibleSongs.filter((s) => s._id !== activeSongId).slice(0, 6).map((song) => {
                  const color = COLORS[songs.indexOf(song) % COLORS.length] ?? "#2a9d8f";
                  return (
                    <button key={song._id} onClick={() => playSong(song._id)} className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/5 transition-all group">
                      {song.thumbnail ? (
                        <img src={song.thumbnail} alt={song.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs" style={{ background: `${color}22`, color }}>♪</div>
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">{song.title}</div>
                        <div className="text-xs text-zinc-600 truncate">{getArtistName(song.artist)}</div>
                      </div>
                      <span className="text-xs text-zinc-600 font-mono">{formatDuration(song.duration)}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-3">
              <span className="text-4xl">🎵</span>
              <p className="text-sm">No song selected</p>
            </div>
          )}
        </aside>
      </div>

      {/* ── BOTTOM PLAYER (mobile) ────────────────────────────── */}
      {currentSong && (
        <div className="bottom-player fixed bottom-0 left-0 right-0 z-50 flex-col" style={{ background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <input type="range" min={0} max={100} value={progress} onChange={handleProgressChange} className="progress-bar w-full h-0.5 outline-none cursor-pointer block"
            style={{ background: `linear-gradient(to right,${currentColor} ${progress}%,#333 ${progress}%)` }} />
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-11 h-11 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center" style={{ background: `${currentColor}22`, border: `1px solid ${currentColor}44` }}>
              {currentSong.thumbnail ? <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover" /> : <span style={{ color: currentColor }}>♪</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: currentColor }}>{currentSong.title}</div>
              <div className="text-xs text-zinc-500 truncate">{getArtistName(currentSong.artist)}</div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={playPrev} disabled={safeIndex === 0} className="text-zinc-400 hover:text-white transition-colors disabled:opacity-30 text-base">⏮</button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95" style={{ background: currentColor }}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={playNext} disabled={safeIndex === visibleSongs.length - 1} className="text-zinc-400 hover:text-white transition-colors disabled:opacity-30 text-base">⏭</button>
              <button onClick={() => toggleLike(currentSong._id)} className={`text-base ${liked.has(currentSong._id) ? "text-emerald-400" : "text-zinc-500 hover:text-white"}`}>
                {liked.has(currentSong._id) ? "♥" : "♡"}
              </button>
            </div>
          </div>
          <div className="flex justify-between px-4 pb-2 text-[10px] text-zinc-600 font-mono -mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || currentSong.duration)}</span>
          </div>
        </div>
      )}

      {/* ── SONG CONTEXT MENU ─────────────────────────────────── */}
      {songMenu && (
        <div
          ref={menuRef}
          className="ctx-menu fixed z-[9999] w-56 rounded-xl overflow-hidden shadow-2xl"
          style={{
            left: songMenu.x,
            top: songMenu.y,
            background: "#1a1a26",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Song header */}
          {menuSong && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
              {menuSong.thumbnail ? (
                <img src={menuSong.thumbnail} alt={menuSong.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs" style={{ background: "#2a9d8f22", color: "#2a9d8f" }}>♪</div>
              )}
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate text-white">{menuSong.title}</div>
                <div className="text-xs text-zinc-500 truncate">{getArtistName(menuSong.artist)}</div>
              </div>
            </div>
          )}

          {/* Play now */}
          <button
            onClick={() => { playSong(songMenu.songId); setSongMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/8 transition-colors text-left"
          >
            <span className="text-base w-5 text-center">▶</span> Play now
          </button>

          {/* Divider + playlist section */}
          {playlists.length > 0 && (
            <>
              <div className="border-t border-white/8 mx-3 my-1" />
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Playlists</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {playlists.map((pl, idx) => {
                  const inPlaylist = isSongInPlaylist(pl, songMenu.songId);
                  const loadKey = `${pl._id}-${songMenu.songId}`;
                  const isLoading = menuLoadingId === loadKey;
                  return (
                    <button
                      key={pl._id}
                      onClick={() => toggleSongInPlaylist(pl._id, songMenu.songId, inPlaylist)}
                      disabled={!!menuLoadingId}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left disabled:opacity-60 ${
                        inPlaylist
                          ? "text-emerald-400 hover:bg-emerald-400/10"
                          : "text-zinc-300 hover:text-white hover:bg-white/8"
                      }`}
                    >
                      <span className="text-base w-5 text-center flex-shrink-0">
                        {isLoading ? (
                          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : inPlaylist ? "✓" : PLAYLIST_ICONS[idx % PLAYLIST_ICONS.length]}
                      </span>
                      <span className="flex-1 truncate">{pl.name}</span>
                      {inPlaylist && !isLoading && (
                        <span className="text-[10px] text-emerald-500/70 flex-shrink-0 ml-1">Remove</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {playlists.length === 0 && !playlistsLoading && (
            <>
              <div className="border-t border-white/8 mx-3 my-1" />
              <div className="px-4 py-3 text-xs text-zinc-600">No playlists yet.</div>
            </>
          )}

          {/* Create new playlist from menu */}
          <div className="border-t border-white/8 mx-3 my-1" />
          <button
            onClick={() => { setSongMenu(null); openCreateModal(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/8 transition-colors text-left mb-1"
          >
            <span className="text-base w-5 text-center">+</span> New playlist
          </button>
        </div>
      )}

      {/* ── CREATE PLAYLIST MODAL ─────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => !creating && setShowCreateModal(false)}>
          <div className="glass w-full max-w-md rounded-2xl p-6 bg-[#15151d]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Create Playlist</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 block">Name</label>
                <input autoFocus type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="My Awesome Playlist"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 block">Description (optional)</label>
                <textarea value={newPlaylistDesc} onChange={(e) => setNewPlaylistDesc(e.target.value)} placeholder="What's this playlist about?" rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-400/50 transition-colors resize-none" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 block">Add songs ({selectedSongIds.size} selected)</label>
                <div className="max-h-48 overflow-y-auto border border-white/10 rounded-lg divide-y divide-white/5">
                  {songs.length === 0 && <div className="px-3 py-4 text-xs text-zinc-600">No songs available</div>}
                  {songs.map((song) => (
                    <label key={song._id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors">
                      <input type="checkbox" checked={selectedSongIds.has(song._id)} onChange={() => toggleSongSelection(song._id)} className="accent-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{song.title}</div>
                        <div className="text-xs text-zinc-500 truncate">{getArtistName(song.artist)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {createError && <div className="text-xs text-red-400">{createError}</div>}

              <div className="flex items-center gap-3 pt-1">
                <button onClick={() => setShowCreateModal(false)} disabled={creating} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={submitCreatePlaylist} disabled={creating} className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-emerald-400 text-black hover:bg-emerald-300 transition-colors disabled:opacity-50">
                  {creating ? "Creating…" : "Create Playlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}