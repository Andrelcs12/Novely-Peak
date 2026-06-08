"use client";

import { motion } from "framer-motion";

import {
  Crown,
  Flame,
  Pencil,
  Trophy,
  User2,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

import { ProfileData } from "../types/profile";

type Props = {
  profile: ProfileData;
};

export default function ProfileHeader({
  profile,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative overflow-hidden
        rounded-3xl border border-purple-500/20
        bg-gradient-to-b from-zinc-900 to-zinc-950
        p-6
      "
    >
      {/* GLOW */}
      <div className="absolute -top-20 right-0 w-72 h-72 bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* LEFT */}
        <div className="flex items-center gap-5">
          {/* AVATAR */}
          <div className="w-24 h-24 rounded-3xl border border-purple-500/30 bg-zinc-900 overflow-hidden flex items-center justify-center">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : profile.name ? (
              <span className="text-3xl font-bold text-purple-400">
                {profile.name[0]}
              </span>
            ) : (
              <User2
                size={30}
                className="text-zinc-500"
              />
            )}
          </div>

          {/* INFO */}
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {profile.name || "Usuário"}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-400 text-sm">
                  @{profile.username}
                </span>

                <button className="text-zinc-500 hover:text-white transition">
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* PLAN */}
            <div
              className={`
                inline-flex items-center gap-2
                px-3 py-1 rounded-full border text-xs font-medium

                ${
                  profile.plan === "PRO"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300"
                }
              `}
            >
              <Crown size={13} />

              {profile.plan === "PRO"
                ? "Novely Pro"
                : "Plano Free"}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <StatCard
            label="Streak Atual"
            value={`${profile.streak?.current || 0} dias`}
            icon={Flame}
            color="#a855f7"
          />

          <StatCard
            label="Maior Streak"
            value={`${profile.streak?.best || 0} dias`}
            icon={Trophy}
            color="#f59e0b"
          />
        </div>
      </div>
    </motion.div>
  );
}