"use client";

import { useEffect, useState } from "react";
import { GetArtistDashboardCounts, IArtistDashboardResponse } from "@/actions/dashboard"; // path adjust karo
import {
  Music,
  Disc3,
  Play,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  ListMusic,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// ======================================================
// HELPER COMPONENTS
// ======================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number | string;
  icon: any;
  gradient: string;
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </p>
      </div>
      <div className={`rounded-xl p-3 ${gradient} text-white shadow-md`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  count,
  icon: Icon,
}: {
  title: string;
  count: number;
  icon: any;
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
      {count} items
    </span>
  </div>
);

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ArtistDashboard() {
  const [data, setData] = useState<IArtistDashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await GetArtistDashboardCounts();
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || "Failed to load dashboard");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------- LOADING --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // -------------------- ERROR --------------------
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 font-medium text-lg mb-4">
            {error || "No data found"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { artistName, artistImage, songs, albums, songsList, albumsList } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Artist Avatar */}
            <div className="relative">
              <img
                src={artistImage || "/default-artist.png"}
                alt={artistName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {artistName}
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                <User size={15} />
                Artist Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatCard
            title="Total Songs"
            value={songs}
            icon={Music}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <StatCard
            title="Total Albums"
            value={albums}
            icon={Disc3}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatCard
            title="Total Plays"
            value={songsList.reduce((acc, song) => acc + (song.plays || 0), 0)}
            icon={Play}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* ---------- SONGS LIST ---------- */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="My Songs" count={songsList.length} icon={Music} />

            {songsList.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Music size={40} className="mx-auto mb-3 opacity-40" />
                <p>No songs uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {songsList.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition">
                        {song.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Play size={13} className="text-indigo-500" />
                          {song.plays}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={13} className="text-rose-500" />
                          {song.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {song.duration}m
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {song.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                          <XCircle size={12} />
                          Draft
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(song.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- ALBUMS LIST ---------- */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader title="My Albums" count={albumsList.length} icon={Disc3} />

            {albumsList.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Disc3 size={40} className="mx-auto mb-3 opacity-40" />
                <p>No albums created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {albumsList.map((album) => (
                  <div
                    key={album._id}
                    className="group rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 bg-gray-50/50"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {album.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ListMusic size={14} />
                          {album.songs?.length || 0} songs
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Calendar size={12} />
                          {formatDistanceToNow(new Date(album.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}