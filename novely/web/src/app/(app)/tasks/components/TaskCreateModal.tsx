"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Task, ChecklistItem, TaskLinkItem } from "@/types/task";
import TaskModalForm from "./TaskModalForm";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  task?: Task | null;
  onOpenHelp: () => void;
};

export default function TaskCreateModal({
  open,
  onClose,
  onSaved,
  task,
  onOpenHelp,
}: Props) {
  const isEdit = !!task;

  // ── Form state ───────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [links, setLinks] = useState<TaskLinkItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Load / reset on open ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    if (task) {
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setPriority(task.priority ?? "MEDIUM");
      setStatus(task.status ?? "TODO");
      setDueDate(
        task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : ""
      );
      setEstimatedTime(task.estimatedTime ?? "");
      setChecklist(Array.isArray(task.checklist) ? task.checklist : []);
      setLinks(Array.isArray(task.links) ? task.links : []);
    } else {
      reset();
    }

    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, open]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setEstimatedTime("");
    setStatus("TODO");
    setChecklist([]);
    setLinks([]);
    setError(null);
  };

  // ── UX helpers ───────────────────────────────────────────────────────────────
  const isGeneric = ["estudar", "treinar", "trabalhar", "ler"].includes(
    title.trim().toLowerCase()
  );

  const isOverdue = useMemo(() => {
    if (!dueDate || status === "DONE") return false;
    return new Date(dueDate + "T23:59:59") < new Date();
  }, [dueDate, status]);

  const qualityScore = useMemo(() => {
    let score = 0;
    if (title.length > 10) score++;
    if (/\d/.test(title)) score++;
    if (estimatedTime) score++;
    if (dueDate) score++;
    return score;
  }, [title, estimatedTime, dueDate]);

  const qualityLabel = (["Fraca", "Ok", "Boa", "Ótima"] as const)[qualityScore];

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        estimatedTime: estimatedTime ? Number(estimatedTime) : null,
        status,
        completedAt: status === "DONE" ? new Date().toISOString() : null,
        checklist,
        links,
      };

      if (isEdit && task) {
        await api.patch(`/tasks/${task.id}`, payload);

        // Sincroniza endpoint dedicado de status se mudou
        if (status !== task.status) {
          await api.patch(`/tasks/${task.id}/status`, { status });
        }
      } else {
        await api.post("/tasks", payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!task) return;

    try {
      setLoading(true);
      setError(null);
      await api.delete(`/tasks/${task.id}`);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir tarefa.");
    } finally {
      setLoading(false);
    }
  };

  // ── Status cycle: TODO → IN_PROGRESS → DONE → TODO ──────────────────────────
  const toggleStatus = () => {
    setStatus((prev) => {
      if (prev === "TODO") return "IN_PROGRESS";
      if (prev === "IN_PROGRESS") return "DONE";
      return "TODO";
    });
  };

  const formProps = {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    estimatedTime,
    setEstimatedTime,
    priority,
    setPriority,
    status,
    toggleStatus,
    checklist,
    setChecklist,
    links,
    setLinks,
    isEdit,
    handleSubmit,
    handleDelete,
    loading,
    error,
    isGeneric,
    isOverdue,
    qualityLabel,
    onClose,
    onOpenHelp,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MOBILE: bottom sheet → centered */}
          <motion.div
            className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="w-full max-w-md max-h-[92vh] overflow-y-auto">
              <TaskModalForm {...formProps} />
            </div>
          </motion.div>

          {/* DESKTOP: right drawer */}
          <motion.div
            className="hidden md:block fixed top-0 right-0 h-full w-full max-w-md z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="w-full h-full bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
              <TaskModalForm {...formProps} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}