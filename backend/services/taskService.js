const taskModel = require("../models/taskModel");


async function listTasks() {
    return await taskModel.findAll();
}


async function getTask(id) {
    const task = await taskModel.findById(id);

    if (!task) {
        throw new Error("Task not found");
    }

    return task;
}


async function createTask(data) {

    if (!data.project_id || !data.title) {
        throw new Error(
            "project_id and title are required"
        );
    }

    return await taskModel.create(data);
}


async function updateTask(id, data) {

    const task = await taskModel.findById(id);

    if (!task) {
        throw new Error("Task not found");
    }

    return await taskModel.update(id,data);
}


async function deleteTask(id) {

    const task = await taskModel.findById(id);

    if (!task) {
        throw new Error("Task not found");
    }

    return await taskModel.remove(id);
}


module.exports = {
    listTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};