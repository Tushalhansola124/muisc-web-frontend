"use client";

import { useEffect, useState } from "react";

import {
  Users,
  Mic2,
  Music,
  Disc3,
  Tags,
  ListMusic,
  Play,
  Heart,
  TrendingUp,
  UserPlus,
  Music2,
  BarChart3,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { GetAdminDashboardStats, IAdminDashboardResponse } from "./contoller";

// ======================================================
// HELPER COMPONENTS
// ======================================================

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: any;
  gradient: string;
  subtitle?: string;
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${gradient}`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
      <div className={`rounded-xl p-3 ${gradient} text-white shadow-lg`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
      <Icon size={18} />
    </div>
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  </div>
);

const SongRow = ({
  song,
  rank,
  type,
}: {
  song: any;
  rank: number;
  type: "plays" | "likes";
}) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
    <span className="w-6 text-center text-sm font-semibold text-gray-400 group-hover:text-indigo-600">
      {rank}
    </span>
    <img
      src={song.thumbnail}
      alt={song.title}
      className="w-12 h-12 rounded-lg object-cover shadow-sm"
    />
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 truncate">{song.title}</p>
      <p className="text-sm text-gray-500 truncate">{song.artist?.name}</p>
    </div>
    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
      {type === "plays" ? (
        <>
          <Play size={14} className="text-indigo-500" />
          {song.plays}
        </>
      ) : (
        <>
          <Heart size={14} className="text-rose-500" />
          {song.likes}
        </>
      )}
    </div>
  </div>
);

// ======================================================
// MAIN DASHBOARD
// ======================================================

export default function AdminDashboard() {
  const [data, setData] = useState<IAdminDashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await GetAdminDashboardStats();
        console.log("Admin Dashboard Stats:", res.data);
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg">{error || "No data found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { totals, songStats, usersByRole, topPlayedSongs, topLikedSongs, recentUsers, recentSongs } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <BarChart3 size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Real-time overview of your music platform
              </p>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Users"
            value={totals.users}
            icon={Users}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle={`${usersByRole.user} regular users`}
          />
          <StatCard
            title="Artists"
            value={totals.artists}
            icon={Mic2}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            subtitle={`${usersByRole.artist} active artists`}
          />
          <StatCard
            title="Songs"
            value={totals.songs}
            icon={Music}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            subtitle={`${songStats.published} published`}
          />
          <StatCard
            title="Total Plays"
            value={songStats.totalPlays}
            icon={Play}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            subtitle={`${songStats.totalLikes} total likes`}
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <Disc3 className="mx-auto text-indigo-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{totals.albums}</p>
            <p className="text-xs text-gray-500 mt-0.5">Albums</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <Tags className="mx-auto text-pink-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{totals.genres}</p>
            <p className="text-xs text-gray-500 mt-0.5">Genres</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <ListMusic className="mx-auto text-cyan-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{totals.playlists}</p>
            <p className="text-xs text-gray-500 mt-0.5">Playlists</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <Activity className="mx-auto text-rose-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{totals.historyPlays}</p>
            <p className="text-xs text-gray-500 mt-0.5">History</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <Music2 className="mx-auto text-emerald-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{songStats.published}</p>
            <p className="text-xs text-gray-500 mt-0.5">Published</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <Heart className="mx-auto text-red-500 mb-2" size={20} />
            <p className="text-xl font-bold text-gray-900">{songStats.totalLikes}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Likes</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Top Played Songs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle title="Top Played Songs" icon={TrendingUp} />
            <div className="space-y-1">
              {topPlayedSongs.map((song, idx) => (
                <SongRow key={song._id} song={song} rank={idx + 1} type="plays" />
              ))}
            </div>
          </div>

          {/* Top Liked Songs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle title="Top Liked Songs" icon={Heart} />
            <div className="space-y-1">
              {topLikedSongs.map((song, idx) => (
                <SongRow key={song._id} song={song} rank={idx + 1} type="likes" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle title="Recent Users" icon={UserPlus} />
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "artist"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Songs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionTitle title="Recent Songs" icon={Music2} />
            <div className="space-y-3">
              {recentSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow">
                    <Music size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{song.title}</p>
                    <p className="text-sm text-gray-500 truncate">{song.artist?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Play size={13} className="text-indigo-500" /> {song.plays}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="text-rose-500" /> {song.likes}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(song.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users by Role Quick View */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionTitle title="Users by Role" icon={Users} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{usersByRole.admin}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                AR
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{usersByRole.artist}</p>
                <p className="text-sm text-gray-600">Artists</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                U
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{usersByRole.user}</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}