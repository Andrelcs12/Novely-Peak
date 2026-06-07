
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Mail, Lock } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) return;

    await api.get("/auth/me");

    router.push("/dashboard");
  };

  return (
    <div className="space-y-4">

      {/* EMAIL */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          type="email"
          placeholder="Email"
          className="h-12 rounded-xl pl-10"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          type="password"
          placeholder="Senha"
          className="h-12 rounded-xl pl-10"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </div>

      {/* BUTTON */}
      <Button
        onClick={handleLogin}
        className="h-12 w-full cursor-pointer rounded-xl bg-purple-800 hover:bg-purple-900"
      >
        Entrar
      </Button>

    </div>
  );
}

