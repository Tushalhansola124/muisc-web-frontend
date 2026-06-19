'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SongDetail from '@/components/song-module/track-song';

export default function TrackPage() {
  const { id: songId } = useParams<{ id: string }>();
  const { data: session, status } = useSession();

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-950 to-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-zinc-400">Loading song...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  // if (!session?.user?.token) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-black text-white">
  //       <div className="text-center">
  //         <h2 className="text-2xl mb-4">Please Login</h2>
  //         <p>You need to be logged in to view this song.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Missing song ID
  if (!songId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        Song ID not found
      </div>
    );
  }

  return (
    <SongDetail 
      songId={songId}
    />
  );
}