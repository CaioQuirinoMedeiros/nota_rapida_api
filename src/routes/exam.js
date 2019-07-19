const express = require("express")
const router = new express.Router()
const ExamController = require("../app/controllers/ExamController")

router.post("/exams", ExamController.store)

router.get("/exams", ExamController.index)

router.get("/exams/:id", ExamController.show)

module.exports = router
