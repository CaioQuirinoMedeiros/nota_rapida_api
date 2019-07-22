const express = require("express")
const router = new express.Router()
const StudentController = require("../app/controllers/StudentController")

router.post("/students", StudentController.store)

router.get("/students", StudentController.index)

router.get("/students/:id", StudentController.show)

router.put("/students/:id", StudentController.update)

router.delete("/students/:id", StudentController.destroy)

module.exports = router
