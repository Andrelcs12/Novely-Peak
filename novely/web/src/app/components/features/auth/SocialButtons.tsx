
"use client";

import { motion } from "framer-motion";

import { FcGoogle } from "react-icons/fc";

import {
  FaApple,
  FaFacebook,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";

export default function SocialButtons() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo:
          `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="space-y-3">

      {/* GOOGLE */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          onClick={handleGoogle}
          className="h-12 w-full cursor-pointer rounded-xl justify-center gap-3 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
        >
          <FcGoogle size={22} />

          <span className="text-sm font-medium text-gray-700">
            Continuar com Google
          </span>
        </Button>
      </motion.div>

      {/* FACEBOOK */}
      <Button
        disabled
        variant="outline"
        className="h-12 w-full rounded-xl justify-center gap-3 opacity-40"
      >
        <FaFacebook
          size={18}
          className="text-blue-600"
        />

        <span className="text-sm font-medium text-gray-500">
          Continuar com Facebook
        </span>
      </Button>

      {/* APPLE */}
      <Button
        disabled
        variant="outline"
        className="h-12 w-full rounded-xl justify-center gap-3 opacity-40"
      >
        <FaApple size={18} />

        <span className="text-sm font-medium text-gray-500">
          Continuar com Apple
        </span>
      </Button>

    </div>
  );
}

