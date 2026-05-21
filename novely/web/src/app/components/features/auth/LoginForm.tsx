"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return;

    const user = await api.get("/auth/me");
    router.push("/onboarding-form");
  };

  return (
    <div className="space-y-4">
      {/* INPUT EMAIL */}
      <div className="relative flex items-center">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* INPUT SENHA */}
      <div className="relative flex items-center">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="password"
          placeholder="Senha"
          className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleLogin}
        className="w-full cursor-pointer bg-purple-800 text-white py-3 rounded-xl font-medium hover:bg-purple-900 active:scale-[0.98] transition-all"
      >
        Entrar
      </button>
    </div>
  );
}