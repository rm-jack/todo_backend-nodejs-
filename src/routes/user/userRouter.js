const express = require("express");
const router = express.Router();

const controller = require("../../controller/user/userController");
const { body } = require("express-validator");

router.post(
  "/signUp",
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 5 }),
  body("name").notEmpty().isString(),
  controller.signUp
);

router.post(
  "/logIn",
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 5 }),
  controller.logIn
);

module.exports = router;
