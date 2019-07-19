const express = require("express");
const router = new express.Router();
const User = require("../app/models/user");
const auth = require("../app/middlewares/auth");
const AuthController = require("../app/controllers/auth");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/logout", auth, AuthController.logout);

router.post("/logoutAll", auth, AuthController.logoutAll);

module.exports = router;
