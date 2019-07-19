const express = require("express");
const router = new express.Router();
const auth = require("../app/middlewares/auth");
const SchoolController = require("../app/controllers/school");

router.post("/schools", auth, SchoolController.store);

router.get("/schools", SchoolController.index);

router.get("/schools/:id", SchoolController.show);

module.exports = router;
