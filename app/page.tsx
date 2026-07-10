

'use client'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { GetSongs, ISong } from "@/components/song-module/controller"
import HomePage from "./(home)/MusicHomePage"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [songs, setSongs] = useState<ISong[]>([])

  useEffect(() => {

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // ✅ Tara config ma session.user.token che
      const token = session.user.token as string

      console.log("TOKEN:", token) // check karo

      GetSongs(token)
        .then(res => setSongs(res.data ?? []))
        .catch(err => console.error(err))
    }

  }, [status, session])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <div className="text-center">
          <div className="text-4xl mb-3">🎵</div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  return<>
     <HomePage songs={songs} />
  </>
}