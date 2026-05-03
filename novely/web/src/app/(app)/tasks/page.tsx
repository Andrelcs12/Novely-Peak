"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

import { Task } from "@/app/types/task";
import TasksHeader from "./components/TaskHeader";
import TasksStats from "./components/TaskStats";
import TasksList from "./components/TaskList";
import TaskModal from "./components/TaskCreateModal";
import TasksFilters from "./components/TasksFilter";
import TasksHelpModal from "./components/TaskHelpModal";
import TasksAnalytics from "./components/TasksAnalytics";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filter, setFilter] = useState<Filter>("ALL");

  const [search, setSearch] = useState("");
const [priority, setPriority] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");

  // LOAD
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

  
  const filteredTasks = useMemo(() => {
  return tasks
    .filter((t) => {
      const matchSearch = t.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchPriority =
        priority === "ALL" || t.priority === priority;

      if (filter === "ACTIVE" && t.status === "DONE") return false;
      if (filter === "COMPLETED" && t.status !== "DONE") return false;

      return matchSearch && matchPriority;
    })
    .sort((a, b) => {
      // overdue primeiro
      const aOverdue =
        a.dueDate && new Date(a.dueDate) < new Date() && a.status !== "DONE";
      const bOverdue =
        b.dueDate && new Date(b.dueDate) < new Date() && b.status !== "DONE";

      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

      // prioridade
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      if (a.priority !== b.priority) {
        return order[a.priority] - order[b.priority];
      }

      // data
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      return 0;
    });
}, [tasks, search, priority, filter]);

  const completed = useMemo(
    () => tasks.filter((t) => t.status === "DONE").length,
    [tasks]
  );

  // TOGGLE
  const handleToggle = async (task: Task) => {
    const newStatus: Task["status"] =
      task.status === "DONE" ? "TODO" : "DONE";

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.patch(`/tasks/${task.id}/status`, {
        status: newStatus,
      });
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      );
    }
  };

  // DELETE
  const handleDelete = async (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await api.delete(`/tasks/${task.id}`);
    } catch {
      setTasks((prev) => [...prev, task]);
    }
  };

  // EDIT
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedTask(null), 200);
  };

  const [helpOpen, setHelpOpen] = useState(false);

  const handleSaved = () => {
    loadTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 text-sm py-10">
        <span className="animate-pulse">●</span>
        Carregando tarefas...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto">

      <TasksHeader
  onCreate={() => {
    setSelectedTask(null);
    setOpen(true);
  }}
  filter={filter}
  setFilter={setFilter}
  onOpenHelp={() => setHelpOpen(true)}
/>

    


      <TasksStats tasks={tasks} />

<TasksAnalytics tasks={tasks} />

     <TasksHelpModal
  open={helpOpen}
  onClose={() => setHelpOpen(false)}
/>

      <TasksFilters
  search={search}
  setSearch={setSearch}
  priority={priority}
  setPriority={setPriority}
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
  onSaved={handleSaved}
  task={selectedTask}
  onOpenHelp={() => setHelpOpen(true)} // ✅ ADICIONAR
/>


    </div>
  );
}