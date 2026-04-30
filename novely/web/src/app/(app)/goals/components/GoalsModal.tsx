"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Flag,
  Target,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Palette,
} from "lucide-react";
import { api } from "@/lib/api";
import { Goal } from "@/app/types/goal";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  goal?: Goal | null;
};

const ICON_OPTIONS = ["🎯", "💪", "📚", "🚀", "💡", "🏆", "❤️", "💰", "🌱", "🎨"];

const COLOR_OPTIONS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export default function GoalModal({ open, onClose, onSaved, goal }: Props) {
  const isEdit = !!goal;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [status, setStatus] = useState<"ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED">("ACTIVE");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#8b5cf6");
  const [icon, setIcon] = useState("🎯");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // LOAD / RESET
  // =====================
  useEffect(() => {
    if (open) {
      if (goal) {
        setTitle(goal.title || "");
        setDescription(goal.description || "");
        setPriority(goal.priority || "MEDIUM");
        setStatus(goal.status || "ACTIVE");
        setProgress(goal.progress ?? 0);
        setDueDate(
          goal.dueDate
            ? new Date(goal.dueDate).toISOString().split("T")[0]
            : ""
        );
        setCategory(goal.category || "");
        setColor(goal.color || "#8b5cf6");
        setIcon(goal.icon || "🎯");
      } else {
        reset();
      }
      setError(null);
    }
  }, [goal, open]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setStatus("ACTIVE");
    setProgress(0);
    setDueDate("");
    setCategory("");
    setColor("#8b5cf6");
    setIcon("🎯");
    setError(null);
  };

  // =====================
  // UX INTELLIGENCE
  // =====================
  const isOverdue =
    dueDate && new Date(dueDate) < new Date() && status !== "COMPLETED";

  const qualityScore = useMemo(() => {
    let score = 0;
    if (title.length > 10) score++;
    if (description.length > 10) score++;
    if (dueDate) score++;
    return score;
  }, [title, description, dueDate]);

  const qualityLabel = ["Fraca", "Ok", "Boa", "Ótima"][qualityScore];

  // =====================
  // SAVE
  // =====================
  const handleSubmit = async () => {
    if (!title.trim()) return;
    setError(null);

    try {
      setLoading(true);

      const payload = {
        title,
        description: description || null,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category || null,
        color,
        icon,
      };

      if (isEdit && goal) {
        await api.patch(`/goals/${goal.id}`, payload);

        // Progresso tem rota própria
        if (progress !== goal.progress) {
          await api.patch(`/goals/${goal.id}/progress`, { progress });
        }

        // Status tem rota própria
        if (status !== goal.status) {
          await api.patch(`/goals/${goal.id}/status`, { status });
        }
      } else {
        await api.post("/goals", { ...payload, status, progress });
      }

      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Erro ao salvar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async () => {
    if (!goal) return;
    setError(null);

    try {
      setLoading(true);
      await api.delete(`/goals/${goal.id}`);
      onSaved();
      onClose();
    } catch (err: any) {
      setError("Erro ao excluir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {isEdit ? "Editar meta" : "Nova meta"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-200 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* OVERDUE */}
              {isOverdue && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={14} />
                  Essa meta está atrasada
                </div>
              )}

              {/* QUALITY */}
              {title && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Target size={12} />
                    Qualidade
                  </span>
                  <span
                    className={
                      qualityScore >= 3
                        ? "text-green-400"
                        : qualityScore === 2
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {qualityLabel}
                  </span>
                </div>
              )}

              {/* ICON + COLOR */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 flex items-center gap-1">
                  <Palette size={12} />
                  Ícone e cor
                </label>

                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((i) => (
                    <button
                      key={i}
                      onClick={() => setIcon(i)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition ${
                        icon === i
                          ? "border-purple-400 bg-purple-600/20"
                          : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mt-1">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        color === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Título da meta</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ler 12 livros em 2025"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Por que isso importa? (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contexto, motivação, como atingir..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 resize-none"
                  rows={3}
                />
              </div>

              {/* PRAZO + CATEGORIA */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 flex items-center gap-1">
                    <Calendar size={12} />
                    Prazo
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Categoria</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="ex: Saúde, Carreira"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* PRIORIDADE */}
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 flex items-center gap-1">
                  <Flag size={12} />
                  Prioridade
                </label>
                <div className="flex gap-2">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-lg text-xs border transition ${
                        priority === p
                          ? "bg-purple-600/20 border-purple-400 text-purple-400"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {p === "LOW" && "Baixa"}
                      {p === "MEDIUM" && "Média"}
                      {p === "HIGH" && "Alta"}
                    </button>
                  ))}
                </div>
              </div>

              {/* PROGRESSO (edição) */}
              {isEdit && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Progresso</span>
                    <span style={{ color }}>{progress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full cursor-pointer accent-purple-500"
                  />
                </div>
              )}

              {/* STATUS (edição) */}
              {isEdit && (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["ACTIVE", "PAUSED", "COMPLETED", "ABANDONED"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`py-2 rounded-lg text-xs border transition ${
                          status === s
                            ? "bg-purple-600/20 border-purple-400 text-purple-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        {{ ACTIVE: "Ativa", PAUSED: "Pausada", COMPLETED: "Concluída", ABANDONED: "Abandonada" }[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition py-2 rounded-lg text-sm font-medium"
              >
                {loading
                  ? "Salvando..."
                  : isEdit
                  ? "Salvar alterações"
                  : "Criar meta"}
              </button>

              {/* DELETE */}
              {isEdit && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full text-red-400 hover:text-red-300 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Excluir meta
                </button>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}