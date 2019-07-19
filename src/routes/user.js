const express = require("express")
const router = new express.Router()
const auth = require("../app/middlewares/auth")
const UserController = require("../app/controllers/UserController")

router.get("/me", UserController.show)

router.patch("/me", UserController.update)

router.delete("/me", UserController.delete)

module.exports = router
