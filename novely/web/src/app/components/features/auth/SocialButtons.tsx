"use client";

import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SocialButtons() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding-form`,
      },
    });
  };

  return (
    <div className="space-y-3">

      {/* GOOGLE */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogle}
        className="w-full border border-gray-200 bg-white py-3 rounded-xl flex items-center justify-center gap-3 hover:border-purple-300 hover:bg-purple-50 transition"
      >
        <FcGoogle size={22} />
        <span className="text-sm font-medium text-gray-700">
          Continuar com Google
        </span>
      </motion.button>

      {/* FACEBOOK */}
      <button
        disabled
        className="w-full border border-gray-200 bg-white py-3 rounded-xl flex items-center justify-center gap-3 opacity-40 cursor-not-allowed"
      >
        <FaFacebook size={18} className="text-blue-600" />
        <span className="text-sm font-medium text-gray-500">
          Continuar com Facebook
        </span>
      </button>

      {/* APPLE */}
      <button
        disabled
        className="w-full border border-gray-200 bg-white py-3 rounded-xl flex items-center justify-center gap-3 opacity-40 cursor-not-allowed"
      >
        <FaApple size={18} />
        <span className="text-sm font-medium text-gray-500">
          Continuar com Apple
        </span>
      </button>
    </div>
  );
}