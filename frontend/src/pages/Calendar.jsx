
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { getTasks } from "../services/api";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTasks();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const grouped = tasks.reduce((groups, task) => {
    const date = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : "No due date";

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(task);

    return groups;
  }, {});

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

        <div className="flex items-center gap-3">
          <CalendarDays
            className="text-indigo-400"
            size={28}
          />

          <div>
            <h2 className="text-3xl font-bold text-white">
              Calendar
            </h2>

            <p className="mt-2 text-slate-400">
              View your tasks by due date.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {loading ? (
            <div className="text-slate-500">
              Loading calendar...
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-500">
              No tasks available.
            </div>
          ) : (
            Object.entries(grouped).map(
              ([date, dateTasks]) => (
                <div
                  key={date}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60"
                >
                  <div className="border-b border-slate-800 px-6 py-4">
                    <h3 className="font-semibold text-white">
                      {date}
                    </h3>
                  </div>

                  <div className="divide-y divide-slate-800">
                    {dateTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center gap-4 px-6 py-4"
                      >
                        <CheckCircle2
                          size={19}
                          className={
                            task.completed
                              ? "text-indigo-400"
                              : "text-slate-600"
                          }
                        />

                        <div>
                          <p className="font-medium text-white">
                            {task.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {task.category} •{" "}
                            {task.priority}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </main>
  );
}

export default Calendar;
