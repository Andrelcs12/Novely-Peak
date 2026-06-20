"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Laptop,
  Globe,
  BadgeCheck,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { useSpotifyProfile } from "../hooks/useSpotifyProfile";


function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase(); // Retorna 'AN' para 'andre'
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function formatCountry(code?: string) {
  const map: Record<string, string> = {
    BR: "Brasil",
    US: "Estados Unidos",
    PT: "Portugal",
  };
  return (code && map[code]) || code || "Desconhecido";
}

export default function MusicProfile() {
  const { profile, topArtists, topTracks, loading } = useSpotifyProfile();
  const [imgFailed, setImgFailed] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!loading && (profile || topTracks.length > 0 || topArtists.length > 0)) {
      console.log(
        "%c 🎵 [SPOTIFY DATA DEBUG] 🎵",
        "background: #1DB954; color: black; font-weight: bold; padding: 4px 8px; rounded-md;"
      );
      console.log("👤 Perfil Completo:", profile);
      console.log("🎸 Top Artistas (Items):", topArtists);
      console.log("💿 Top Músicas (Items):", topTracks);
    }
  }, [profile, topArtists, topTracks, loading]);

  const openSpotify = () => {
    window.open("https://open.spotify.com", "_blank");
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  if (loading) {
    return (
      <div className="h-full rounded-3xl border border-zinc-800 bg-[#111827] p-6 flex flex-col justify-between">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-zinc-800 animate-pulse" />
          <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-3 w-48 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="space-y-3 mt-6">
          <div className="h-10 bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-10 bg-zinc-800 rounded-xl animate-pulse" />
        </div>
        <div className="h-10 bg-zinc-800 rounded-xl animate-pulse mt-auto" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full rounded-3xl border border-zinc-800 bg-[#111827] p-6 flex flex-col items-center justify-center text-center gap-3">
        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
          <AlertTriangle size={28} />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-200">Perfil indisponível</p>
          <p className="text-xs text-zinc-500 mt-0.5">Sua conta do Spotify pode estar desconectada.</p>
        </div>
      </div>
    );
  }

  const imageUrl = profile.images?.[0]?.url;
  const showImage = imageUrl && !imgFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      // 🟢 Adicionado 'group/card' aqui para monitorar o hover do bloco inteiro
      className="group/card h-full rounded-3xl border border-zinc-800 bg-[#111827] p-4 flex flex-col select-none"
    >
      {/* HEADER */}
      <div className="flex flex-col items-center text-center shrink-0">
        {showImage ? (
          <img
            src={imageUrl}
            onError={() => setImgFailed(true)}
            alt={profile.display_name}
            className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-500/40 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            {profile.display_name ? (
              <span className="text-2xl font-bold text-white">
                {getInitials(profile.display_name)}
              </span>
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
        )}

        <h2 className="mt-4 text-xl font-bold text-zinc-100 tracking-tight">
          {profile.display_name}
        </h2>

        <p className="text-zinc-400 text-xs mt-0.5 truncate max-w-full">{profile.email}</p>

        <div className="mt-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5">
          <BadgeCheck size={13} className="text-purple-400" />
          Spotify {profile.product}
        </div>
      </div>

      {/* INFO */}
      <div className="mt-6 space-y-2.5 text-xs shrink-0">
        <div className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-xl border border-zinc-800/20">
          <span className="text-zinc-400 flex items-center gap-2">
            <Globe size={14} /> País
          </span>
          <span className="text-zinc-200 font-medium">
            {formatCountry(profile.country)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-xl border border-zinc-800/20">
          <span className="text-zinc-400">Spotify ID</span>
          <span className="text-zinc-300 font-mono truncate max-w-[140px]">
            {profile.id}
          </span>
        </div>

        <div className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-xl border border-zinc-800/20">
          <span className="text-zinc-400 flex items-center gap-2">
            <Laptop size={14} /> Status
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Conectado
          </span>
        </div>
      </div>

      {/* TOP ARTISTS (Scroll Horizontal Oculto por padrão) */}
      <div className="mt-5 shrink-0">
        <h3 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-2">Top Artistas</h3>
        <div className="flex gap-2 overflow-x-auto pb-1
          [&::-webkit-scrollbar]:h-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-transparent
          group-hover/card:[&::-webkit-scrollbar-thumb]:bg-zinc-800/80
          [&::-webkit-scrollbar-thumb]:rounded-full
          transition-colors duration-300"
        >
          {topArtists.length > 0 ? (
            topArtists.map((artist: any) => (
              <div
                key={artist.id}
                className="text-xs font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800/40 px-3 py-2 rounded-xl whitespace-nowrap transition-colors"
              >
                {artist.name}
              </div>
            ))
          ) : (
            <span className="text-xs text-zinc-600 italic pl-1">Sem dados de artistas</span>
          )}
        </div>
      </div>

      {/* TOP TRACKS (Scroll Vertical Oculto por padrão) */}
      <div className="mt-4 flex-1 flex flex-col min-h-[110px]">
        <h3 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-2">Top Músicas</h3>
        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 max-h-[130px]
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-transparent
          group-hover/card:[&::-webkit-scrollbar-thumb]:bg-zinc-800/80
          [&::-webkit-scrollbar-thumb]:rounded-full
          transition-colors duration-300"
        >
          {topTracks.length > 0 ? (
            topTracks.map((track: any) => (
              <div
                key={track.id}
                className="flex justify-between items-center text-xs bg-zinc-800/30 hover:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-800/10 min-w-0 gap-3 transition-colors"
              >
                <span className="text-zinc-200 font-medium truncate flex-1">
                  {track.name}
                </span>
                <span className="text-zinc-500 text-[11px] truncate max-w-[110px] text-right">
                  {track.artists?.map((a: any) => a.name).join(", ")}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-zinc-600 italic pl-1">Sem dados de faixas</span>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className=" space-y-2.5 shrink-0">
        <button
          onClick={openSpotify}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all rounded-xl py-2.5 font-semibold text-white text-sm shadow-md shadow-emerald-950/30 group"
        >
          <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          Abrir Spotify
        </button>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full flex items-center justify-center gap-2 border border-zinc-700/60 hover:border-zinc-500 hover:bg-zinc-800/30 active:scale-[0.97] disabled:opacity-50 transition-all rounded-xl py-2.5 font-medium text-zinc-300 text-xs group"
        >
          <RefreshCw 
            size={13} 
            className={`text-zinc-400 group-hover:text-zinc-200 transition-colors ${isSyncing ? "animate-spin" : "group-hover:rotate-45 transition-transform duration-300"}`} 
          />
          {isSyncing ? "Sincronizando..." : "Sincronizar dados"}
        </button>
      </div>
    </motion.div>
  );
}