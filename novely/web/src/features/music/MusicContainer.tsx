"use client";

import MusicLogin from "./MusicLogin";
import MusicConnected from "./MusicConnected";
import { useSpotify } from "./hooks/useSpotify";

export default function MusicContainer() {
  // "token" não existe mais — agora useSpotify expõe appToken,
  // spotifyAccessToken e connected separadamente. O que importa aqui
  // é só saber se a conta Spotify tá conectada ou não.
  const { connected, loading } = useSpotify();

  if (loading) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Carregando música...
      </div>
    );
  }

  if (!connected) {
    return <MusicLogin />;
  }

  return <MusicConnected />;
}