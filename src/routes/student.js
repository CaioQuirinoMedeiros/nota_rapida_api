const express = require("express")
const router = new express.Router()
const auth = require("../app/middlewares/auth")
const StudentController = require("../app/controllers/StudentController")

router.post("/students", auth, StudentController.store)

router.get("/students", StudentController.index)

router.get("/students/:id", auth, StudentController.show)

module.exports = router
