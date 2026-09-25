import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  ListTodo,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "My Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName =
    user?.name ||
    user?.username ||
    "Cliff Rodrigues";

  const firstLetter =
    displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 lg:flex">

      {/* LOGO */}

      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
          <ListTodo
            size={22}
            className="text-white"
          />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            Task<span className="text-indigo-400">
              Flow
            </span>
          </h1>

          <p className="text-xs text-slate-500">
            Stay productive
          </p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="mt-10 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM */}

      <div className="mt-auto space-y-2">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              isActive
                ? "bg-indigo-500/15 text-indigo-400"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>

        {/* USER */}

        <div className="mt-4 flex items-center gap-3 border-t border-slate-800 px-2 pt-5">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            {firstLetter}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-slate-500">
              Developer
            </p>
          </div>

        </div>

      </div>
    </aside>
  );
}

export default Sidebar;