"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "./useSpotify";

export function useSpotifyPlaylists() {
  const { appToken } = useSpotify();

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!appToken) return;

    const load = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spotify/playlists`,
          {
            headers: {
              Authorization: `Bearer ${appToken}`,
            },
          }
        );

        console.log("[useSpotifyPlaylists] status:", response.status);

        if (!response.ok) {
          const body = await response.text();
          console.error("[useSpotifyPlaylists] erro do backend:", body);
          setError(true);
          return;
        }

        const json = await response.json();
        console.log("[useSpotifyPlaylists] items:", json.items?.length);

        setPlaylists(json.items ?? []);
      } catch (err) {
        console.error("[useSpotifyPlaylists] fetch falhou:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appToken]);

  return { playlists, loading, error };
}