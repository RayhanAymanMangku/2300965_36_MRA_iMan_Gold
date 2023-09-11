const express = require("express");
const todoController = require("../../src/controllers/todoController");
const router = express.Router();

router.post("/addTodo/:userId", todoController.addTodo);

router.get("/getAllTodos/:userId", todoController.getAllTodos);

router.post("/updateTodos/:userId", todoController.updateTodos);

router.delete("/deleteTodos/:todoId", todoController.deleteTodos);

module.exports = router;
