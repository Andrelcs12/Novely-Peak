
"use client";

import { useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SocialButtons from "./SocialButtons";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

export default function AuthContainer() {
  const [mode, setMode] =
    useState<"login" | "signup">(
      "signup"
    );

  return (
    <div className="flex min-h-screen bg-white">

      {/* LEFT SIDE */}
      <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 lg:flex">

        <div className="max-w-md space-y-6 text-center">

          <img
            src={
              mode === "login"
                ? "/auth/login.png"
                : "/auth/register.png"
            }
            alt="Auth visual"
            className="w-full object-contain"
          />

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-purple-900">
              {mode === "login"
                ? "Continue sua jornada de produtividade"
                : "Comece a organizar sua vida hoje"}
            </h2>

            <p className="text-sm leading-relaxed text-gray-500">
              O Novely Peak ajuda você
              a transformar foco em
              progresso real.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">

        <div className="w-full max-w-md border-none shadow-none">

          <CardContent className="space-y-6 p-0">

            {/* HEADER */}
            <div className="space-y-2 text-center">

              <h1 className="text-3xl font-bold text-purple-900">
                {mode === "login"
                  ? "Bem-vindo de volta"
                  : "Crie sua conta"}
              </h1>

              <p className="text-sm text-gray-500">
                Organize sua produtividade
                em poucos minutos
              </p>

            </div>

            {/* FORM */}
            <AnimatePresence mode="wait">

              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                {mode === "login" ? (
                  <LoginForm />
                ) : (
                  <SignupForm />
                )}
              </motion.div>

            </AnimatePresence>

            {/* DIVIDER */}
            <div className="flex items-center gap-4">

              <Separator className="flex-1" />

              <span className="text-xs uppercase tracking-wide text-gray-400">
                ou
              </span>

              <Separator className="flex-1" />

            </div>

            {/* SOCIAL */}
            <SocialButtons />

            {/* TOGGLE */}
            <div className="text-center text-sm text-gray-600">

              {mode === "login" ? (
                <p>
                  Não tem conta?{" "}

                  <Button
                    variant="link"
                    onClick={() =>
                      setMode("signup")
                    }
                    className="h-auto p-0 font-semibold text-purple-800"
                  >
                    Criar agora
                  </Button>

                </p>
              ) : (
                <p>
                  Já tem conta?{" "}

                  <Button
                    variant="link"
                    onClick={() =>
                      setMode("login")
                    }
                    className="h-auto p-0 font-semibold text-purple-800"
                  >
                    Entrar
                  </Button>

                </p>
              )}

            </div>

          </CardContent>

        </div>

      </div>
    </div>
  );
}

