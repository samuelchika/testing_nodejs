const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todo.controller");

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodo);
router.get("/:id", todoController.getTodoById);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
