"use client";

import { CheckCircle2, Circle } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function DashboardTasks({
  tasks,
}: {
  tasks: Task[];
}) {
  if (!tasks.length) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm">
        Nenhuma tarefa ainda. Comece criando a primeira.
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">
          Tarefas recentes
        </span>

        <span className="text-xs text-purple-400">
          {tasks.length} total
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {tasks.slice(0, 5).map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between text-sm bg-zinc-800/40 px-3 py-2 rounded-lg hover:bg-zinc-800/70 transition"
          >
            <div className="flex items-center gap-2">
              {task.completed ? (
                <CheckCircle2
                  size={16}
                  className="text-purple-400"
                />
              ) : (
                <Circle
                  size={16}
                  className="text-zinc-500"
                />
              )}

              <span
                className={`${
                  task.completed
                    ? "line-through text-zinc-500"
                    : "text-zinc-200"
                }`}
              >
                {task.title}
              </span>
            </div>

            <span className="text-xs text-zinc-500">
              {task.completed ? "Concluída" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}