"use client";
import { ISong } from "@/components/song-module/controller";
import React, { useRef, useState, useEffect } from "react";

// ─── Helper ──────────────────────────────────────────────────
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

const COLORS = [
  "#e63946","#f4a261","#2a9d8f","#8338ec",
  "#06d6a0","#ffb703","#fb5607","#3a86ff",
  "#ff006e","#8ecae6",
];

const playlists = [
  { id: 1, name: "Liked Songs",      icon: "♥",  count: 124 },
  { id: 2, name: "Chill Vibes",      icon: "🌊", count: 34  },
  { id: 3, name: "Late Night Drive", icon: "🌙", count: 21  },
  { id: 4, name: "Workout Beast",    icon: "🔥", count: 47  },
  { id: 5, name: "Sunday Morning",   icon: "☀️", count: 18  },
  { id: 6, name: "Focus Mode",       icon: "🎯", count: 29  },
  { id: 7, name: "Throwbacks",       icon: "📼", count: 55  },
];

interface Props {
  songs: ISong[];
}

export default function MusicHomePage({ songs }: Props) {
 const [activeSongId, setActiveSongId] =
  useState<string | null>(songs?.[0]?._id ?? null);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<number | null>(1);
  const [progress, setProgress]             = useState(0);
  const [volume, setVolume]                 = useState(72);
  const [liked, setLiked]                   = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime]       = useState(0);
  const [duration, setDuration]             = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong  = songs.find((s) => s._id === activeSongId) ?? songs[0];
  const currentIndex = songs.findIndex((s) => s._id === activeSongId);
  const currentColor = currentSong
    ? COLORS[songs.indexOf(currentSong) % COLORS.length]
    : "#2a9d8f";

  // ── Song badlay to audio src set karo ──────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;

    audio.src = currentSong.audioUrl;
    audio.load();
    audio.volume = volume / 100;

    if (isPlaying) {
      audio.play().catch((err) => console.error("Play error:", err));
    }
  }, [activeSongId]); // eslint-disable-line

  // ── Play / Pause toggle ────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.error("Play error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ── Volume change ──────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ── Real-time progress bar ─────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Song khatam thay to next song play karo
    const onEnded = () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < songs.length) {
        setActiveSongId(songs[nextIndex]._id);
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
  }, [currentIndex, songs]);

  // ── Song click ─────────────────────────────────────────────
  const playSong = (songId: string) => {
    if (songId === activeSongId) {
      // Same song — toggle play/pause
      setIsPlaying((prev) => !prev);
    } else {
      setActiveSongId(songId);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  // ── Prev / Next ────────────────────────────────────────────
  const playPrev = () => {
    if (currentIndex > 0) {
      setActiveSongId(songs[currentIndex - 1]._id);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      setActiveSongId(songs[currentIndex + 1]._id);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  // ── Progress scrub ─────────────────────────────────────────
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (val / 100) * audio.duration;
    }
  };

  // ── Like toggle ────────────────────────────────────────────
  const toggleLike = (id: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── Format current time display ────────────────────────────
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="flex flex-col h-screen bg-[#0a0a0f] text-white overflow-hidden"
    >
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
        .song-row:hover .song-index{display:none}
        .song-row:hover .play-icon{display:flex}
        .play-icon{display:none}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06)}
        .progress-bar::-webkit-slider-thumb{appearance:none;width:12px;height:12px;background:white;border-radius:50%;cursor:pointer}
        @keyframes bars{0%,100%{height:4px}50%{height:14px}}
        .bar1{animation:bars 0.8s ease-in-out infinite}
        .bar2{animation:bars 0.8s ease-in-out infinite 0.2s}
        .bar3{animation:bars 0.8s ease-in-out infinite 0.4s}
      `}</style>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ─────────────────────────────── */}
        <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0d0d14] border-r border-white/5">
          <div className="px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold">♪</div>
              <span style={{ fontFamily:"'Space Mono',monospace" }} className="text-lg font-bold tracking-tight">WAVR</span>
            </div>
          </div>

          <nav className="px-3 py-4 border-b border-white/5">
            {[
              { icon: "⊞", label: "Home",        active: true  },
              { icon: "⊕", label: "Search",       active: false },
              { icon: "◫", label: "Your Library", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                  item.active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex items-center justify-between px-3 mb-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Playlists</span>
              <button className="text-zinc-500 hover:text-white text-lg leading-none transition-colors">+</button>
            </div>
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => setActivePlaylist(pl.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 group ${
                  activePlaylist === pl.id
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base w-6 text-center">{pl.icon}</span>
                <span className="flex-1 text-left truncate font-medium">{pl.name}</span>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-400">{pl.count}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#111118] to-[#0a0a0f]">
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-[#111118]/90 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition-colors">←</button>
              <button className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition-colors">→</button>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-1 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm font-medium pr-3">Arjun</span>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="mb-6 flex items-center gap-3">
              <h1 className="text-2xl font-bold">All Songs</h1>
              <span className="glass text-xs px-3 py-1 rounded-full text-zinc-400">{songs.length} tracks</span>
            </div>

            {songs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                <span className="text-5xl mb-3">🎵</span>
                <p className="text-lg font-medium">No songs found</p>
                <p className="text-sm mt-1">Upload songs to get started</p>
              </div>
            )}

            {songs.length > 0 && (
              <>
                <div className="grid grid-cols-[40px_1fr_180px_80px_80px] gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                  <span>#</span>
                  <span>Title</span>
                  <span>Album</span>
                  <span className="text-right">Plays</span>
                  <span className="text-right">⏱</span>
                </div>

                <div className="space-y-0.5">
                  {songs.map((song, idx) => {
                    const isActive = song._id === activeSongId;
                    const color    = COLORS[idx % COLORS.length];
                    return (
                      <div
                        key={song._id}
                        onClick={() => playSong(song._id)}
                        className={`song-row grid grid-cols-[40px_1fr_180px_80px_80px] gap-4 px-4 py-3 rounded-lg items-center cursor-pointer group transition-all ${
                          isActive ? "bg-white/8" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="relative flex items-center justify-center">
                          <span className={`song-index text-sm font-mono ${isActive ? "text-emerald-400" : "text-zinc-500"}`}>
                            {isActive && isPlaying ? (
                              <span className="flex items-end gap-[2px] h-4">
                                <span className="bar1 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                                <span className="bar2 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                                <span className="bar3 w-[3px] bg-emerald-400 rounded-sm inline-block" />
                              </span>
                            ) : (idx + 1)}
                          </span>
                          <span className="play-icon absolute items-center justify-center text-white text-sm">
                            {isActive && isPlaying ? "⏸" : "▶"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          {song.thumbnail ? (
                            <img src={song.thumbnail} alt={song.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              style={{ border:`1px solid ${color}33` }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                              style={{ background:`${color}22`, border:`1px solid ${color}44` }}>
                              <span style={{ color }}>♪</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "text-white"}`}>
                              {song.title}
                            </div>
                            <div className="text-xs text-zinc-500 truncate">{getArtistName(song.artist)}</div>
                          </div>
                        </div>

                        <div className="text-sm text-zinc-500 truncate">{getAlbumTitle(song.album)}</div>

                        <div className="text-sm text-zinc-500 text-right font-mono">
                          {song.plays >= 1_000_000
                            ? `${(song.plays / 1_000_000).toFixed(1)}M`
                            : song.plays >= 1_000
                            ? `${(song.plays / 1_000).toFixed(1)}K`
                            : song.plays}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }}
                            className={`text-sm opacity-0 group-hover:opacity-100 transition-all ${
                              liked.has(song._id) ? "opacity-100 text-emerald-400" : "text-zinc-500 hover:text-white"
                            }`}
                          >
                            {liked.has(song._id) ? "♥" : "♡"}
                          </button>
                          <span className="text-sm text-zinc-500 font-mono">{formatDuration(song.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>

        {/* ── RIGHT PANEL — Now Playing ─────────────────── */}
        <aside className="w-72 flex-shrink-0 bg-[#0d0d14] border-l border-white/5 flex flex-col">
          <div className="px-6 py-5 border-b border-white/5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Now Playing</span>
          </div>

          {currentSong ? (
            <>
              <div className="px-6 pt-6 pb-4">
                {/* Album Art */}
                <div
                  className="aspect-square rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden mb-4"
                  style={{ background:`linear-gradient(135deg,${currentColor}33,${currentColor}11)`, border:`1px solid ${currentColor}33` }}
                >
                  {currentSong.thumbnail ? (
                    <img src={currentSong.thumbnail} alt={currentSong.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0" style={{ background:`radial-gradient(circle at 40% 40%,${currentColor}55,transparent 70%)` }} />
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

                {/* Song Info */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-base leading-tight">{currentSong.title}</div>
                    <div className="text-sm text-zinc-500 mt-0.5">{getArtistName(currentSong.artist)}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{getAlbumTitle(currentSong.album)}</div>
                  </div>
                  <button
                    onClick={() => toggleLike(currentSong._id)}
                    className={`text-xl transition-colors mt-0.5 ${liked.has(currentSong._id) ? "text-emerald-400" : "text-zinc-600 hover:text-white"}`}
                  >
                    {liked.has(currentSong._id) ? "♥" : "♡"}
                  </button>
                </div>

                {/* ✅ Real Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range" min={0} max={100} value={progress}
                    onChange={handleProgressChange}
                    className="progress-bar w-full h-1 rounded-full outline-none cursor-pointer"
                    style={{ background:`linear-gradient(to right,${currentColor} ${progress}%,#333 ${progress}%)` }}
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || currentSong.duration)}</span>
                  </div>
                </div>

                {/* ✅ Controls with Prev/Next */}
                <div className="flex items-center justify-between mb-6">
                  <button className="text-zinc-500 hover:text-white transition-colors text-sm">⇄</button>
                  <button
                    onClick={playPrev}
                    disabled={currentIndex === 0}
                    className="text-zinc-400 hover:text-white transition-colors text-lg disabled:opacity-30"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{ background: currentColor }}
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button
                    onClick={playNext}
                    disabled={currentIndex === songs.length - 1}
                    className="text-zinc-400 hover:text-white transition-colors text-lg disabled:opacity-30"
                  >
                    ⏭
                  </button>
                  <button className="text-zinc-500 hover:text-white transition-colors text-sm">↻</button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-sm">🔈</span>
                  <input
                    type="range" min={0} max={100} value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="progress-bar flex-1 h-1 rounded-full outline-none cursor-pointer"
                    style={{ background:`linear-gradient(to right,#666 ${volume}%,#222 ${volume}%)` }}
                  />
                  <span className="text-zinc-500 text-sm">🔊</span>
                </div>
              </div>

              {/* Queue */}
              <div className="flex-1 overflow-y-auto border-t border-white/5 px-4 py-4">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-2">Up Next</div>
                {songs
                  .filter((s) => s._id !== activeSongId)
                  .slice(0, 6)
                  .map((song) => {
                    const color = COLORS[songs.indexOf(song) % COLORS.length];
                    return (
                      <button
                        key={song._id}
                        onClick={() => playSong(song._id)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/5 transition-all group"
                      >
                        {song.thumbnail ? (
                          <img src={song.thumbnail} alt={song.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs" style={{ background:`${color}22`, color }}>♪</div>
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
    </div>
  );
}