const express = require("express")
const router = new express.Router()
const auth = require("../app/middlewares/auth")
const StudentController = require("../app/controllers/StudentController")

router.post("/students", StudentController.store)

router.get("/students", StudentController.index)

router.get("/students/:id", StudentController.show)

module.exports = router
