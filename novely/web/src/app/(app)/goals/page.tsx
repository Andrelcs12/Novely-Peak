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
import GoalsHistory7d from "./components/GoalsHistory7d";
import GoalsSkeleton from "./components/GoalsSkeleton";

type Period = "today" | "week" | "all";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goals7d, setGoals7d] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<Period>("today");

  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [helpOpen, setHelpOpen] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<Goal | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GoalStatusFilter>("ALL");
  const [priority, setPriority] = useState<GoalPriorityFilter>("ALL");

  // =========================
  // LOAD GOALS (FONTE ÚNICA)
  // =========================
  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const [res, res7d] = await Promise.all([
        api.get(`/goals?period=${period}`),
        api.get(`/goals?period=week`),
      ]);

      const data = res.data ?? res;
      const data7d = res7d.data ?? res7d;

      setGoals(Array.isArray(data) ? data : []);
      setGoals7d(Array.isArray(data7d) ? data7d : []);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // =========================
  // FILTERED GOALS
  // =========================
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "ALL" || g.status === status;
      const matchPriority = priority === "ALL" || g.priority === priority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [goals, search, status, priority]);

  const handleToggleTask = async (task: any) => {
  if (!task?.id || !task?.goalId) return;

  const nextStatus =
    task.status === "DONE"
      ? "TODO"
      : task.status === "TODO"
      ? "IN_PROGRESS"
      : "DONE";

  try {
    // 🔥 GARANTE BODY SEMPRE EXISTE
    await api.patch(`/tasks/${task.id}/status`, {
      status: nextStatus,
    });

    // ❌ REMOVIDO: endpoint inexistente
    // await api.post(`/goals/${task.goalId}/recalc`);

    // 🔥 usa recalc interno correto (via GET reload)
    const [res, res7d] = await Promise.all([
      api.get(`/goals?period=${period}`),
      api.get(`/goals?period=week`),
    ]);

    const data = res.data ?? res;
    const data7d = res7d.data ?? res7d;

    const newGoals = Array.isArray(data) ? data : [];
    const newGoals7d = Array.isArray(data7d) ? data7d : [];

    setGoals(newGoals);
    setGoals7d(newGoals7d);

    // 🔥 sync expanded
    setExpandedGoal((prev) => {
      if (!prev) return null;
      return newGoals.find((g) => g.id === prev.id) ?? null;
    });

  } catch (err) {
    console.error("handleToggleTask error:", err);
  }
};

  // =========================
  // LOADING
  // =========================
  if (loading) return <GoalsSkeleton />;

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">

      {/* HEADER */}
      <GoalsHeader
        onCreate={() => {
          setSelectedGoal(null);
          setOpen(true);
        }}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <GoalsStats goals={goals} />
      <GoalsAnalytics goals={goals} />

      {/* FILTERS */}
      <div className="flex gap-2 text-xs">
        {[
          { key: "today", label: "Hoje" },
          { key: "week", label: "7 dias" },
          { key: "all", label: "Tudo" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as Period)}
            className={`px-3 py-1 rounded ${
              period === p.key
                ? "bg-purple-500 text-white"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <GoalsFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LIST */}
        <div className="lg:col-span-7">
          <GoalsList
            goals={filteredGoals}
            onEdit={(g) => {
              setSelectedGoal(g);
              setOpen(true);
            }}
            onDelete={async (goal) => {
              setGoals((p) => p.filter((g) => g.id !== goal.id));
              await api.delete(`/goals/${goal.id}`);
            }}
            onToggleComplete={async (goal) => {
              await api.patch(`/goals/${goal.id}/status`, {
                status:
                  goal.status === "COMPLETED" ? "ACTIVE" : "COMPLETED",
              });

              loadGoals();
            }}
            onOpen={(goal) => setExpandedGoal(goal)}
          />
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-5 space-y-6">

          <GoalsHistory7d
            goals={goals7d}
            onSelect={(goal) => setExpandedGoal(goal)}
          />

          <GoalExpanded
            goal={expandedGoal}
            onClose={() => setExpandedGoal(null)}
            onToggleTask={handleToggleTask}
          />

        </div>
      </div>

      {/* MODAIS */}
      <GoalModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={loadGoals}
        goal={selectedGoal}
      />

      <GoalsHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
}