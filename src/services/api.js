const API_URL = "http://localhost:5050/api";

// ==========================================
// GET AUTH TOKEN
// ==========================================

const getToken = () => {
  return localStorage.getItem("taskflow_token");
};

// ==========================================
// GENERIC API REQUEST
// ==========================================

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
};

// ==========================================
// AUTH
// ==========================================

export const loginUser = async (email, password) => {
  return request("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async (
  name,
  email,
  password
) => {
  return request("/auth/register", {
    method: "POST",

    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

// ==========================================
// TASKS
// ==========================================

export const getTasks = async () => {
  return request("/tasks");
};

export const createTask = async (task) => {
  return request("/tasks", {
    method: "POST",

    body: JSON.stringify(task),
  });
};

export const updateTask = async (id, updates) => {
  return request(`/tasks/${id}`, {
    method: "PUT",

    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (id) => {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
};