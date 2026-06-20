"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";

interface MusicPlayerProps {
  track: any;
  loading: boolean;
}

function formatTime(ms: number = 0) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function MusicPlayer({ track, loading }: MusicPlayerProps) {
  const { play, pause, next, previous, setVolume, playerError } =
    useSpotifyPlayer();

  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(60);
  const [muted, setMuted] = useState(false);
  const volumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!track?.progress_ms) return;

    setProgress(track.progress_ms);

    const interval = setInterval(() => {
      setProgress((old) => {
        if (!track?.is_playing) return old;
        return old + 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [track]);

  const handleVolumeChange = (value: number) => {
    setVolumeState(value);
    setMuted(false);

    if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
    volumeTimeout.current = setTimeout(() => {
      setVolume(value);
    }, 400);
  };

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(volume);
    } else {
      setMuted(true);
      setVolume(0);
    }
  };

  if (loading || !track?.item) {
    return (
      <div className="h-full rounded-3xl border border-zinc-800 bg-[#111827] flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-[280px] h-[280px] rounded-3xl bg-zinc-800 animate-pulse" />
        <div className="h-4 w-40 rounded bg-zinc-800 animate-pulse" />
        <div className="h-3 w-28 rounded bg-zinc-800 animate-pulse" />
        {!loading && (
          <p className="text-sm text-zinc-500 mt-2">
            Nada tocando agora. Escolha uma playlist pra começar.
          </p>
        )}
      </div>
    );
  }

  const duration = track.item.duration_ms || 1;
  const percentage = Math.min((progress / duration) * 100, 100);

  return (
    <div className="h-full rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#111827] to-[#0B1220] p-8 flex flex-col items-center gap-6">
      {/* COVER */}
      <AnimatePresence mode="wait">
        <motion.img
          key={track.item.id}
          src={track.item.album.images?.[0]?.url}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-[280px] h-[280px] rounded-3xl shadow-2xl shadow-purple-950/40 object-cover"
        />
      </AnimatePresence>

      {/* INFO */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100">
          {track.item.name}
        </h1>

        <p className="text-zinc-400 mt-1">
          {track.item.artists?.map((a: any) => a.name).join(", ")}
        </p>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-xl">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4 mt-4">
        <Button className="cursor-pointer" size="icon" variant="secondary" onClick={previous}>
          <SkipBack />
        </Button>

        <Button 
          size="icon"
          className="h-14 w-14 rounded-full cursor-pointer bg-purple-500 hover:bg-purple-400 text-zinc-950"
          onClick={() => (track.is_playing ? pause() : play())}
        >
          {track.is_playing ? <Pause /> : <Play />}
        </Button>

        <Button className="cursor-pointer" size="icon" variant="secondary" onClick={next}>
          <SkipForward />
        </Button>
      </div>

      {/* ERRO DO COMANDO (Premium ausente, sem dispositivo ativo, etc.) */}
      {playerError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl max-w-xl text-center"
        >
          <AlertCircle size={14} className="shrink-0" />
          <span>{playerError}</span>
        </motion.div>
      )}

      {/* VOLUME */}
      <div className="flex items-center gap-3 w-full max-w-md mt-2">
        <button
          type="button"
          onClick={toggleMute}
          className="text-zinc-400 hover:text-zinc-100 transition"
        >
          {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>
    </div>
  );
}