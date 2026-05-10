// src/services/streak/streak.service.ts

import { api } from "@/lib/api";
import { StreakData } from "./streak.types";

type Listener = (
  streak: StreakData
) => void;

class StreakService {
  private streak: StreakData = {
    current: 0,
    best: 0,
    status: "ACTIVE",
  };

  private listeners =
    new Set<Listener>();

  // ====================================
  // GET LOCAL
  // ====================================

  get() {
    return this.streak;
  }

  // ====================================
  // SUBSCRIBE
  // ====================================

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    // envia valor atual
    listener(this.streak);

    return () => {
      this.listeners.delete(
        listener
      );
    };
  }

  // ====================================
  // EMIT
  // ====================================

  private emit() {
    this.listeners.forEach(
      (listener) =>
        listener(this.streak)
    );
  }

  // ====================================
  // LOAD
  // ====================================

  async load() {
    try {
      const res =
        await api.get("/streak/me");

      this.streak = {
        current:
          res?.data?.current ??
          res?.current ??
          0,

        best:
          res?.data?.best ??
          res?.best ??
          0,

        status:
          res?.data?.status ??
          res?.status ??
          "ACTIVE",
      };

      this.emit();

      return this.streak;
    } catch (err) {
      console.error(err);

      return this.streak;
    }
  }

  // ====================================
  // FORCE UPDATE
  // ====================================

  async refresh() {
    return this.load();
  }
}

export const streakService =
  new StreakService();