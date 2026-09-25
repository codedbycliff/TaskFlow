
import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  ListTodo,
} from "lucide-react";

import { getTasks } from "../services/api";

function Analytics() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTasks();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const active = total - completed;

  const high = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const rate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: ListTodo,
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
    {
      title: "Active",
      value: active,
      icon: Clock3,
    },
    {
      title: "High Priority",
      value: high,
      icon: BarChart3,
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        <h2 className="text-3xl font-bold text-white">
          Analytics
        </h2>

        <p className="mt-2 text-slate-400">
          Understand your productivity and task progress.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <Icon
                  size={22}
                  className="text-indigo-400"
                />

                <p className="mt-5 text-sm text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="font-semibold text-white">
            Completion Rate
          </h3>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span className="text-slate-500">
              Progress
            </span>

            <span className="font-semibold text-indigo-400">
              {rate}%
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;
