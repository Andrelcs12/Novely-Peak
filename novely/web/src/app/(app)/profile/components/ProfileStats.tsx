"use client";

import { motion } from "framer-motion";

import {
  Calendar,
  CheckCircle2,
  Flame,
  Target,
} from "lucide-react";

import StatCard from "@/app/components/ui/StatCard";

import { ProfileData } from "../types/profile";

type Props = {
  profile: ProfileData;
};

export default function ProfileStats({
  profile,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard
        label="Tasks concluídas"
        value={profile.stats.completedTasks}
        icon={CheckCircle2}
      />

      <StatCard
        label="Metas concluídas"
        value={profile.stats.completedGoals}
        icon={Target}
      />

      <StatCard
        label="Produtividade"
        value={`${profile.stats.productivity}%`}
        icon={Flame}
        color="#a855f7"
      />

      <StatCard
        label="Dias ativos"
        value={profile.stats.activeDays}
        icon={Calendar}
      />
    </motion.div>
  );
}