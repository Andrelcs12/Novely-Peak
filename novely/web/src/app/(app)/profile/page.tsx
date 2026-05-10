// ProfilePage.tsx

"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileSettings from "./components/ProfileSettings";

import StreakHeatmap from "./components/streak/StreakHeatmap";

import ProfileTabs from "./components/ProfileTabs";

import { ProfileData } from "./types/profile";

type Tab =
  | "overview"
  | "stats"
  | "streak"
  | "settings";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/user/profile"
      );

      setProfile(res.data ?? res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-zinc-500">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 text-white">
      {/* HEADER */}
      <ProfileHeader profile={profile} />

      {/* NAVIGATION */}
      <ProfileTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* CONTENT */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            <StreakHeatmap
              heatmap={profile.heatmap}
              completedTasks={profile.stats.completedTasks}
            />

            <ProfileStats
              profile={profile}
            />
          </>
        )}

        {activeTab === "stats" && (
          <ProfileStats
            profile={profile}
          />
        )}

        {activeTab === "streak" && (
          <StreakHeatmap
            heatmap={profile.heatmap}
            completedTasks={profile.stats.completedTasks}
          />
        )}

        {activeTab === "settings" && (
          <ProfileSettings
            profile={profile}
            onUpdated={load}
          />
        )}
      </div>
    </div>
  );
}