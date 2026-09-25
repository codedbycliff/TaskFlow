import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
  Plus,
  Search,
  Bell,
  Trash2,
  RotateCcw,
} from "lucide-react";

import AddTaskModal from "../components/AddTaskModal";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      const data = await createTask(taskData);

      setTasks((current) => [data.task, ...current]);
      setShowAddTask(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create task.");
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const data = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id ? data.task : item
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);

      setTasks((current) =>
        current.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete task.");
    }
  };

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) =>
      [
        task.title,
        task.description,
        task.category,
        task.priority,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [tasks, search]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      change: `${totalTasks} total`,
      icon: ListTodo,
    },
    {
      title: "Completed",
      value: completedTasks,
      change: `${completionRate}%`,
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: pendingTasks,
      change: `${pendingTasks} remaining`,
      icon: Clock3,
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      change: completedTasks > 0 ? "Keep going!" : "Get started",
      icon: TrendingUp,
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        {/* HEADER */}
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Today
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Good morning, Cliff 👋
            </h2>

            <p className="mt-2 text-slate-400">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 md:flex">
              <Search
                size={18}
                className="text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tasks..."
                className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>

            {/* NOTIFICATIONS */}
            <button className="relative rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 transition hover:text-white">
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500" />
            </button>

            {/* ADD */}
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <span>{error}</span>

            <button
              onClick={loadTasks}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-red-500/10"
            >
              <RotateCcw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon size={20} />
                  </div>

                  <span className="text-xs font-medium text-emerald-400">
                    {stat.change}
                  </span>
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* MAIN */}
        <section className="mt-8 grid gap-6 xl:grid-cols-3">

          {/* TASKS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 xl:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h3 className="font-semibold text-white">
                  My Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={loadTasks}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center px-6 py-20 text-slate-500">
                Loading your tasks...
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <ListTodo size={26} />
                </div>

                <h4 className="mt-5 font-semibold text-white">
                  No tasks found
                </h4>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Create your first task and start organizing
                  your day.
                </p>

                <button
                  onClick={() => setShowAddTask(true)}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  <Plus size={17} />
                  Create Task
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-4 px-6 py-5 transition hover:bg-slate-900"
                  >

                    {/* COMPLETE */}
                    <button
                      onClick={() =>
                        handleToggleTask(task)
                      }
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        task.completed
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-slate-600 hover:border-indigo-400"
                      }`}
                    >
                      {task.completed && (
                        <CheckCircle2
                          size={14}
                          className="text-white"
                        />
                      )}
                    </button>

                    {/* TASK INFO */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{task.category}</span>

                        <span>•</span>

                        <span>
                          {task.dueDate
                            ? new Date(
                                task.dueDate
                              ).toLocaleDateString()
                            : "No due date"}
                        </span>
                      </div>
                    </div>

                    {/* PRIORITY */}
                    <span
                      className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:block ${
                        task.priority === "High"
                          ? "bg-red-500/10 text-red-400"
                          : task.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDeleteTask(task._id)
                      }
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete task"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCTIVITY */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="font-semibold text-white">
              Productivity
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your current progress
            </p>

            <div className="mt-8 flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-slate-800">
                <div
                  className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-indigo-500 border-r-indigo-500"
                  style={{
                    transform: `rotate(${completionRate * 1.8 - 45}deg)`,
                  }}
                />

                <div className="text-center">
                  <p className="text-4xl font-bold text-white">
                    {completionRate}%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    completed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Completed
                </span>

                <span className="font-medium text-white">
                  {completedTasks}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Remaining
                </span>

                <span className="font-medium text-white">
                  {pendingTasks}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Total
                </span>

                <span className="font-medium text-white">
                  {totalTasks}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-indigo-500/10 p-4">
              <p className="text-sm text-indigo-300">
                {completionRate >= 70
                  ? "You're doing great! 🚀"
                  : totalTasks === 0
                    ? "Ready to get started?"
                    : "Keep going! 💪"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Complete your tasks to improve your
                productivity score.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={handleAddTask}
        />
      )}
    </main>
  );
}

export default Dashboard;