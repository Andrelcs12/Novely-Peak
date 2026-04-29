"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Flag,
  Zap,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Brain,
} from "lucide-react";
import { api } from "@/lib/api";
import { Task } from "@/app/types/task";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  task?: Task | null;
};

export default function TaskModal({ open, onClose, onSaved, task }: Props) {
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // LOAD / RESET
  // =====================
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setPriority(task.priority || "MEDIUM");
        setStatus(task.status || "TODO");
        setDueDate(
          task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : ""
        );
        setEstimatedTime(task.estimatedTime ?? "");
      } else {
        reset();
      }
      setError(null);
    }
  }, [task, open]); // Dependência em `open` para resetar ao reabrir

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setEstimatedTime("");
    setStatus("TODO");
    setError(null);
  };

  // =====================
  // UX INTELLIGENCE
  // =====================
  const isGeneric =
    title.trim().toLowerCase() === "estudar" ||
    title.trim().toLowerCase() === "treinar";

  const isOverdue =
    dueDate &&
    new Date(dueDate) < new Date() &&
    status !== "DONE";

  const qualityScore = useMemo(() => {
    let score = 0;
    if (title.length > 10) score++;
    if (title.match(/\d+/)) score++;
    if (estimatedTime) score++;
    if (dueDate) score++;
    return score;
  }, [title, estimatedTime, dueDate]);

  const qualityLabel = ["Fraca", "Ok", "Boa", "Ótima"][qualityScore];

  const smartSuggestions = useMemo(() => {
    if (!title) return [];
    const suggestions = [];
    if (!estimatedTime) suggestions.push("Defina um tempo (ex: 30min)");
    if (!title.match(/\d+/)) suggestions.push("Adicione duração na tarefa");
    if (!dueDate) suggestions.push("Defina um prazo");
    return suggestions;
  }, [title, estimatedTime, dueDate]);

  // =====================
  // SAVE — separando status do update principal
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
        estimatedTime: estimatedTime ? Number(estimatedTime) : null,
        // NÃO incluímos status aqui — o service.update() ignora status
        // Status tem rota própria: PATCH /tasks/:id/status
      };

      if (isEdit && task) {
        // 1. Atualiza campos do task
        await api.patch(`/tasks/${task.id}`, payload);

        // 2. Se o status mudou, usa a rota correta de status
        if (status !== task.status) {
          await api.patch(`/tasks/${task.id}/status`, { status });
        }
      } else {
        // Na criação, enviamos o status inicial normalmente
        await api.post("/tasks", { ...payload, status });
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
    if (!task) return;
    setError(null);

    try {
      setLoading(true);
      await api.delete(`/tasks/${task.id}`);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Erro ao excluir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
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
                  {isEdit ? "Editar tarefa" : "Nova tarefa"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-200 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* INSIGHT */}
              {!isEdit && (
                <div className="flex gap-2 text-xs text-zinc-500">
                  <Zap size={14} className="text-purple-400 mt-[2px] shrink-0" />
                  Clareza aumenta execução. Defina ação + tempo.
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* ALERTA: GENÉRICA */}
              {isGeneric && (
                <div className="flex items-center gap-2 text-xs text-yellow-400">
                  <AlertCircle size={14} />
                  Tarefa genérica. Seja mais específico.
                </div>
              )}

              {/* ALERTA: ATRASADA */}
              {isOverdue && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={14} />
                  Essa tarefa está atrasada
                </div>
              )}

              {/* QUALIDADE */}
              {title && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Brain size={12} />
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

              {/* SUGESTÕES */}
              {smartSuggestions.length > 0 && (
                <div className="text-xs text-zinc-500 space-y-1">
                  {smartSuggestions.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              )}

              {/* TITLE */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Título da tarefa</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Estudar React por 30min"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Contexto (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Por que isso importa? Como executar?"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 resize-none"
                  rows={3}
                />
              </div>

              {/* PRAZO + TEMPO */}
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
                  <label className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock size={12} />
                    Tempo (min)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 30"
                    min={1}
                    max={600}
                    value={estimatedTime}
                    onChange={(e) =>
                      setEstimatedTime(e.target.value ? Number(e.target.value) : "")
                    }
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

              {/* STATUS (somente no EDIT) */}
              {isEdit && (
                <button
                  onClick={() => setStatus(status === "DONE" ? "TODO" : "DONE")}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
                >
                  <CheckCircle2
                    size={16}
                    className={
                      status === "DONE" ? "text-purple-400" : "text-zinc-500"
                    }
                  />
                  {status === "DONE" ? "Concluída" : "Marcar como concluída"}
                </button>
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
                  : "Criar tarefa"}
              </button>

              {/* DELETE */}
              {isEdit && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full text-red-400 hover:text-red-300 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  Excluir tarefa
                </button>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}