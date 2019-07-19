const express = require("express");
const router = new express.Router();
const auth = require("../app/middlewares/auth");
const BranchController = require("../app/controllers/branch");

router.post("/branches", auth, BranchController.store);

router.get("/branches", BranchController.index);

router.get("/branches/:id", BranchController.show);

module.exports = router;
