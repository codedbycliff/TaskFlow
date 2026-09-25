const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// Every task route requires authentication
router.use(authMiddleware);

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get one task
router.get("/:id", getTask);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

module.exports = router;