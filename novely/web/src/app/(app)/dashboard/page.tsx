"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import DashboardKPIs from "./components/DashboardKPIs";
import DashboardTasks from "./components/DashboardTasks";
import DashboardInsight from "./components/DashboardInsight";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, goalsRes, userRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/goals"),
          api.get("/auth/me"),
        ]);

        setTasks(tasksRes);
        setGoals(goalsRes);
        setUser(userRes);
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
        goals={goals.length}
        productivity={productivity}
      />

      <DashboardTasks tasks={tasks} />

      {user && <DashboardInsight user={user} />}

    </div>
  );
}