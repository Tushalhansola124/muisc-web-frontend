"use client";

import { ISong } from "@/components/song-module/controller";
import { GetTrendingSongs } from "@/components/song-module/controller";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────
function getArtistName(artist: ISong["artist"]) {
  if (typeof artist === "string") return artist;
  return artist?.name ?? "Unknown";
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatPlays(p: number) {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)}M`;
  if (p >= 1_000) return `${(p / 1_000).toFixed(1)}K`;
  return String(p);
}

const TrendingSong = () => {
  const { data: session } = useSession();

  const [songs, setSongs] = useState<ISong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Fetch trending songs, highest play count first ─────────
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await GetTrendingSongs(session?.user?.token || "");
      const list = res?.data ?? [];
      const sorted = [...list].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
      setSongs(sorted);
    } catch (err: any) {
      console.error("Failed to load trending songs:", err);
      setError(err?.message || "Failed to load trending songs");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Play / pause handling ───────────────────────────────────
  const playSong = (song: ISong) => {
    const audio = audioRef.current;
    if (!audio || !song?.audioUrl) return;

    if (activeId === song._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
      return;
    }

    setActiveId(song._id);
    audio.src = song.audioUrl;
    audio.load();
    audio.play().catch(console.error);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const featured = songs[0];
  const rest = songs.slice(1);

  return (
    <section
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      className="w-full text-white"
    >
      <audio ref={audioRef} preload="metadata" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        .trend-card{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
        .trend-card:hover{transform:translateY(-4px)}
        .trend-play{opacity:0;transition:opacity .2s ease}
        .trend-card:hover .trend-play{opacity:1}
        @keyframes tsPulse{0%,100%{opacity:.35}50%{opacity:.75}}
        .ts-skel{animation:tsPulse 1.4s ease-in-out infinite}
        @keyframes barBeat{0%,100%{height:4px}50%{height:14px}}
        .b1{animation:barBeat .8s ease-in-out infinite}
        .b2{animation:barBeat .8s ease-in-out infinite .2s}
        .b3{animation:barBeat .8s ease-in-out infinite .4s}
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-violet-400 text-sm">♪</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
          Weekly Highlight
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
        Trending{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
          right now
        </span>
      </h2>
      <p className="text-sm text-zinc-400 mb-6">
        Ranked by play count — the most-streamed tracks this week.
      </p>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="ts-skel lg:col-span-1 rounded-2xl bg-white/5 border border-white/10 aspect-[4/5]" />
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="ts-skel rounded-xl bg-white/5 border border-white/10 aspect-square" />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && songs.length === 0 && (
        <div className="rounded-2xl border border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
          No trending songs right now.
        </div>
      )}

      {/* Content */}
      {!loading && songs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Featured / #1 trending ─────────────────────── */}
          {featured && (
            <div
              onClick={() => playSong(featured)}
              className="trend-card lg:col-span-1 relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 flex flex-col justify-between p-5 min-h-[280px]"
              style={{
                background: "linear-gradient(135deg,#7c3aed 0%,#4c1d95 45%,#1e1033 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.25), transparent 55%)" }}
              />

              <div className="relative flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black/30 px-2 py-1 rounded-full">
                  #1 Trending
                </span>
                <span className="text-[10px] font-mono bg-black/30 px-2 py-1 rounded-full">
                  {formatPlays(featured.plays ?? 0)} plays
                </span>
              </div>

              <div className="relative flex flex-col items-center text-center my-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 shadow-2xl ring-1 ring-white/20 flex items-center justify-center bg-white/10">
                  {featured.thumbnail ? (
                    <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">♪</span>
                  )}
                </div>
                <div className="font-bold text-lg leading-tight px-2">{featured.title}</div>
                <div className="text-sm text-violet-200 mt-1">{getArtistName(featured.artist)}</div>
              </div>

              <div className="relative flex items-center justify-between">
                <span className="text-xs text-violet-200 font-mono">{formatDuration(featured.duration)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong(featured);
                  }}
                  className="w-11 h-11 rounded-full bg-white text-violet-700 flex items-center justify-center text-base shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Play"
                >
                  {activeId === featured._id && isPlaying ? (
                    <span className="flex items-end gap-[3px] h-4">
                      <span className="b1 w-[3px] bg-violet-700 rounded-sm inline-block" />
                      <span className="b2 w-[3px] bg-violet-700 rounded-sm inline-block" />
                      <span className="b3 w-[3px] bg-violet-700 rounded-sm inline-block" />
                    </span>
                  ) : (
                    "▶"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Remaining trending cards ────────────────────── */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {rest.map((song, idx) => {
              const isActive = activeId === song._id;
              return (
                <div
                  key={song._id}
                  onClick={() => playSong(song)}
                  className={`trend-card relative rounded-xl overflow-hidden cursor-pointer border p-3 flex flex-col select-none ${
                    isActive ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden mb-3 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(30,16,51,0.6))",
                      border: "1px solid rgba(139,92,246,0.35)",
                    }}
                  >
                    {song.thumbnail ? (
                      <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-violet-300 text-2xl">♪</span>
                    )}

                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/60 text-violet-200">
                      #{idx + 2}
                    </span>

                    <div className="trend-play absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <span className="flex items-end gap-[3px] h-5">
                          <span className="b1 w-[3px] bg-violet-300 rounded-sm inline-block" />
                          <span className="b2 w-[3px] bg-violet-300 rounded-sm inline-block" />
                          <span className="b3 w-[3px] bg-violet-300 rounded-sm inline-block" />
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-white/90 text-violet-700 flex items-center justify-center text-xs">
                          ▶
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`text-xs sm:text-sm font-semibold truncate ${isActive ? "text-violet-300" : "text-white"}`}>
                    {song.title}
                  </div>
                  <div className="text-[11px] text-violet-300/70 truncate mt-0.5">{getArtistName(song.artist)}</div>

                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-zinc-500 font-mono">
                    <span>{formatPlays(song.plays ?? 0)} plays</span>
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingSong;