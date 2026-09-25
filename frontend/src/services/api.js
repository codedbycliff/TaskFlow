const API_URL = "https://taskflow-backend-407c.onrender.com/api";

const getToken = () => {
  return localStorage.getItem("taskflow_token") || "";
};

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

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

// GET ALL TASKS
export const getTasks = async () => {
  return request("/tasks");
};

// CREATE TASK
export const createTask = async (taskData) => {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

// UPDATE TASK
export const updateTask = async (taskId, taskData) => {
  return request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

// DELETE TASK
export const deleteTask = async (taskId) => {
  return request(`/tasks/${taskId}`, {
    method: "DELETE",
  });
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};