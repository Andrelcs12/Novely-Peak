"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialButtons from "./SocialButtons";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthContainer() {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-[100dvh] flex bg-white">

      {/* LEFT SIDE - VISUAL (desktop only) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100">

        <div className="max-w-md text-center space-y-6">

          <img
            src={mode === "login" ? "/auth/login.png" : "/auth/register.png"}
            className="w-full object-contain"
            alt="auth visual"
          />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-purple-900">
              {mode === "login"
                ? "Continue sua jornada de produtividade"
                : "Comece a organizar sua vida hoje"}
            </h2>

            <p className="text-sm text-gray-500">
              O Novely Peak ajuda você a transformar foco em resultado real.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">

        <div className="w-full max-w-md space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-purple-900">
              {mode === "login"
                ? "Bem-vindo de volta"
                : "Crie sua conta gratuita"}
            </h1>

            <p className="text-sm text-gray-500">
              Organize sua produtividade em poucos minutos
            </p>
          </div>

          {/* FORM */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {mode === "login" ? <LoginForm /> : <SignupForm />}
            </motion.div>
          </AnimatePresence>

          {/* SOCIAL */}
          <SocialButtons />

          {/* TOGGLE */}
          <div className="text-center  text-sm text-gray-600">
            {mode === "login" ? (
              <p>
                Não tem conta?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-purple-800 cursor-pointer font-semibold"
                >
                  Criar agora
                </button>
              </p>
            ) : (
              <p>
                Já tem conta?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-purple-800 cursor-pointer  font-semibold"
                >
                  Entrar
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}