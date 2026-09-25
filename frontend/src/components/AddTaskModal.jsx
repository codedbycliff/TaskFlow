import { useState } from "react";

import {
  X,
  Plus,
} from "lucide-react";

function AddTaskModal({
  onClose,
  onAdd,
}) {
  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setSaving(true);

      await onAdd({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div>
            <h2 className="text-lg font-semibold text-white">
              Create New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add something you want to get done.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={19} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Task title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Finish project documentation"
              autoFocus
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Add some details..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          {/* CATEGORY + PRIORITY */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="General">
                  General
                </option>

                <option value="Development">
                  Development
                </option>

                <option value="College">
                  College
                </option>

                <option value="Personal">
                  Personal
                </option>

                <option value="Work">
                  Work
                </option>

                <option value="Health">
                  Health
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

          </div>

          {/* DUE DATE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Due date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                !title.trim() || saving
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Plus size={17} />

              {saving
                ? "Creating..."
                : "Create Task"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddTaskModal;