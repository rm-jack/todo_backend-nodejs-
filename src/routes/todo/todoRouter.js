const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {getAll, setTodo, createTodo, deleteTodo} = require("../../controller/todo/todoController");

router.get("/", getAll);
router.post(
  "/",
  body("content").notEmpty().isString(),
  body("userid").notEmpty(),
  createTodo
);
router.patch(
  "/:id",
  body("content").isString(),
  body("status").isInt(),
  body("userid").notEmpty(),
  setTodo
);
router.delete("/:id", deleteTodo);

module.exports = router;
