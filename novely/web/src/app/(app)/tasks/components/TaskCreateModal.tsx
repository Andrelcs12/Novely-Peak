"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Task } from "@/app/types/task";
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number | "">("");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LOAD
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
    } else {
      reset();
    }

    setError(null);
  }, [task, open]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    setEstimatedTime("");
    setStatus("TODO");
  };

  // UX
  const isGeneric =
    title?.trim().toLowerCase() === "estudar" ||
    title?.trim().toLowerCase() === "treinar";

    const isOverdue = useMemo(() => {
  if (!dueDate) return false;

  const now = new Date();
  const due = new Date(dueDate);

  return due < now && status !== "DONE";
}, [dueDate, status]);


  const qualityScore = useMemo(() => {
    let score = 0;
    if (title?.length > 10) score++;
    if (title?.match(/\d+/)) score++;
    if (estimatedTime) score++;
    if (dueDate) score++;
    return score;
  }, [title, estimatedTime, dueDate]);

  const qualityLabel = ["Fraca", "Ok", "Boa", "Ótima"][qualityScore];

  // SAVE
  const handleSubmit = async () => {
    if (!title?.trim()) return;

    try {
      setLoading(true);

      const payload = {
        title,
        description: description || null,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedTime: estimatedTime ? Number(estimatedTime) : null,
      };

      if (isEdit && task) {
        await api.patch(`/tasks/${task.id}`, payload);

        if (status !== task.status) {
          await api.patch(`/tasks/${task.id}/status`, { status });
        }
      } else {
        await api.post("/tasks", { ...payload, status });
      }

      onSaved();
      onClose();
    } catch {
      setError("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!task) return;

    try {
      setLoading(true);
      await api.delete(`/tasks/${task.id}`);
      onSaved();
      onClose();
    } catch {
      setError("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  };

  // STATUS FLOW
  const toggleStatus = () => {
    if (status === "TODO") return setStatus("IN_PROGRESS");
    if (status === "IN_PROGRESS") return setStatus("DONE");
    return setStatus("TODO");
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

          {/* MOBILE */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 md:hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <TaskModalForm
              {...{
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
              }}
            />
          </motion.div>

          {/* DESKTOP DRAWER */}
          <motion.div
            className="hidden md:flex fixed top-0 right-0 h-full w-full max-w-md z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="w-full h-full bg-zinc-900 border-l border-purple-600/50 p-6 overflow-y-auto">
              <TaskModalForm
                {...{
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
                  isEdit,
                  handleSubmit,
                  handleDelete,
                  loading,
                  error,
                  isGeneric,
                  isOverdue,
                  qualityLabel,
                  onOpenHelp,
                  onClose,
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}