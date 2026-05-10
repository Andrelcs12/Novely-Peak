"use client";

import { motion } from "framer-motion";

import { useState } from "react";

import { Save } from "lucide-react";

import { api } from "@/lib/api";

import { ProfileData } from "../types/profile";

type Props = {
  profile: ProfileData;
  onUpdated?: () => void;
};

export default function ProfileSettings({
  profile,
  onUpdated,
}: Props) {
  const [name, setName] = useState(
    profile.name || ""
  );

  const [username, setUsername] = useState(
    profile.username || ""
  );

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await api.patch("/user/profile", {
        name,
        username,
      });

      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        rounded-3xl border border-purple-500/20
        bg-gradient-to-b from-zinc-900 to-zinc-950
        p-6
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Configurações do Perfil
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          Personalize sua identidade dentro do
          Novely Peak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Nome
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full px-4 py-3 rounded-xl
              bg-zinc-900 border border-zinc-800
              text-white
              focus:outline-none
              focus:border-purple-500
            "
          />
        </div>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">
            Username
          </label>

          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
                  .toLowerCase()
                  .replace(/\s/g, "")
              )
            }
            className="
              w-full px-4 py-3 rounded-xl
              bg-zinc-900 border border-zinc-800
              text-white
              focus:outline-none
              focus:border-purple-500
            "
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="
          mt-6 inline-flex items-center gap-2
          px-5 py-3 rounded-xl
          bg-purple-600 hover:bg-purple-700
          disabled:opacity-50
          transition font-medium
        "
      >
        <Save size={16} />

        {loading
          ? "Salvando..."
          : "Salvar alterações"}
      </button>
    </motion.div>
  );
}