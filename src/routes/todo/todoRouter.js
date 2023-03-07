const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const todoController = require("../../controller/todo/todoController");

router.get("/", todoController.getAll);
router.post(
  "/",
  body("content").notEmpty().isString(),
  body("userid").notEmpty(),
  todoController.createTodo
);
router.patch(
  "/:id",
  body("content").isString(),
  body("status").isInt(),
  body("userid").notEmpty(),
  todoController.setTodo
);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
