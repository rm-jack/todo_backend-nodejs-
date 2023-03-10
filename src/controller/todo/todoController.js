const { getPool } = require("../../database/DataBase");
const path = require("path");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { RESPONSE_CODE } = require("../../common/ResponseConst");
const myBatisMapper = require("mybatis-mapper");
myBatisMapper.createMapper([path.resolve("src/database/mapper/todo/todo.xml")]);

const getAll = async (req, res) => {
  if (req.headers.hasOwnProperty("authorization")) {
    let token = req.headers["authorization"];
    const isBearer = Number(token.indexOf("Bearer")) === 0;
    if (isBearer) {
      try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userid = Number(decoded.data.id);
        const getTodoQuery = myBatisMapper.getStatement("TODO", "selectTodo", {
          userid: userid,
        });
        const pool = await getPool();
        const [rows] = await pool.query(getTodoQuery);
        res.json({ ...RESPONSE_CODE.SUCCESS, rows: rows });
      } catch (e) {
        res.json(RESPONSE_CODE.TOKEN_EXPIRED);
      }
    }
  } else {
    res.json(RESPONSE_CODE.NO_TOKEN);
  }
};

const createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.headers.hasOwnProperty("authorization")) {
    let token = req.headers["authorization"];
    const isBearer = Number(token.indexOf("Bearer")) === 0;
    if (isBearer) {
      try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userid = Number(decoded.data.id);
        const insertTodoQuery = myBatisMapper.getStatement(
          "TODO",
          "insertTodo",
          {
            content: req.body.content,
            userid: userid,
          }
        );
        const pool = await getPool();
        const [rows] = await pool.query(insertTodoQuery);
        res.json({ ...RESPONSE_CODE.SUCCESS, rows: rows });
      } catch (e) {
        res.json(RESPONSE_CODE.TOKEN_EXPIRED);
      }
    }
  } else {
    res.json(RESPONSE_CODE.NO_TOKEN);
  }
};

const setTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.headers.hasOwnProperty("authorization")) {
    let token = req.headers["authorization"];
    const isBearer = Number(token.indexOf("Bearer")) === 0;
    if (isBearer) {
      try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userid = Number(decoded.data.id);
        const params = {
          content: req.body.content,
          userid: userid,
          status: req.body.status,
          id: req.params.id,
        };
        const updateTodoQuery = myBatisMapper.getStatement(
          "TODO",
          "updateTodo",
          params
        );
        const pool = await getPool();
        const [rows] = await pool.query(updateTodoQuery);
        res.json({ ...RESPONSE_CODE.SUCCESS, rows: rows });
      } catch (e) {
        res.json(RESPONSE_CODE.TOKEN_EXPIRED);
      }
    }
  } else {
    res.json(RESPONSE_CODE.NO_TOKEN);
  }
};

const deleteTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.headers.hasOwnProperty("authorization")) {
    let token = req.headers["authorization"];
    const isBearer = Number(token.indexOf("Bearer")) === 0;
    if (isBearer) {
      try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userid = Number(decoded.data.id);
        const params = {
          userid: userid,
          id: req.params.id,
        };
        const deleteTodoQuery = myBatisMapper.getStatement(
          "TODO",
          "deleteTodo",
          params
        );
        const pool = await getPool();
        const [rows] = await pool.query(deleteTodoQuery);
        res.json({ ...RESPONSE_CODE.SUCCESS, rows: rows });
      } catch (e) {
        res.json(RESPONSE_CODE.TOKEN_EXPIRED);
      }
    }
  } else {
    res.json(RESPONSE_CODE.NO_TOKEN);
  }
};

module.exports = { getAll, createTodo, setTodo, deleteTodo };
