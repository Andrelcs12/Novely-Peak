"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "./useSpotify";

export function useSpotifyProfile() {
  const { appToken } = useSpotify();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appToken) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spotify/profile/extended`,
          {
            headers: {
              Authorization: `Bearer ${appToken}`,
            },
          },
        );

        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appToken]);

  return {
    profile: data?.profile,
    topTracks: data?.topTracks ?? [],
    topArtists: data?.topArtists ?? [],
    loading,
  };
}