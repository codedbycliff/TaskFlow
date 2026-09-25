const Task = require("../models/Task");

// ==========================================
// CREATE TASK
// ==========================================

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      userId: req.userId,
      title: title.trim(),
      description: description || "",
      category: category || "General",
      priority: priority || "Medium",
      dueDate: dueDate || null,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

// ==========================================
// GET ALL TASKS
// ==========================================

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
    });
  }
};

// ==========================================
// GET SINGLE TASK
// ==========================================

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task.",
    });
  }
};

// ==========================================
// UPDATE TASK
// ==========================================

const updateTask = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "category",
      "priority",
      "dueDate",
      "completed",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty.",
        });
      }

      updates.title = updates.title.trim();
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
};

// ==========================================
// DELETE TASK
// ==========================================

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task.",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};