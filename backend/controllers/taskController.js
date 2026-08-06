const taskService = require("../services/taskService");


async function getAll(req,res,next){

    try{

        const tasks = await taskService.listTasks();

        res.json(tasks);

    }catch(error){

        next(error);

    }

}



async function getOne(req,res,next){

    try{

        const task = await taskService.getTask(
            req.params.id
        );

        res.json(task);

    }catch(error){

        next(error);

    }

}



async function create(req,res,next){

    try{

        const task = await taskService.createTask(
            req.body
        );

        res.status(201).json(task);

    }catch(error){

        next(error);

    }

}



async function update(req,res,next){

    try{

        const task = await taskService.updateTask(
            req.params.id,
            req.body
        );

        res.json(task);

    }catch(error){

        next(error);

    }

}



async function remove(req,res,next){

    try{

        await taskService.deleteTask(
            req.params.id
        );

        res.json({
            message:"Task deleted"
        });


    }catch(error){

        next(error);

    }

}


async function changeStatus(req,res,next){

    try{

        const task =
            await taskService.changeTaskStatus(
                req.params.id,
                req.body.status_id
            );

        res.json(task);

    }catch(error){

        next(error);

    }

}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    changeStatus
};