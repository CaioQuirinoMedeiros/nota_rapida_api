const express = require("express")
const router = new express.Router()
const TestController = require("../app/controllers/TestController")

router.post("/tests", TestController.store)

router.get("/tests", TestController.index)

router.get("/tests/:id", TestController.show)

module.exports = router
