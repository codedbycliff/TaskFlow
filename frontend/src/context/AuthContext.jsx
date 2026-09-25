import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5050/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("taskflow_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("taskflow_user");
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("taskflow_token") || ""
  );

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed.");
    }

    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed.");
    }

    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");

    setToken("");
    setUser(null);
  };

  const getAuthHeaders = () => {
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: false,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}