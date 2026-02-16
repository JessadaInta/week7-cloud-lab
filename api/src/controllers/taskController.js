// src/controllers/taskController.js
// Presentation Layer - HTTP Request Handlers

const taskService = require('../services/taskService');

// GET /api/tasks
const getAllTasks = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.priority) filters.priority = req.query.priority;

        const tasks = await taskService.getAllTasks(filters);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks.map(t => t.toJSON())
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/tasks/stats
const getStatistics = async (req, res, next) => {
    try {
        const stats = await taskService.getStatistics();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }

        const task = await taskService.getTaskById(id);

        res.json({
            success: true,
            data: task.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
    try {
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority
        };

        const task = await taskService.createTask(taskData);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }

        const taskData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority
        };

        Object.keys(taskData).forEach(key => {
            if (taskData[key] === undefined) {
                delete taskData[key];
            }
        });

        const task = await taskService.updateTask(id, taskData);

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: task.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }

        const task = await taskService.updateTaskStatus(id, status);

        res.json({
            success: true,
            message: `Task status updated to ${status}`,
            data: task.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/tasks/:id/next
const moveToNextStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }

        const task = await taskService.moveToNextStatus(id);

        res.json({
            success: true,
            message: `Task moved to ${task.status}`,
            data: task.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }

        await taskService.deleteTask(id);

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTasks,
    getStatistics,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    moveToNextStatus,
    deleteTask
};
