const express = require("express")
const router = new express.Router()
const ExamController = require("../app/controllers/ExamController")

router.post("/exams", ExamController.store)

router.get("/exams", ExamController.index)

router.get("/exams/:id", ExamController.show)

router.put("/exams/:id", ExamController.update)

router.delete("/exams/:id", ExamController.destroy)

module.exports = router
