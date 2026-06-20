"use client";

import { motion } from "framer-motion";
import { Music2, AlertCircle } from "lucide-react";
import { useSpotifyPlaylists } from "../hooks/useSpotifyPlaylists";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import { useSpotify } from "../hooks/useSpotify";

interface MusicPlaylistsProps {
  currentTrack?: any;
}

export default function MusicPlaylists({ currentTrack }: MusicPlaylistsProps) {
  const { playlists, loading, error } = useSpotifyPlaylists();
  const { play } = useSpotifyPlayer();
  const { appToken } = useSpotify();

  const activeUri = currentTrack?.context?.uri;

  const reconnect = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/login`,
        {
          headers: { Authorization: `Bearer ${appToken}` },
        }
      );
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch (err) {
      console.error("Erro ao tentar reconectar:", err);
    }
  };

  return (
    <div className="h-full rounded-3xl border border-zinc-800 bg-[#111827] overflow-hidden flex flex-col select-none">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 shrink-0">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Playlists</h2>
        <p className="text-xs text-zinc-400 mt-1">Sua biblioteca pessoal</p>
      </div>

      {/* Playlists Container (Com Scrollbar Customizado) */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/30 pr-1
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-purple-400
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-purple-300
        transition-colors"
      >
        {/* Loading State */}
        {loading && (
          <div className="p-4 space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="flex gap-4 p-3 items-center">
                <div className="w-14 h-14 rounded-xl bg-zinc-800/60 animate-pulse shrink-0" />
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <div className="h-3.5 w-2/3 rounded bg-zinc-800/60 animate-pulse" />
                  <div className="h-2.5 w-1/4 rounded bg-zinc-800/40 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-200">Não foi possível carregar as playlists</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Isso ocorre se a sessão expirou ou faltam permissões no token atual.
              </p>
            </div>
            <button
              onClick={reconnect}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-zinc-100 font-medium text-sm transition active:scale-[0.98]"
            >
              Reconectar Spotify
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && playlists.length === 0 && (
          <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center justify-center h-full gap-2">
            <Music2 size={24} className="text-zinc-600" />
            <p>Nenhuma playlist encontrada na sua biblioteca.</p>
          </div>
        )}

        {/* Playlists List */}
        {!loading &&
          !error &&
          playlists.map((playlist, index) => {
            const isActive = playlist.uri === activeUri;

            return (
              <motion.button
                key={playlist.id}
                type="button"
                onClick={() => play({ context_uri: playlist.uri })}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.2 }}
                className={`
                  flex w-full items-center gap-4 p-4 text-left
                  transition-all duration-200 cursor-pointer group relative
                  hover:bg-zinc-600/60
                  ${isActive ? "bg-purple-500/5 hover:bg-purple-500/10" : ""}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-purple-500 rounded-r-full" />
                )}

                {/* Cover Image */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-800 shadow-md">
                  {playlist.images?.[0]?.url ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 size={20} className="text-zinc-500" />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`font-semibold tracking-tight truncate text-sm transition-colors ${
                      isActive ? "text-purple-400" : "text-zinc-200 group-hover:text-zinc-100"
                    }`}
                  >
                    {playlist.name}
                  </span>

                  <span className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5 font-medium">
                    {isActive ? (
                      <>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
                        </span>
                        <span className="text-purple-400/90 font-semibold">Tocando agora</span>
                      </>
                    ) : (
                      <span className="truncate group-hover:text-zinc-400 transition-colors">
                        {playlist.items?.total ?? 0} músicas
                      </span>
                    )}
                  </span>
                </div>
              </motion.button>
            );
          })}
      </div>
    </div>
  );
}