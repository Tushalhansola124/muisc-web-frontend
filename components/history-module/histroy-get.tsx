"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Clock, Trash2, Music2, X } from "lucide-react";
import { toast } from "sonner";
import {
  ClearHistory,
  DeleteHistory,
  GetHistory,
  HistoryItem,
} from "./contoller";

export default function HistoryPage() {
  const { data: session, status } = useSession();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await GetHistory();
      console.log("The Get History Response:::====>",res.data);
      console.log("Fetched History:", res.data);

      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory();
    }
    if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleClearHistory = async () => {
    if (!confirm("Clear entire listening history?")) return;

    try {
      setClearing(true);
      await ClearHistory(); // ← no token
      setHistory([]);
      toast.success("History cleared");
    } catch (error: any) {
      toast.error(error.message || "Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await DeleteHistory(id); // ← no token
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from history");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Session loading
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  // Not logged in
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-center">
        <h2 className="text-xl font-semibold text-white">Please login</h2>
        <p className="mt-2 text-zinc-400">
          Login to see your listening history
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Listening History
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {history.length > 0
                ? `${history.length} song${history.length > 1 ? "s" : ""} played`
                : "Your recently played tracks"}
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              disabled={clearing}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-2xl bg-zinc-900/50 p-3"
              >
                <div className="h-16 w-16 rounded-xl bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-zinc-800" />
                  <div className="h-3 w-1/3 rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900">
              <Music2 className="h-10 w-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-200">
              No listening history yet
            </h2>
            <p className="mt-2 max-w-sm text-zinc-500">
              Songs you play will appear here. Start exploring and build your
              personal timeline.
            </p>
            <Link
              href="/discover"
              className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Discover Music
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item._id}
                className="group relative flex items-center gap-3 rounded-2xl border border-transparent bg-zinc-900/40 p-3 transition-all duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/80 sm:gap-4 sm:p-4"
              >
                <div className="hidden w-8 text-center text-sm font-medium text-zinc-600 sm:block">
                  {index + 1}
                </div>

                <Link
                  href={`/song/${item.song._id}`}
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16"
                >
                  <Image
                    src={item.song.thumbnail}
                    alt={item.song.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="64px"
                  />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/song/${item.song._id}`}
                    className="block truncate text-sm font-semibold text-white transition hover:text-violet-400 sm:text-base"
                  >
                    {item.song.title}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Link
                      href={`/artist/${item.song.artist._id}`}
                      className="truncate text-xs text-zinc-400 hover:text-zinc-200 sm:text-sm"
                    >
                      {item.song.artist.name}
                    </Link>
                    <span className="hidden text-zinc-600 sm:inline">•</span>
                    <span className="hidden text-xs text-zinc-500 sm:inline">
                      {formatDuration(item.song.duration)}
                    </span>
                  </div>
                </div>

                <div className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:flex">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(item.playedAt), {
                    addSuffix: true,
                  })}
                </div>

                <div className="text-xs text-zinc-500 sm:hidden">
                  {formatDistanceToNow(new Date(item.playedAt), {
                    addSuffix: true,
                  })}
                </div>

                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  title="Remove from history"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}