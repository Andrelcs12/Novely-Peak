"use client";

import MusicPlayer from "./components/MusicPlayer";
import MusicPlaylists from "./components/MusicPlaylists";
import MusicProfile from "./components/MusicProfile";
import MusicGenres from "./components/MusicGenres";
import { useCurrentTrack } from "./hooks/useCurrentTrack";

export default function MusicConnected() {
  // Busca a faixa atual aqui, uma única vez, e distribui por prop.
  // Se MusicPlayer, MusicPlaylists e MusicGenres chamassem
  // useCurrentTrack cada um por conta própria, isso triplicaria as
  // chamadas de polling (a cada 3s) sem necessidade.
  const { track, loading } = useCurrentTrack();

  return (
    <div className="mx-auto max-w-[1700px] h-[calc(100vh-120px)] p-4 flex flex-col gap-6">
      {/* GÊNEROS / MOODS */}
      <MusicGenres currentTrack={track} />

      <div className="grid flex-1 min-h-0 gap-6 lg:grid-cols-[320px_1fr_340px]">
        {/* LEFT */}
        <div className="h-full overflow-hidden">
          <MusicPlaylists currentTrack={track} />
        </div>

        {/* CENTER */}
        <div className="h-full overflow-y-auto">
          <MusicPlayer track={track} loading={loading} />
        </div>

        {/* RIGHT */}
        <div className="h-full overflow-hidden">
          <MusicProfile />
        </div>
      </div>
    </div>
  );
}