const TodoModel = require('../models/todo.models');

exports.createTodo = async (req, res, next) => {
    try {
        if(req.body?.done === undefined) throw new Error("Done property is missing")
        const createModel = await TodoModel.create({...req.body});
    res.status(201).json(createModel);
    } catch (error) {
        next(error);
    }
};
 
exports.getTodo = async (req, res, next) => { 
    try {
        const todos = await TodoModel.find({});
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
}

exports.getTodoById = async (req, res, next) => { 
    try {
        const todo = await TodoModel.findById(req.params.id);
        if(!todo) return res.status(404).json({message: "Todo not found"});
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

exports.updateTodo = async (req, res, next) => { 
    try {
        const todo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false,
            runValidators: true
        });
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

exports.deleteTodo = async (req, res, next) => { 
    try {
        const delTodo = await TodoModel.findByIdAndDelete(req.params.id);
        if (!delTodo) return res.status(404).json({ message: "Todo not found" });
        res.status(204).json(delTodo);
    } catch (error) {
        next(error)
    }
}