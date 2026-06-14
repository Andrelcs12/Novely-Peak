"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "@/lib/api";

import { Task, ChecklistItem, TaskLinkItem } from "@/types/task";

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
import Empty from "@/components/ui/empty";
import { CircleHelp, Plus } from "lucide-react";

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
  const [priority, setPriority] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");

  const [helpOpen, setHelpOpen] = useState(false);

  // LOAD TASKS
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

  // Sincroniza o painel expandido aberto caso a lista principal mude de estado
  useEffect(() => {
    if (expandedTask) {
      const updated = tasks.find((t) => t.id === expandedTask.id);
      if (updated) setExpandedTask(updated);
    }
  }, [tasks, expandedTask]);

  // FILTER & SORT
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchPriority = priority === "ALL" || t.priority === priority;

        if (filter === "ACTIVE" && t.status === "DONE") return false;
        if (filter === "COMPLETED" && t.status !== "DONE") return false;

        return matchSearch && matchPriority;
      })
      .sort((a, b) => {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return order[a.priority] - order[b.priority];
      });
  }, [tasks, search, priority, filter]);

  // TOGGLE STATUS (Otimista)
  const handleToggle = async (task: Task) => {
    const newStatus: Task["status"] = task.status === "DONE" ? "TODO" : "DONE";

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === "DONE" ? new Date().toISOString() : null,
            }
          : t
      )
    );

    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });

      const progressRes = await api.get("/streak/today");
      const actualData = progressRes.data ?? progressRes;
      const currentProgress = actualData?.progress ?? 0;

      await api.post("/streak/update", { progress: currentProgress });
      window.dispatchEvent(new Event("streak_updated"));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    }
  };

  // MUTATE CHECKLIST (Chamado diretamente de dentro do TaskExpandedPanel)
  const handleUpdateChecklist = async (taskId: string, updatedChecklist: ChecklistItem[]) => {
    // Atualização local imediata
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checklist: updatedChecklist } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}`, { checklist: updatedChecklist });
    } catch (error) {
      console.error("Erro ao salvar checklist:", error);
      loadTasks(); // Fallback seguro em caso de erro na API
    }
  };

  // MUTATE LINKS (Chamado diretamente de dentro do TaskExpandedPanel)
  const handleUpdateLinks = async (taskId: string, updatedLinks: TaskLinkItem[]) => {
    // Atualização local imediata
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, links: updatedLinks } : t)));

    try {
      await api.patch(`/tasks/${taskId}`, { links: updatedLinks });
    } catch (error) {
      console.error("Erro ao salvar links:", error);
      loadTasks();
    }
  };

  // DELETE
  const handleDelete = async (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    if (expandedTask?.id === task.id) setExpandedTask(null);

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

  const isEmpty = !loading && tasks.length === 0;


  if (loading) return <TasksSkeleton />;

  

  return (
    <>
     
     { isEmpty ? (
       <Empty
      image="/empty/task-empty.svg"
      title="Nenhuma tarefa criada"
      description="Crie sua primeira tarefa e comece a organizar seu dia."
      actions={[
        {
          label: "Saber mais",
          icon: <CircleHelp size={18} />,
          onClick: () => setHelpOpen(true),
          variant: "secondary",
        },
        {
          label: "Criar tarefa",
          icon: <Plus size={18} />,
          onClick: () => {
            setSelectedTask(null);
            setOpen(true);
          },
        },
      ]}
    />
    ) : (

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

      {/* PERIOD FILTERS */}
      <div className="flex gap-2 text-xs">
        {[
          { key: "today", label: "Hoje" },
          { key: "7d", label: "7 dias" },
          { key: "all", label: "Tudo" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key as Period)}
            className={`px-3 py-1 rounded transition font-medium cursor-pointer ${
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
 

      <TasksFilters
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
      />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TASK LIST */}
        <div className="lg:col-span-2">
          <TasksList
            tasks={filteredTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onOpen={(task) => setExpandedTask(task)}
          />
        </div>

        {/* 7 DAYS HISTORY */}
        <div className="lg:col-span-1">
          <TasksHistory7d tasks={tasks7d} onOpen={(task) => setExpandedTask(task)} />
        </div>
      </div>

      
    </div>
    )
  }

  {/* MODAL CREATION/EDITION */}
      <TaskModal
        open={open}
        onClose={handleClose}
        onSaved={handleSaved}
        task={selectedTask}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* EXPANDED SIDE PANEL (ON DEMAND FOR CHECKLISTS & LINKS) */}
      <TaskExpandedPanel
        task={expandedTask}
        onClose={() => setExpandedTask(null)}
        onUpdateChecklist={handleUpdateChecklist}
        onUpdateLinks={handleUpdateLinks}
      />

      
      <TasksHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

    </>
  )
}

  
      
   
