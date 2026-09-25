const express = require("express");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// GET /api/tasks
router.get("/", getTasks);

// GET /api/tasks/:id
router.get("/:id", getTask);

// POST /api/tasks
router.post("/", createTask);

// PUT /api/tasks/:id
router.put("/:id", updateTask);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

module.exports = router;
