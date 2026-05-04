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
import TasksSkeleton from "./components/TasksSkeleton";
import TasksHistory7d from "./components/TasksHistory7d";
import TaskExpandedPanel from "./components/TasksExpandedPanel";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";
type Period = "today" | "7d" | "all";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks7d, setTasks7d] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<Period>("today");

  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [expandedTask, setExpandedTask] = useState<Task | null>(null);

  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<
    "ALL" | "LOW" | "MEDIUM" | "HIGH"
  >("ALL");

  const [helpOpen, setHelpOpen] = useState(false);

  // LOAD
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [res, res7d] = await Promise.all([
        api.get(`/tasks?period=${period}`),
        api.get(`/tasks?period=7d`),
      ]);

      setTasks(res.data ?? res);
      setTasks7d(res7d.data ?? res7d);
    } catch (err) {
      console.error(err);
      setTasks([]);
      setTasks7d([]);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // FILTER
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
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return order[a.priority] - order[b.priority];
      });
  }, [tasks, search, priority, filter]);

  // ACTIONS
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

      window.dispatchEvent(new Event("streak_updated"));
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      );
    }
  };

  const handleDelete = async (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await api.delete(`/tasks/${task.id}`);
    } catch {
      setTasks((prev) => [...prev, task]);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedTask(null), 200);
  };

  const handleSaved = () => {
    loadTasks();
  };

  if (loading) return <TasksSkeleton />;

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

      {/* PERIOD */}
      <div className="flex gap-2 text-xs">
        {[
          { key: "today", label: "Hoje" },
          { key: "7d", label: "7 dias" },
          { key: "all", label: "Tudo" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as Period)}
            className={`px-3 py-1 rounded transition ${
              period === p.key
                ? "bg-purple-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

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

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LISTA */}
        <div className="lg:col-span-2">
         <TasksList
  tasks={filteredTasks}
  onToggle={handleToggle}
  onDelete={handleDelete}
  onEdit={handleEdit}
  onOpen={(task) => setExpandedTask(task)}   // 👈 ADD ISSO
/>
        </div>

        {/* HISTÓRICO */}
        <div className="lg:col-span-1">
          <TasksHistory7d
            tasks={tasks7d}
            onOpen={(task) => setExpandedTask(task)}
          />
        </div>

      </div>

      {/* MODAL */}
      <TaskModal
        open={open}
        onClose={handleClose}
        onSaved={handleSaved}
        task={selectedTask}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* EXPANDED PANEL */}
      <TaskExpandedPanel
        task={expandedTask}
        onClose={() => setExpandedTask(null)}
      />

    </div>
  );
}