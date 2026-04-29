"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : undefined,
    },
  });

  if (error) return;

  const user = await api.get("/auth/me");

  router.push("/onboarding-form");
};


  return (
    <div className="space-y-4">

        <div className="relative flex items-center">
  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

  <input
    placeholder="Nome"
    className=" w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800  placeholder:text-gray-400 focus:outline-none  focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

      <div className="relative flex items-center">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

  <input
    placeholder="Email"
    className=" w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800  placeholder:text-gray-400 focus:outline-none  focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

      <div className="relative flex items-center">
  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

  <input
    type="password"
    placeholder="Senha"
    className=" w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800  placeholder:text-gray-400 focus:outline-none  focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</div>

      {/* BUTTON */}
      <button
        onClick={handleSignup}
        className="w-full cursor-pointer bg-purple-800 text-white py-3 rounded-xl font-medium hover:bg-purple-900 transition"
      >
        Criar conta
      </button>
    </div>
  );
}