const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middlewares/auth");

const registerSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
  type: Joi.string().valid("doctor", "patient").required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

router.post(
  "/register",
  // validator.body(registerSchema),
  authControllers.postRegister
);

router.post("/login", validator.body(loginSchema), authControllers.postLogin);

// test route to verify if our middleware is working
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
