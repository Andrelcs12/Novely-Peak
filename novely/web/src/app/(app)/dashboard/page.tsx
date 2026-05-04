"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import DashboardKPIs from "./components/DashboardKPIs";
import DashboardTasks from "./components/DashboardTasks";
import DashboardGoals from "./components/DashboardGoals";
import DashboardInsight from "./components/DashboardInsight";
import DashboardToday from "./components/DashboardToday";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  completedAt?: string | null;
  dueDate?: string | null;
  category?: string | null;
};

type Goal = {
  id: string;
  title: string;
  progress: number;
  tasks: Task[];
};

type TodayState = {
  started: boolean;
  ended: boolean;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [today, setToday] = useState<TodayState | null>(null);

  const load = async () => {
    try {
      const [tasksRes, goalsRes, todayRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/goals"),
        api.get("/streak/today"),
      ]);

      setTasks(tasksRes.data ?? tasksRes);
      setGoals(goalsRes.data ?? goalsRes);
      setToday(todayRes.data ?? todayRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "DONE").length;

  const productivity = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const tasksForUI = tasks.map((t) => ({
    ...t,
    completed: t.status === "DONE",
  }));

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardTasks tasks={tasksForUI} />
        <DashboardGoals goals={goals} />
      </div>

    </div>
  );
}