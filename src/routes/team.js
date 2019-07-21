const express = require("express")
const router = new express.Router()
const auth = require("../app/middlewares/auth")
const TeamController = require("../app/controllers/TeamController")

router.post("/teams", TeamController.store)

router.get("/teams", TeamController.index)

router.get("/teams/:id", TeamController.show)

router.put("/teams/:id", TeamController.update)

router.delete("/teams/:id", TeamController.destroy)

module.exports = router
