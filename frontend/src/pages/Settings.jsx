
import { User, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function Settings() {
  const { user } = useAuth();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">

        <h2 className="text-3xl font-bold text-white">
          Settings
        </h2>

        <p className="mt-2 text-slate-400">
          Manage your TaskFlow account.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

          <h3 className="font-semibold text-white">
            Account Information
          </h3>

          <div className="mt-6 space-y-5">

            <div className="flex items-center gap-4 rounded-xl bg-slate-950 p-4">
              <User
                size={20}
                className="text-indigo-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-sm text-white">
                  {user?.name || "Cliff Rodrigues"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-950 p-4">
              <Mail
                size={20}
                className="text-indigo-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-sm text-white">
                  {user?.email || "cliff@test.com"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-950 p-4">
              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Account Status
                </p>

                <p className="mt-1 text-sm text-emerald-400">
                  Authenticated
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default Settings;
