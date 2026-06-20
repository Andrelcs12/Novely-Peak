"use client";

import { useState } from "react";
import { useSpotify } from "./useSpotify";

export function useSpotifyPlayer() {
  const { appToken } = useSpotify();
  const [playerError, setPlayerError] = useState<string | null>(null);

  function friendlyMessage(status: number, raw: string) {
    if (status === 403) {
      return "Esse controle só funciona com Spotify Premium.";
    }
    if (status === 404) {
      return "Abra o Spotify em algum dispositivo (celular, desktop ou web) pra controlar por aqui.";
    }
    return raw;
  }

  const call = async (
    path: string,
    method: string,
    body?: Record<string, unknown>,
  ) => {
    setPlayerError(null);

    const hasBody = body && Object.keys(body).length > 0;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${path}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${appToken}`,
            ...(hasBody ? { "Content-Type": "application/json" } : {}),
          },
          ...(hasBody ? { body: JSON.stringify(body) } : {}),
        },
      );

      if (!response.ok) {
        let rawMessage = `Erro ${response.status}`;

        try {
          const data = await response.json();
          rawMessage = data?.message ?? rawMessage;
        } catch {
          // resposta vazia do backend (Spotify às vezes retorna 204/empty)
        }

        console.error(`[PLAYER] ${path} falhou:`, response.status, rawMessage);

        setPlayerError(friendlyMessage(response.status, rawMessage));
        return false;
      }

      return true;
    } catch (err) {
      console.error(`[PLAYER] ${path} falhou:`, err);
      setPlayerError("Não foi possível falar com o backend.");
      return false;
    }
  };

  const play = (options?: { uris?: string[]; context_uri?: string }) =>
    call("/spotify/player/play", "POST", options);

  const pause = () => call("/spotify/player/pause", "POST");

  const next = () => call("/spotify/player/next", "POST");

  const previous = () => call("/spotify/player/previous", "POST");

  const setVolume = (volumePercent: number) =>
    call("/spotify/player/volume", "PUT", {
      volume_percent: Math.max(0, Math.min(100, volumePercent)),
    });

  return {
    play,
    pause,
    next,
    previous,
    setVolume,
    playerError,
  };
}