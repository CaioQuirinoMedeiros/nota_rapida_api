const express = require("express")
const router = new express.Router()
const BranchController = require("../app/controllers/BranchController")

router.post("/branches", BranchController.store)

router.get("/branches", BranchController.index)

router.get("/branches/:id", BranchController.show)

router.put("/branches/:id", BranchController.update)

router.delete("/branches/:id", BranchController.destroy)

module.exports = router
