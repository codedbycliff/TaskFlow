import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Search,
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

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAddTask, setShowAddTask] = useState(false);
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

      setTasks((current) => [
        data.task,
        ...current,
      ]);

      setShowAddTask(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const data = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id
            ? data.task
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks((current) =>
        current.filter((task) => task._id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        [
          task.title,
          task.description,
          task.category,
          task.priority,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Completed" && task.completed) ||
        (filter === "Pending" && !task.completed) ||
        task.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Task management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              My Tasks
            </h1>

            <p className="mt-2 text-slate-400">
              Manage everything you need to get done.
            </p>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            <Plus size={18} />
            Add Task
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

            <span>{error}</span>

            <button
              onClick={loadTasks}
              className="flex items-center gap-2"
            >
              <RotateCcw size={15} />
              Retry
            </button>

          </div>
        )}

        {/* SEARCH + FILTER */}

        <div className="mt-8 flex flex-col gap-3 md:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">

            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tasks..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

        </div>

        {/* TASK LIST */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

          {loading ? (
            <div className="flex justify-center px-6 py-20 text-slate-500">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

              <ListTodo
                size={40}
                className="text-indigo-400"
              />

              <h3 className="mt-4 font-semibold text-white">
                No tasks found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add a task or change your filters.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-4 px-6 py-5 hover:bg-slate-900"
                >

                  {/* COMPLETE */}

                  <button
                    onClick={() =>
                      handleToggle(task)
                    }
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      task.completed
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-slate-600"
                    }`}
                  >
                    {task.completed && (
                      <CheckCircle2
                        size={15}
                        className="text-white"
                      />
                    )}
                  </button>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">

                    <h3
                      className={`font-medium ${
                        task.completed
                          ? "text-slate-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">

                      <span>
                        {task.category}
                      </span>

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
                      handleDelete(task._id)
                    }
                    className="rounded-lg p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
                    title="Delete task"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* SUMMARY */}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <ListTodo className="text-indigo-400" size={20} />
            <p className="mt-3 text-sm text-slate-500">
              Total
            </p>
            <p className="text-2xl font-bold text-white">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <Clock3 className="text-amber-400" size={20} />
            <p className="mt-3 text-sm text-slate-500">
              Pending
            </p>
            <p className="text-2xl font-bold text-white">
              {tasks.filter((task) => !task.completed).length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <p className="mt-3 text-sm text-slate-500">
              Completed
            </p>
            <p className="text-2xl font-bold text-white">
              {tasks.filter((task) => task.completed).length}
            </p>
          </div>

        </div>

      </div>

      {showAddTask && (
        <AddTaskModal
          onClose={() =>
            setShowAddTask(false)
          }
          onAdd={handleAddTask}
        />
      )}

    </main>
  );
}

export default Tasks;