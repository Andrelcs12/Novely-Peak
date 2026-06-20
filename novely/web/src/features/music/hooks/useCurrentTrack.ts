"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "./useSpotify";

export function useCurrentTrack() {
  // Usa o appToken (Supabase), não o token do Spotify.
  // É esse que o AuthGuard do backend espera.
  const { appToken } = useSpotify();

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appToken) {
      console.log("[useCurrentTrack] no appToken");
      return;
    }

    const load = async () => {
      console.log("[useCurrentTrack] fetching current track...");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spotify/player/current`,
          {
            headers: {
              Authorization: `Bearer ${appToken}`,
            },
          }
        );

        console.log("[useCurrentTrack] status:", response.status);

        if (response.status === 204) {
          console.log("[useCurrentTrack] no content");
          setTrack(null);
          return;
        }

        const json = await response.json();
        console.log("[useCurrentTrack] track:", json);

        setTrack(json);
      } finally {
        setLoading(false);
      }
    };

    load();

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, [appToken]);

  return { track, loading };
}