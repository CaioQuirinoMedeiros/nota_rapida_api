const express = require("express");
const router = new express.Router();
const auth = require("../app/middlewares/auth");
const UserController = require("../app/controllers/UserController");

router.get("/me", auth, UserController.show);

router.patch("/me", auth, UserController.update);

router.delete("/me", auth, UserController.delete);

module.exports = router;
