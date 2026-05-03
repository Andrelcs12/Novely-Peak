"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import DashboardKPIs from "./components/DashboardKPIs";
import DashboardTasks from "./components/DashboardTasks";
import DashboardGoals from "./components/DashboardGoals";
import DashboardInsight from "./components/DashboardInsight";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Goal = {
  id: string;
  title: string;
  progress: number;
  tasks: Task[];
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, goalsRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/goals"),
        ]);

        setTasks(tasksRes);
        setGoals(goalsRes);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const completedTasks = tasks.filter((t) => t.completed).length;

  const productivity = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  return (
    <div className="space-y-6 text-white">

      <DashboardKPIs
        tasks={tasks.length}
        completedTasks={completedTasks}
        goals={goals.length}
        productivity={productivity}
      />

      <DashboardInsight
        tasks={tasks.length}
        completedTasks={completedTasks}
        productivity={productivity}
      />

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardTasks tasks={tasks} />
        <DashboardGoals goals={goals} />
      </div>

    </div>
  );
}