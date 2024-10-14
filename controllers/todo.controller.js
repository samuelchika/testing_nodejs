const TodoModel = require('../models/todo.models');

exports.createTodo = (req, res, next) => {

    const createModel = TodoModel.createTodo(req.body);
    res.status(201).json(createModel);
 };