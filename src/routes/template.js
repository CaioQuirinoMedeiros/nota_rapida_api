const express = require("express")
const router = new express.Router()
const TemplateController = require("../app/controllers/TemplateController")

router.post("/templates", TemplateController.store)

router.get("/templates", TemplateController.index)

router.get("/templates/:id", TemplateController.show)

module.exports = router
