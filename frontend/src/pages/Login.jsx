
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">✓</span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            TaskFlow
          </h1>

          <p className="text-gray-400 mt-2">
            Stay productive
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-2">
            {isRegistering ? "Create your account" : "Welcome back"}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            {isRegistering
              ? "Create an account to start managing your tasks."
              : "Sign in to continue to your dashboard."}
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Cliff Rodrigues"
                  required
                  className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg bg-[#020617] border border-slate-700 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 font-semibold text-white transition"
            >
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              {isRegistering
                ? "Login instead"
                : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
