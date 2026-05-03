"use client";

import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Flag,
  Calendar,
  AlignLeft,
  BadgeInfo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { GoalFormState } from "@/app/types/goal";

type Task = GoalFormState["tasks"][number];

type Props = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
};

export default function GoalTasksEditor({ tasks, onChange }: Props) {
  const addTask = () => {
    onChange([
      ...tasks,
      {
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      },
    ]);
  };

  const updateTask = <K extends keyof Task>(
    index: number,
    key: K,
    value: Task[K]
  ) => {
    const updated = [...tasks];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    onChange(updated);
  };

  const removeTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  const toggleDone = (index: number) => {
    const updated = [...tasks];
    updated[index].status =
      updated[index].status === "DONE" ? "TODO" : "DONE";
    onChange(updated);
  };

  return (
    <div className="space-y-4 pt-2">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-200">
            Tarefas da meta
          </p>
          <p className="text-[11px] text-zinc-500">
            Organize ações que compõem essa meta
          </p>
        </div>

        <button
          onClick={addTask}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                     bg-purple-600/10 text-purple-400
                     hover:bg-purple-600/20 transition cursor-pointer"
        >
          <Plus size={14} />
          Nova tarefa
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task, i) => {
            const done = task.status === "DONE";

            return (
              <motion.div
                key={task.id ?? i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className={`
                  rounded-xl border p-4 space-y-3 transition
                  hover:border-purple-500/40 cursor-pointer
                  ${
                    done
                      ? "bg-purple-500/5 border-purple-500/20"
                      : "bg-zinc-950 border-zinc-800"
                  }
                `}
              >

                {/* TOP ROW */}
                <div className="flex items-center gap-2">

                  {/* CHECK */}
                  <button
                    onClick={() => toggleDone(i)}
                    className="shrink-0 hover:scale-110 transition"
                  >
                    {done ? (
                      <CheckCircle2 size={18} className="text-purple-400" />
                    ) : (
                      <Circle size={18} className="text-zinc-600" />
                    )}
                  </button>

                  {/* TITLE */}
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] text-zinc-500">
                      Título
                    </label>

                    <input
                      value={task.title}
                      onChange={(e) =>
                        updateTask(i, "title", e.target.value)
                      }
                      placeholder="Ex: Estudar 30 minutos"
                      className={`
                        bg-transparent text-sm outline-none
                        ${done ? "line-through text-zinc-500" : "text-white"}
                      `}
                    />
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => removeTask(i)}
                    className="text-zinc-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <AlignLeft size={10} />
                    Descrição
                  </label>

                  <textarea
                    value={task.description ?? ""}
                    onChange={(e) =>
                      updateTask(i, "description", e.target.value)
                    }
                    placeholder="Opcional: detalhes da tarefa"
                    className="text-xs bg-zinc-900/40 border border-zinc-800
                               rounded-lg p-2 text-zinc-300 resize-none outline-none"
                  />
                </div>

                {/* META GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">

                  {/* PRIORITY */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Flag size={10} />
                      Prioridade
                    </label>

                    <select
                      value={task.priority}
                      onChange={(e) =>
                        updateTask(i, "priority", e.target.value as Task["priority"])
                      }
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300 cursor-pointer"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>

                  {/* DUE DATE */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar size={10} />
                      Prazo
                    </label>

                    <input
                      type="date"
                      value={task.dueDate || ""}
                      onChange={(e) =>
                        updateTask(i, "dueDate", e.target.value)
                      }
                      className="bg-zinc-900 border border-zinc-800
                                 rounded-lg px-2 py-1 text-zinc-300 cursor-pointer"
                    />
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <BadgeInfo size={10} />
                      Status
                    </label>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTask(i, "status", e.target.value as Task["status"])
                      }
                      className="bg-zinc-900 border border-zinc-800
                                 rounded-lg px-2 py-1 text-zinc-300 cursor-pointer"
                    >
                      <option value="TODO">A fazer</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="DONE">Concluída</option>
                    </select>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 && (
        <div className="text-xs text-zinc-500 border border-dashed border-zinc-800
                        rounded-xl p-4 text-center">
          Nenhuma tarefa adicionada ainda. Clique em “Nova tarefa”.
        </div>
      )}
    </div>
  );
}