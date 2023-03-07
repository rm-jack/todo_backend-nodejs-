const database = require("../../database/DataBase");
const path = require("path");
const { validationResult } = require("express-validator");
const { RESPONSE_CODE, RESPONSE_FIELD } = require("../../common/ResponseConst");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const myBatisMapper = require("mybatis-mapper");
myBatisMapper.createMapper([path.resolve("src/database/mapper/user/user.xml")]);

const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const params = { email: email };
  const selectQuery = myBatisMapper.getStatement("USER", "selectUser", params);
  const pool = await database.getPool();
  if (pool) {
    try {
      const [row] = await pool.query(selectQuery);
      if (row) {
        res.json(RESPONSE_CODE.ID_DUPLICATE);
      }
      const password = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const insertQuery = myBatisMapper.getStatement("USER", "insertUser", {
        email: email,
        password: hash,
        name: req.body.name,
      });
      const result = await pool.query(insertQuery);
      if (result) {
        res.json(RESPONSE_CODE.SUCCESS);
      }
    } catch (e) {
      res.json(RESPONSE_CODE.DB_ERROR);
    }
  }
};

const logIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const selectQuery = myBatisMapper.getStatement("USER", "selectUser", {
    email: req.body.email,
  });
  const pool = await database.getPool();
  try {
    const [rows] = await pool.query(selectQuery);
    if (rows) {
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(req.body.password, salt);
      const isValid = await bcrypt.compare(req.body.password, hashed);
      if (isValid) {
        const payLoad = {
          email: rows[0].email,
          name: rows[0].name,
          id: rows[0].id,
        };
        const token = jwt.sign({ data: payLoad }, process.env.SECRET_KEY, {
          expiresIn: process.env.EXPIRE_MIN,
          issuer: process.env.ISSUER,
        });
        res.json({ ...RESPONSE_CODE.SUCCESS, token: token });
      }
    } else {
      res.json(RESPONSE_CODE.NO_DATA);
    }
  } catch (e) {
    res.json(RESPONSE_CODE.DB_ERROR);
  }
};

module.exports.signUp = signUp;
module.exports.logIn = logIn;
