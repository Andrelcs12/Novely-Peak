"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import DashboardKPIs from "./components/DashboardKPIs";
import DashboardTasks from "./components/DashboardTasks";
import DashboardGoals from "./components/DashboardGoals";
import DashboardInsight from "./components/DashboardInsight";

import { Task } from "@/app/types/task";
import { Goal } from "@/app/types/goal";

import { CheckCircle2 } from "lucide-react";
import StatCard from "@/app/components/ui/StatCard";

type TodayState = {
  started: boolean;
  ended: boolean;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [today, setToday] = useState<TodayState | null>(null);
  const [last7dCompleted, setLast7dCompleted] = useState(0);

  const load = async () => {
    try {
      const [tasksRes, goalsRes, todayRes, last7dRes] = await Promise.all([
        api.get("/tasks?period=today"),
        api.get("/goals?period=today"),
        api.get("/streak/today"),
        api.get("/tasks?period=7d"), // 🔥 novo
      ]);

      setTasks(tasksRes.data ?? tasksRes);
      setGoals(goalsRes.data ?? goalsRes);
      setToday(todayRes.data ?? todayRes);

      const last7d = last7dRes.data ?? last7dRes;
      setLast7dCompleted(last7d.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const completedTasks = tasks.filter(
    (t) => t.status === "DONE"
  ).length;

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
  last7dCompleted={last7dCompleted}
/>

      <DashboardInsight
        tasks={tasks.length}
        completedTasks={completedTasks}
        productivity={productivity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardTasks tasks={tasks} />
        <DashboardGoals goals={goals} />
      </div>

    </div>
  );
}