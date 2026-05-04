"use client";

import { useEffect, useState } from "react";
import { Goal } from "@/app/types/goal";
import {
  X,
  TrendingUp,
  ShieldAlert,
  Brain,
  BarChart3,
  Activity,
  Target,
  Calendar,
  Save,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

type Props = {
  goal: Goal | null;
  onClose: () => void;
  onToggleTask: (task: any) => void;
  onUpdated?: () => void;
};

export default function GoalExpanded({
  goal,
  onClose,
  onToggleTask,
  onUpdated,
}: Props) {
  const [localGoal, setLocalGoal] = useState<Goal | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalGoal(goal);
  }, [goal]);

  if (!localGoal) return null;

  const updateTask = (index: number, field: string, value: any) => {
    setLocalGoal((prev) => {
      if (!prev) return prev;

      const tasks = [...(prev.tasks || [])];
      tasks[index] = {
        ...tasks[index],
        [field]: value,
      };

      return { ...prev, tasks };
    });
  };

  const saveAll = async () => {
    if (!localGoal) return;

    setSaving(true);
    try {
      await api.patch(`/goals/${localGoal.id}`, {
        title: localGoal.title,
        description: localGoal.description,
        status: localGoal.status,
        priority: localGoal.priority,
        tasks: localGoal.tasks,
      });

      onUpdated?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {goal && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            className="
              relative
              w-full sm:w-[560px]
              h-full
              bg-zinc-950
              border-l border-zinc-800
              flex flex-col
              overflow-hidden
            "
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >

            {/* HEADER */}
            <div className="flex items-start justify-between p-5 border-b border-zinc-800">
              <div className="space-y-1 w-full pr-4">

                <p className="text-xs text-zinc-500">
                  Detalhes da meta
                </p>

                <input
                  value={localGoal.title}
                  onChange={(e) =>
                    setLocalGoal({ ...localGoal, title: e.target.value })
                  }
                  className="text-xl font-semibold text-white bg-transparent outline-none w-full"
                />

                <textarea
                  value={localGoal.description || ""}
                  onChange={(e) =>
                    setLocalGoal({
                      ...localGoal,
                      description: e.target.value,
                    })
                  }
                  className="text-xs text-zinc-500 bg-transparent outline-none w-full resize-none"
                />
              </div>

              <button onClick={onClose}>
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* STATUS CONTROLS */}
              <div className="flex gap-2 text-xs">

                <select
                  value={localGoal.status}
                  onChange={(e) =>
                    setLocalGoal({
                      ...localGoal,
                      status: e.target.value as any,
                    })
                  }
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ABANDONED">ABANDONED</option>
                </select>

                <select
                  value={localGoal.priority}
                  onChange={(e) =>
                    setLocalGoal({
                      ...localGoal,
                      priority: e.target.value as any,
                    })
                  }
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>

                {localGoal.dueDate && (
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Calendar size={12} />
                    {new Date(localGoal.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-2 gap-3">

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <BarChart3 size={14} className="text-purple-400" />
                  <p className="text-xs text-zinc-400">Score</p>
                  <p className="text-white">{localGoal.score ?? 0}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Brain size={14} className="text-blue-400" />
                  <p className="text-xs text-zinc-400">Health</p>
                  <p className="text-white">{localGoal.healthScore ?? 0}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <ShieldAlert size={14} className="text-red-400" />
                  <p className="text-xs text-zinc-400">Risk</p>
                  <p className="text-white">{localGoal.riskLevel ?? "LOW"}</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Activity size={14} className="text-green-400" />
                  <p className="text-xs text-zinc-400">Tasks</p>
                  <p className="text-white">
                    {localGoal.tasks?.filter(t => t.status === "DONE").length ?? 0}
                    /{localGoal.tasks?.length ?? 0}
                  </p>
                </div>

              </div>

              {/* TASKS */}
              <div className="space-y-3">

                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Target size={14} />
                  Tarefas
                </div>

                {localGoal.tasks?.map((t, i) => {
                  const done = t.status === "DONE";

                  return (
                    <div
                      key={t.id}
                      className="
                        p-3 rounded-xl
                        bg-zinc-900
                        border border-zinc-800
                        space-y-2
                      "
                    >

                      <input
                        value={t.title}
                        onChange={(e) =>
                          updateTask(i, "title", e.target.value)
                        }
                        className={`w-full bg-transparent outline-none text-sm ${
                          done ? "line-through text-zinc-500" : "text-white"
                        }`}
                      />

                      <textarea
                        value={t.description || ""}
                        onChange={(e) =>
                          updateTask(i, "description", e.target.value)
                        }
                        className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300"
                      />

                      <div className="flex gap-2 text-xs">

                        <select
                          value={t.status}
                          onChange={(e) =>
                            updateTask(i, "status", e.target.value)
                          }
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>

                        <select
                          value={t.priority}
                          onChange={(e) =>
                            updateTask(i, "priority", e.target.value)
                          }
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                        </select>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-5 border-t border-zinc-800 flex justify-end gap-2">

              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400"
              >
                Cancelar
              </button>

              <button
                onClick={saveAll}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm flex items-center gap-2"
              >
                <Save size={14} />
                {saving ? "Salvando..." : "Salvar"}
              </button>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}