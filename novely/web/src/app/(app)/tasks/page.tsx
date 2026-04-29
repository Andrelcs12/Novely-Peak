"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

import { Task } from "@/app/types/task";
import TasksHeader from "./components/TaskHeader";
import TasksStats from "./components/TaskStats";
import TasksList from "./components/TaskList";
import TaskModal from "./components/TaskCreateModal";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filter, setFilter] = useState<Filter>("ALL");

  // =====================
  // LOAD
  // =====================
  const loadTasks = useCallback(async () => {
    try {
      const data = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // =====================
  // FILTERS
  // =====================
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "ACTIVE") return t.status !== "DONE";
      if (filter === "COMPLETED") return t.status === "DONE";
      return true;
    });
  }, [tasks, filter]);

  const completed = useMemo(
    () => tasks.filter((t) => t.status === "DONE").length,
    [tasks]
  );

  // =====================
  // TOGGLE — usa rota /status correta
  // =====================
  const handleToggle = async (task: Task) => {
    const newStatus: Task["status"] =
      task.status === "DONE" ? "TODO" : "DONE";

    // Optimistic update para UX instantânea
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );

    try {
      // Backend tem rota separada: PATCH /tasks/:id/status
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      // Reverte o optimistic update se falhou
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      );
    }
  };

  // =====================
  // DELETE — remove localmente sem refetch
  // =====================
  const handleDelete = async (task: Task) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await api.delete(`/tasks/${task.id}`);
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      // Reverte se falhou
      setTasks((prev) => [...prev, task]);
    }
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  // =====================
  // MODAL CLOSE
  // =====================
  const handleClose = () => {
    setOpen(false);
    // Pequeno delay para não limpar o selectedTask antes da animação fechar
    setTimeout(() => setSelectedTask(null), 300);
  };

  // =====================
  // SAVED — recarrega a lista
  // =====================
  const handleSaved = () => {
    loadTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 text-sm py-8">
        <span className="animate-pulse">●</span>
        Carregando tarefas...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">

      <TasksHeader
        onCreate={() => {
          setSelectedTask(null);
          setOpen(true);
        }}
        filter={filter}
        setFilter={setFilter}
      />

      <TasksStats
        total={tasks.length}
        completed={completed}
      />

      <TasksList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <TaskModal
        open={open}
        onClose={handleClose}
        onSaved={handleSaved}  // ← CORRIGIDO: agora recarrega as tasks
        task={selectedTask}
      />

    </div>
  );
}