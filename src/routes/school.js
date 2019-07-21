const express = require("express")
const router = new express.Router()
const auth = require("../app/middlewares/auth")
const SchoolController = require("../app/controllers/SchoolController")

router.post("/schools", SchoolController.store)

router.get("/schools", SchoolController.index)

router.get("/schools/:id", SchoolController.show)

router.put("/schools/:id", SchoolController.update)

router.delete("/schools/:id", SchoolController.destroy)

module.exports = router
