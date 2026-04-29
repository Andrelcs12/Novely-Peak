"use client";

import { Task } from "@/app/types/task";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Flag,
  Pencil,
  Clock,
  AlertTriangle,
} from "lucide-react";

type Props = {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
};

function priorityStyle(priority: Task["priority"]) {
  switch (priority) {
    case "HIGH":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    case "MEDIUM":
      return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    case "LOW":
      return "text-blue-400 border-blue-500/30 bg-blue-500/10";
  }
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR");
}

function isOverdue(task: Task) {
  if (!task.dueDate) return false;
  if (task.status === "DONE") return false;
  return new Date(task.dueDate) < new Date();
}

export default function TasksList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  if (!tasks.length) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm text-center">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">

      {tasks.map((task) => {
        const overdue = isOverdue(task);

        return (
          <div
            key={task.id}
            className="group flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition"
          >

            {/* LEFT */}
            <div className="flex items-start gap-3 flex-1 min-w-0">

              <button onClick={() => onToggle(task)}>
                {task.status === "DONE" ? (
                  <CheckCircle2 size={18} className="text-purple-400" />
                ) : (
                  <Circle size={18} className="text-zinc-500" />
                )}
              </button>

              <div className="flex flex-col min-w-0">

                <span
                  className={`text-sm truncate ${
                    task.status === "DONE"
                      ? "line-through text-zinc-500"
                      : "text-zinc-200"
                  }`}
                >
                  {task.title}
                </span>

                {/* META */}
                <div className="flex flex-wrap gap-2 mt-1">

                  {/* PRIORITY */}
                  <span
                    className={`text-[10px] px-2 py-[2px] rounded-full border flex items-center gap-1 ${priorityStyle(
                      task.priority
                    )}`}
                  >
                    <Flag size={10} />
                    {task.priority}
                  </span>

                  {/* DUE DATE */}
                  {task.dueDate && (
                    <span className="text-[10px] px-2 py-[2px] rounded-full border border-zinc-700 text-zinc-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}

                  {/* TIME */}
                  {task.estimatedTime && (
                    <span className="text-[10px] px-2 py-[2px] rounded-full border border-zinc-700 text-zinc-400 flex items-center gap-1">
                      <Clock size={10} />
                      {task.estimatedTime}min
                    </span>
                  )}

                  {/* OVERDUE */}
                  {overdue && (
                    <span className="text-[10px] px-2 py-[2px] rounded-full border border-red-500/40 text-red-400 flex items-center gap-1">
                      <AlertTriangle size={10} />
                      atrasada
                    </span>
                  )}

                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">

              <button onClick={() => onEdit(task)}>
                <Pencil size={16} className="text-zinc-400 hover:text-white" />
              </button>

              <button onClick={() => onDelete(task)}>
                <Trash2 size={16} className="text-zinc-400 hover:text-red-400" />
              </button>

            </div>

          </div>
        );
      })}
    </div>
  );
}