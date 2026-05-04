"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

import { Goal, GoalPriorityFilter, GoalStatusFilter } from "@/app/types/goal";

import GoalsHeader from "./components/GoalsHeader";
import GoalsStats from "./components/GoalsStats";
import GoalsList from "./components/GoalsList";
import GoalsFilter from "./components/GoalsFilter";
import GoalsAnalytics from "./components/GoalsAnalytics";
import GoalModal from "./components/GoalsModal";
import GoalsHelpModal from "./components/GoalsHelpModal";
import GoalExpanded from "./components/GoalDetailPanel";
import GoalsSkeleton from "./components/GoalsSkeleton";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [helpOpen, setHelpOpen] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<Goal | null>(null);

  // FILTERS
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GoalStatusFilter>("ALL");
  const [priority, setPriority] = useState<GoalPriorityFilter>("ALL");

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/goals");
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // FILTER ENGINE
  const filteredGoals = useMemo(() => {
    return goals
      .filter((g) => {
        const matchSearch = g.title
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchStatus = status === "ALL" || g.status === status;
        const matchPriority = priority === "ALL" || g.priority === priority;

        return matchSearch && matchStatus && matchPriority;
      })
      .sort((a, b) => {
        const riskOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        const aRisk = a.riskLevel ?? "LOW";
        const bRisk = b.riskLevel ?? "LOW";

        if (aRisk !== bRisk) {
          return (riskOrder[aRisk] ?? 2) - (riskOrder[bRisk] ?? 2);
        }

        return b.progress - a.progress;
      });
  }, [goals, search, status, priority]);

  // ACTIONS
  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setOpen(true);
  };

  const handleDelete = async (goal: Goal) => {
    setGoals((prev) => prev.filter((g) => g.id !== goal.id));
    try {
      await api.delete(`/goals/${goal.id}`);
    } catch {
      setGoals((prev) => [...prev, goal]);
    }
  };

  const handleToggleTask = async (task: any) => {
  const nextStatus =
    task.status === "DONE"
      ? "TODO"
      : task.status === "TODO"
      ? "IN_PROGRESS"
      : "DONE";

  try {
    await api.patch(`/tasks/${task.id}/status`, {
      status: nextStatus,
    });

    // 🔥 recalcula progresso da meta
    await api.post(`/goals/${task.goalId}/recalc`);

    // 🔥 recarrega tudo (simples e seguro)
    await loadGoals();
  } catch (err) {
    console.error(err);
  }
};

  const handleToggleComplete = async (goal: Goal) => {
    const newStatus: Goal["status"] =
      goal.status === "COMPLETED" ? "ACTIVE" : "COMPLETED";

    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, status: newStatus } : g))
    );

    try {
      await api.patch(`/goals/${goal.id}/status`, { status: newStatus });
    } catch {
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, status: goal.status } : g))
      );
    }
  };

  const handleProgressChange = async (goal: Goal, progress: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, progress } : g))
    );
    try {
      await api.patch(`/goals/${goal.id}/progress`, { progress });
    } catch {
      setGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, progress: goal.progress } : g))
      );
    }
  };

  const handleOpenGoal = (goal: Goal) => {
    setExpandedGoal(goal);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedGoal(null), 200);
  };

  

  if (loading) {
    return <GoalsSkeleton />
  }


  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto">
 
      {/* 1. HEADER — ação principal */}
      <GoalsHeader
        onCreate={() => {
          setSelectedGoal(null);
          setOpen(true);
        }}
        onOpenHelp={() => setHelpOpen(true)}
      />
 
      <GoalsStats goals={goals} />
 
      <GoalsAnalytics goals={goals} />

      <GoalsFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />

      <GoalsList
  goals={filteredGoals}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleComplete={handleToggleComplete}
  onOpen={handleOpenGoal}
/>
 
      {/* MODALS */}
      <GoalModal
        open={open}
        onClose={handleClose}
        onSaved={loadGoals}
        goal={selectedGoal}
      />
 
      <GoalsHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
 
      <GoalExpanded
  goal={expandedGoal}
  onClose={() => setExpandedGoal(null)}
  onToggleTask={handleToggleTask}
/>
    </div>
  );
}