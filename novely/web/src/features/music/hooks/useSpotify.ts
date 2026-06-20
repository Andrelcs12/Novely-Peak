"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useSpotify() {
  // appToken = token de sessão do Supabase. É ESSE que deve ser usado
  // pra chamar qualquer rota do SEU backend (protegida por AuthGuard).
  const [appToken, setAppToken] = useState<string | null>(null);

  // spotifyAccessToken = token do Spotify. Só serve pra usar DIRETO
  // com APIs do próprio Spotify no navegador (ex: Web Playback SDK).
  // NUNCA deve ser mandado pro seu backend.
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<
    string | null
  >(null);

  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      console.log("[useSpotify] loading session...");

      const { data } = await supabase.auth.getSession();
      console.log("[useSpotify] session:", data);

      const token = data.session?.access_token;

      if (!token) {
        console.log("[useSpotify] NO appToken");
        setLoading(false);
        return;
      }

      console.log("[useSpotify] appToken OK");
      setAppToken(token);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      console.log("[useSpotify] spotify/me:", json);

      setConnected(json.connected ?? false);
      setSpotifyAccessToken(json.accessToken || null);
      setLoading(false);
    };

    load();

    // Mantém o appToken atualizado se a sessão do Supabase mudar
    // (login, logout, refresh automático de token, etc).
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAppToken(session?.access_token ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { appToken, spotifyAccessToken, connected, loading };
}