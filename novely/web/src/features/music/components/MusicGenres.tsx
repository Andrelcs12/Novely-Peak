"use client";

import { motion } from "framer-motion";
import { GENRE_CARDS } from "../genres";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import {
  Target,
  BookOpen,
  Flame,
  Globe,
  Music2,
  Mic2,
} from "lucide-react";

const ICONS: Record<string, any> = {
  Target,
  BookOpen,
  Flame,
  Globe,
  Music2,
  Mic2,
};

export default function MusicGenres({ currentTrack, loading }: any) {
  const { play } = useSpotifyPlayer();
  const activeUri = currentTrack?.context?.uri;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {GENRE_CARDS.map((genre, index) => {
        const Icon = ICONS[genre.icon];
        const isActive = genre.uri === activeUri;

        return (
          <motion.button
            key={genre.id}
            disabled={loading}
            onClick={() => play({ context_uri: genre.uri })}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: loading ? 1 : 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative overflow-hidden rounded-2xl p-4 h-24 text-left
              bg-gradient-to-br ${genre.gradient}
              shadow-md transition
              ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              ${isActive ? "ring-2 ring-white/80 shadow-xl" : ""}
            `}
          >
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />

            {isActive && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}

            <Icon className="relative z-10 text-white w-5 h-5" />

            <span className="block mt-6 text-sm font-semibold text-white relative z-10">
              {genre.label}
            </span>

            {isActive && (
              <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-white animate-ping" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}