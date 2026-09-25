import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../services/api";

const AuthContext = createContext(null);

// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------
  // RESTORE LOGIN SESSION
  // ------------------------------------------

  useEffect(() => {
    const storedUser =
      localStorage.getItem("taskflow_user");

    const token =
      localStorage.getItem("taskflow_token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Failed to restore user session:",
          error
        );

        localStorage.removeItem("taskflow_user");
        localStorage.removeItem("taskflow_token");
      }
    }

    setLoading(false);
  }, []);

  // ------------------------------------------
  // LOGIN
  // ------------------------------------------

  const login = async (email, password) => {
    const data = await loginUser(
      email,
      password
    );

    localStorage.setItem(
      "taskflow_token",
      data.token
    );

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data;
  };

  // ------------------------------------------
  // REGISTER
  // ------------------------------------------

  const register = async (
    name,
    email,
    password
  ) => {
    const data = await registerUser(
      name,
      email,
      password
    );

    localStorage.setItem(
      "taskflow_token",
      data.token
    );

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data;
  };

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () => {
  return useContext(AuthContext);
};