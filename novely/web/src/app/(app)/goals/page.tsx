"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

import { Goal } from "@/app/types/goal";
import GoalsHeader from "./components/GoalsHeader";
import GoalsStats from "./components/GoalsStats";
import GoalsList from "./components/GoalsList";
import GoalModal from "./components/GoalsModal";

type Filter = "ALL" | "ACTIVE" | "COMPLETED" | "PAUSED";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [filter, setFilter] = useState<Filter>("ALL");

  // =====================
  // LOAD
  // =====================
  const loadGoals = useCallback(async () => {
    try {
      const data = await api.get("/goals");
      setGoals(data);
    } catch (err) {
      console.error("Erro ao carregar metas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // =====================
  // FILTERS
  // =====================
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (filter === "ACTIVE") return g.status === "ACTIVE";
      if (filter === "COMPLETED") return g.status === "COMPLETED";
      if (filter === "PAUSED") return g.status === "PAUSED";
      return true;
    });
  }, [goals, filter]);

  // =====================
  // PROGRESS — optimistic
  // =====================
  const handleProgressChange = async (goal: Goal, progress: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, progress } : g))
    );

    try {
      await api.patch(`/goals/${goal.id}/progress`, { progress });
      // Se o backend auto-completou (progress === 100), sincroniza
      if (progress === 100) {
        setGoals((prev) =>
          prev.map((g) =>
            g.id === goal.id ? { ...g, status: "COMPLETED" } : g
          )
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar progresso:", err);
      // Reverte
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, progress: goal.progress } : g))
      );
    }
  };

  // =====================
  // STATUS TOGGLE — optimistic
  // =====================
  const handleStatusToggle = async (goal: Goal) => {
    const newStatus: Goal["status"] =
      goal.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, status: newStatus } : g))
    );

    try {
      await api.patch(`/goals/${goal.id}/status`, { status: newStatus });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, status: goal.status } : g))
      );
    }
  };

  // =====================
  // DELETE — optimistic
  // =====================
  const handleDelete = async (goal: Goal) => {
    setGoals((prev) => prev.filter((g) => g.id !== goal.id));

    try {
      await api.delete(`/goals/${goal.id}`);
    } catch (err) {
      console.error("Erro ao excluir meta:", err);
      setGoals((prev) => [...prev, goal]);
    }
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setOpen(true);
  };

  // =====================
  // MODAL
  // =====================
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedGoal(null), 300);
  };

  const handleSaved = () => {
    loadGoals();
  };

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 text-sm py-8">
        <span className="animate-pulse">●</span>
        Carregando metas...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">

      <GoalsHeader
        onCreate={() => {
          setSelectedGoal(null);
          setOpen(true);
        }}
        filter={filter}
        setFilter={setFilter}
      />

      <GoalsStats goals={goals} />

      <GoalsList
        goals={filteredGoals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onProgressChange={handleProgressChange}
        onToggleComplete={handleStatusToggle}
      />

      <GoalModal
        open={open}
        onClose={handleClose}
        onSaved={handleSaved}
        goal={selectedGoal}
      />

    </div>
  );
}